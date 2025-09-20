# Edu Frontend React TSX

This is the TypeScript (TSX) version of the Edu Frontend React project.

## Features

- **TypeScript Support**: Full TypeScript integration with proper type definitions
- **React 19**: Latest React version with modern features
- **Redux Toolkit**: State management with TypeScript support
- **React Router**: Client-side routing
- **Styled Components**: CSS-in-JS styling
- **Material-UI**: UI component library
- **Vite**: Fast build tool and development server

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── routes/        # Routing configuration
├── store/         # Redux store and slices
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── api.ts         # API configuration
├── main.tsx       # Application entry point
└── App.tsx        # Main App component
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## TypeScript Configuration

The project includes:
- `tsconfig.json`: TypeScript compiler configuration
- `tsconfig.node.json`: Node.js specific TypeScript configuration
- ESLint configuration for TypeScript
- Proper type definitions for all components and utilities

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint with TypeScript support
- `npm run preview`: Preview production build 