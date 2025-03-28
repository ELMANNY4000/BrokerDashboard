import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve index.html for all routes (for SPA behavior)
app.get('*', (req, res) => {
  // Skip for API routes or if requesting a specific file
  if (req.originalUrl.startsWith('/api') || req.originalUrl.includes('.')) {
    return;
  }
  
  const publicPath = path.resolve(process.cwd(), 'public');
  const requestPath = path.join(publicPath, req.path);
  
  // If a specific HTML file is requested (like /users.html), serve it
  if (fs.existsSync(requestPath + '.html')) {
    return res.sendFile(requestPath + '.html');
  }
  
  // Otherwise send the index.html file
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});