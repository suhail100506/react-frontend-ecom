# E-Commerce React Frontend

React-based frontend for the e-commerce application.

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Tailwind CSS** - Styling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Backend Connection

Make sure the backend server is running on `http://localhost:3000` before starting the frontend.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # Context providers
│   ├── assets/         # Images and static files
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML template
└── vite.config.js      # Vite configuration
```
