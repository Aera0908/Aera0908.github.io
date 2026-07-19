const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

// Simple static file server
const server = http.createServer((req, res) => {
  // Decode URL in case of spaces/special chars
  let filePath = path.join(__dirname, decodeURIComponent(req.url));
  
  // If request is root, serve our source HTML
  if (req.url === '/' || req.url === '') {
    filePath = path.join(__dirname, 'project_archive_source.html');
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Local HTTP server running at http://localhost:${PORT}`);
  console.log('Spawning Microsoft Edge in headless mode to generate PDF...');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outPdf = path.join(__dirname, 'Aira_Ynte_Project_Archive.pdf');
  const targetUrl = `http://localhost:${PORT}/project_archive_source.html`;
  
  // Chromium print flags
  // --headless=new runs the modern headless engine
  // --disable-gpu prevents GPU acceleration issues in headless
  // --print-to-pdf outputs the file
  // --print-to-pdf-no-header hides default headers (date, page number, URL)
  // --no-margins matches our A4 margin-less page CSS styling
  const cmd = `& "${edgePath}" --headless=new --disable-gpu --print-to-pdf="${outPdf}" --print-to-pdf-no-header --no-margins "${targetUrl}"`;

  console.log(`Running command in PowerShell: ${cmd}`);

  // Exec in powershell
  const child = exec(cmd, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error printing PDF: ${error.message}`);
    } else {
      console.log(`\n============================================================`);
      console.log(`Success! PDF archive generated successfully.`);
      console.log(`File Path: ${outPdf}`);
      console.log(`============================================================\n`);
    }

    // Shut down server
    server.close(() => {
      console.log('Server stopped.');
      process.exit(error ? 1 : 0);
    });
  });
});
