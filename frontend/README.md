# AI Health Chain - Frontend

A modern React-based frontend for the AI Health Chain healthcare management system.

## Features

- **Home Page**: Landing page with AI Health Chain branding and features overview
- **Navbar**: Navigation with AI Health Chain logo and Contact Us link
- **App Dashboard**: Central hub for accessing different modules
- **Patients Module**: View and manage patient records
- **Doctors Module**: Browse and manage doctor profiles
- **Appointments Module**: Schedule and view appointments

## Tech Stack

- React 19.2.0
- React Router DOM 7.9.6
- Modern CSS with gradient designs
- Responsive layout

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend server running on port 3000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done if you used create-react-app):
```bash
npm install
```

## Running the Application

### Development Mode

1. **Start the backend server first** (from the server directory):
```bash
cd ../server
npm start
```

2. **Start the React development server** (from the frontend directory):
```bash
cd frontend
npm start
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

The application will automatically reload when you make changes.

### Production Build

To create an optimized production build:

```bash
npm run build
```

The build folder will contain the production-ready files.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation component
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.js            # Landing page
│   │   ├── Home.css
│   │   ├── AppDashboard.js    # Main dashboard
│   │   ├── AppDashboard.css
│   │   ├── Patients.js        # Patients management
│   │   ├── Doctors.js         # Doctors directory
│   │   ├── Appointments.js    # Appointments scheduling
│   │   └── DataPages.css      # Shared styles for data pages
│   ├── App.js                 # Main app with routing
│   ├── App.css
│   └── index.js
└── package.json
```

## Routes

- `/` - Home page with features and Launch App button
- `/app` - Main dashboard with module cards
- `/app/patients` - Patients management page
- `/app/doctors` - Doctors directory page
- `/app/appointments` - Appointments scheduling page

## Backend API Integration

The frontend communicates with the backend via the following endpoints:

- `GET /patients` - Fetch all patients
- `GET /doctors` - Fetch all doctors
- `GET /appointments` - Fetch all appointments

The proxy configuration in `package.json` routes API calls to `http://localhost:3000`.

## Styling

The application uses:
- Custom CSS with gradient backgrounds (purple/blue theme)
- Responsive grid layouts
- Hover effects and smooth transitions
- Mobile-friendly design
- Card-based UI components

## External Links

- **Contact Us**: Links to [https://www.aihealthchains.com/](https://www.aihealthchains.com/)

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Quick Start Guide

1. **Clone and install**:
   ```bash
   npm install
   ```

2. **Start backend** (in server directory):
   ```bash
   cd ../server
   npm start
   ```

3. **Start frontend** (in frontend directory):
   ```bash
   npm start
   ```

4. **Navigate**:
   - Home page loads at root (`/`)
   - Click "Launch App" to access dashboard
   - Select modules from dashboard cards
   - Use navbar to return home or contact AI Health Chains

## Troubleshooting

- If the app can't fetch data, ensure the backend server is running on port 3000
- If you see CORS errors, verify that the backend has the `cors` package installed
- Port conflicts: The frontend runs on port 3001 by default; the backend on port 3000

## Contributing

This is part of the AI Health Chain healthcare management system. For issues or improvements, please contact the development team.

## License

UNLICENSED - Private project for AI Health Chain
