# User Management System

A simple user management application built with Node.js, Express.js, and vanilla JavaScript.

## Features

- Home page with a table listing all users
- Add new user page with a form to create users
- About us page with application information
- Middleware that adds creation date for new users
- Delete functionality for existing users
- JSON file-based data storage

## Project Structure

```
question3/
├── app.js                # Main server file
├── data/
│   └── users.json        # JSON file for storing user data
├── public/               # Static files
│   ├── css/
│   │   └── style.css     # CSS styles
│   ├── js/
│   │   ├── script.js     # Main JS for home page
│   │   └── add-user.js   # JS for add user page
│   ├── index.html        # Home page
│   ├── add-user.html     # Add user page
│   └── about.html        # About us page
├── package.json          # Project configuration
└── README.md             # This file
```

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

Start the server:
```
npm start
```

The application will be available at http://localhost:3000

## Development

For development with automatic restarts when files change:
```
npm install -g nodemon   # Install nodemon globally (if not already installed)
npm run dev
``` 