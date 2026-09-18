import fs from "fs";
import path from "path";
import { searchconsole } from "@googleapis/searchconsole";
import { GoogleAuth } from "google-auth-library";

const OUTPUT_FILE = path.join(process.cwd(), "src", "data", "stickout-search-console.json");
const TARGET_SITE = "https://stickout.vercel.app/";

async function getAuthCredentials() {
  // 1. Check environment variable (CI / GitHub Actions)
  if (process.env.GSC_CREDENTIALS) {
    try {
      let credsJson = process.env.GSC_CREDENTIALS.trim();
      if (!credsJson.startsWith("{")) {
        // Handle base64 encoded credentials if supplied that way
        credsJson = Buffer.from(credsJson, "base64").toString("utf-8");
      }
      const credentials = JSON.parse(credsJson);
      return new GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      });
    } catch (e) {
      console.warn("⚠️ Failed to parse GSC_CREDENTIALS environment variable:", e.message);
    }
  }

  // 2. Check local key files in root directory
  const root = process.cwd();
  const keyFiles = fs
    .readdirSync(root)
    .filter(
      (f) =>
        (f.startsWith("portfolio-analytics-") && f.endsWith(".json")) ||
        f === "gsc-key.json"
    );

  if (keyFiles.length > 0) {
    const keyPath = path.join(root, keyFiles[0]);
    return new GoogleAuth({
      keyFile: keyPath,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
  }

  return null;
}

async function fetchGscData() {
  console.log("==> [GSC] Initializing Google Search Console fetch for StickOut...");

  const auth = await getAuthCredentials();
  if (!auth) {
    console.warn("⚠️ [GSC] No credentials found (neither GSC_CREDENTIALS env nor local key file).");
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log("ℹ️ [GSC] Retaining existing data file at", OUTPUT_FILE);
      return;
    }
    console.warn("⚠️ [GSC] No existing data file found. Creating empty placeholder.");
    writeFallback();
    return;
  }

  const client = searchconsole({
    version: "v1",
    auth,
  });

  const today = new Date();
  // GSC data typically trails by 2-3 days
  const endDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const startDate = new Date(today.getTime() - 92 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  console.log(`==> [GSC] Querying site: ${TARGET_SITE} (${startDate} to ${endDate})...`);

  try {
    // 1. Overall Summary
    const summaryRes = await client.searchanalytics.query({
      siteUrl: TARGET_SITE,
      requestBody: {
        startDate,
        endDate,
      },
    });

    const summaryRow = summaryRes.data.rows?.[0] || {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };

    // 2. Top Queries
    const queriesRes = await client.searchanalytics.query({
      siteUrl: TARGET_SITE,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 15,
      },
    });

    const topQueries = (queriesRes.data.rows || []).map((row) => ({
      query: row.keys?.[0] || "",
      clicks: Math.round(row.clicks || 0),
      impressions: Math.round(row.impressions || 0),
      ctr: Number((row.ctr || 0).toFixed(4)),
      position: Number((row.position || 0).toFixed(1)),
    }));

    // 3. Daily Timeline
    const timelineRes = await client.searchanalytics.query({
      siteUrl: TARGET_SITE,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["date"],
      },
    });

    const timeline = (timelineRes.data.rows || [])
      .map((row) => ({
        date: row.keys?.[0] || "",
        clicks: Math.round(row.clicks || 0),
        impressions: Math.round(row.impressions || 0),
        ctr: Number((row.ctr || 0).toFixed(4)),
        position: Number((row.position || 0).toFixed(1)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const payload = {
      siteUrl: TARGET_SITE,
      lastUpdated: new Date().toISOString(),
      dateRange: {
        startDate,
        endDate,
        days: timeline.length,
      },
      summary: {
        clicks: Math.round(summaryRow.clicks || 0),
        impressions: Math.round(summaryRow.impressions || 0),
        ctr: Number((summaryRow.ctr || 0).toFixed(4)),
        position: Number((summaryRow.position || 0).toFixed(1)),
      },
      topQueries,
      timeline,
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`✅ [GSC] Successfully saved Search Console data to: ${OUTPUT_FILE}`);
    console.log(`📊 [GSC] Summary: ${payload.summary.clicks} clicks, ${payload.summary.impressions} impressions, ${(payload.summary.ctr * 100).toFixed(1)}% CTR, pos ${payload.summary.position}`);
  } catch (err) {
    console.error("❌ [GSC] Error during query:", err.message);
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log("ℹ️ [GSC] Retaining existing data file.");
    } else {
      writeFallback();
    }
  }
}

function writeFallback() {
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fallback = {
    siteUrl: TARGET_SITE,
    lastUpdated: new Date().toISOString(),
    dateRange: { startDate: "", endDate: "", days: 0 },
    summary: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: [],
    timeline: [],
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallback, null, 2), "utf-8");
}

fetchGscData();
