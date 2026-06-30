#!/usr/bin/env node
/**
 * build-pdfs.mjs
 * ──────────────
 * Prints the general Resume and CV HTML files to PDF using a headless
 * Chromium-based browser (Chrome or Edge).
 *
 * Output lands in  public/YNTE_Resume.pdf  and  public/YNTE_CV.pdf
 * so the web-resume download / preview buttons pick them up automatically.
 */

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── Locate a Chromium-based browser ─────────────────────────────────────────
function findBrowser() {
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
          ]
        : [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/usr/bin/microsoft-edge',
          ]

  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

// ── Print one HTML file → PDF ───────────────────────────────────────────────
function printPdf(browser, htmlPath, pdfPath) {
  // file:/// URL — works cross-platform
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    fileUrl,
  ]

  console.log(`  ➜  ${pdfPath}`)
  execFileSync(browser, args, { stdio: 'pipe', timeout: 30_000 })
}

// ── Main ────────────────────────────────────────────────────────────────────
const browser = findBrowser()
if (!browser) {
  console.error(
    '✖  No Chromium-based browser found (Chrome or Edge).\n' +
      '   Install one, or manually print the HTML files to PDF.',
  )
  process.exit(1)
}
console.log(`Using browser: ${browser}\n`)

const jobs = [
  {
    html: resolve(ROOT, 'public', 'YNTE_Resume.html'),
    pdf: resolve(ROOT, 'public', 'YNTE_RESUME.pdf'),
  },
  {
    html: resolve(ROOT, 'public', 'YNTE_CV.html'),
    pdf: resolve(ROOT, 'public', 'YNTE_CV.pdf'),
  },
]

let ok = true
for (const { html, pdf } of jobs) {
  try {
    printPdf(browser, html, pdf)
  } catch (err) {
    console.error(`✖  Failed to print ${html}:\n   ${err.message}`)
    ok = false
  }
}

if (ok) {
  console.log('\n✔  All PDFs built successfully.')
} else {
  console.error('\n⚠  Some PDFs failed. Check errors above.')
  process.exit(1)
}
