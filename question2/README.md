# Student API with Filtering

A simple student management application with a RESTful API that allows you to view and filter students by branch and delete student records.

## Features

- API endpoint to list all students
- Filter students by branch name
- Interactive UI with filter buttons
- Delete student records
- Data stored in a JSON file

## Project Structure

```
question2/
├── app.js                # Main server file
├── data/
│   └── students.json     # JSON file for storing student data
├── public/               # Static files
│   ├── css/
│   │   └── style.css     # CSS styles
│   ├── js/
│   │   └── script.js     # JavaScript for frontend
│   └── index.html        # Main HTML page
├── package.json          # Project configuration
└── README.md             # This file
```

## API Endpoints

- `GET /api/students` - Get all students (can filter with query param `?branch=X`)
- `GET /api/branches` - Get unique branch names for filtering
- `DELETE /api/students/:id` - Delete a student by id

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