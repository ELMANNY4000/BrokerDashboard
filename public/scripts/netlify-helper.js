/**
 * Netlify deployment helper
 * 
 * This file contains utilities to help the application work both locally and when deployed to Netlify
 */

// Check if we're running on Netlify
const isNetlify = window.location.hostname.includes('netlify.app');

// Save this information for other scripts
window.isNetlifyEnvironment = isNetlify;

// Log deployment information
console.log(`Running in ${isNetlify ? 'Netlify' : 'local'} environment`);

// Display Netlify deployment message if applicable
document.addEventListener('DOMContentLoaded', function() {
  if (isNetlify) {
    // Create a small banner to show we're on Netlify
    const banner = document.createElement('div');
    banner.className = 'netlify-banner';
    banner.innerHTML = `
      <div class="netlify-content">
        <span>Deployed on Netlify</span>
        <a href="https://github.com/yourusername/broker-admin" target="_blank" class="netlify-link">
          <i class="fab fa-github"></i> View on GitHub
        </a>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .netlify-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(18, 28, 45, 0.8);
        color: white;
        text-align: center;
        padding: 8px;
        font-size: 14px;
        z-index: 1000;
      }
      .netlify-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
      }
      .netlify-link {
        color: #00AD9F;
        text-decoration: none;
      }
      .netlify-link:hover {
        text-decoration: underline;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);
  }
});