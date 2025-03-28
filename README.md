# Broker Admin Dashboard

A brokerage admin panel built with vanilla HTML/CSS/JS that allows managing users, adding funds, and sending email notifications.

## Features

- User management (create, edit, view users)
- Transaction management (deposits, withdrawals, transfers)
- Email notifications system
- Authentication system
- Responsive design
- Pure vanilla JavaScript (no frameworks)

## Demo Credentials

- Username: admin
- Password: admin123

## Getting Started

### Local Development

1. Clone this repository
2. Open the `public` directory in your browser or use a local server

```bash
# You can use any local server like live-server, http-server, etc.
# For example, with Node.js and http-server:
npm install -g http-server
http-server ./public
```

### Deployment to Netlify

This project is ready to be deployed to Netlify. You can deploy it in just a few steps:

1. Sign up or log in to [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect your Git provider and select this repository
4. Set the following deployment settings:
   - Build command: `echo "No build command needed for static site"`
   - Publish directory: `public`
5. Click "Deploy site"

Alternatively, you can drag and drop the `public` directory to Netlify's manual deploy section.

#### Deployment Notes

- The application uses local storage to persist data, so all data is stored in the browser and not on a server
- Each browser/device will have its own separate data store
- This is a demo application intended for showcasing UI and interaction patterns

## Project Structure

```
.
├── netlify/
│   └── functions/       # Serverless functions for Netlify
├── public/              # Main application files (static site)
│   ├── scripts/         # JavaScript files
│   │   ├── api.js       # API functions for data management
│   │   ├── auth.js      # Authentication functions
│   │   ├── main.js      # Common utility functions
│   │   └── ...          # Page-specific scripts
│   ├── styles/          # CSS files
│   │   └── main.css     # Main stylesheet
│   ├── index.html       # Dashboard page
│   ├── login.html       # Login page
│   ├── users.html       # Users management page
│   ├── transactions.html # Transactions management page
│   └── email-notifications.html # Email notifications page
└── netlify.toml         # Netlify configuration
```

## Browser Compatibility

The application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[MIT License](LICENSE)

---

This project is built with pure HTML, CSS, and JavaScript without any frameworks or libraries, demonstrating that impressive admin interfaces can be built with vanilla web technologies.