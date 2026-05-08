import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de login
    return <Navigate to="/login" replace />;
  }

  return children;
}
