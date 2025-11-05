import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Afro, Indigena, Minero, Campesino, Bonus, Ayuda, Creacion, WelcomeScreen } from './pages';
import { Leaderboard } from "./components/Leadeboard.jsx"; 

// Componente de ruta protegida
const ProtectedRoute = ({ children }) => {
  const isRegistered = sessionStorage.getItem('registeredUser') === 'true';
  
  return isRegistered ? children : <Navigate to="/creacion" replace />;
};

function App() {
  return (
    <Router>
      <Leaderboard />
      <Routes>
        <Route path="/creacion" element={<Creacion />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Afro" 
          element={
            <ProtectedRoute>
              <Afro />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Indigena" 
          element={
            <ProtectedRoute>
              <Indigena />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Minero" 
          element={
            <ProtectedRoute>
              <Minero />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Campesino" 
          element={
            <ProtectedRoute>
              <Campesino />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Bonus" 
          element={
            <ProtectedRoute>
              <Bonus />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Ayuda" 
          element={
            <ProtectedRoute>
              <Ayuda />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;