import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction utilitaire pour créer le profil utilisateur dans Firestore
  const createUserProfile = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // S'il n'existe pas déjà, on le crée avec des crédits par défaut
    if (!userSnap.exists()) {
      const isAdmin = user.email === 'sgregoire300@gmail.com';
      await setDoc(userRef, {
        email: user.email,
        credits: isAdmin ? 999 : 1, // Crédits illimités pour l'admin
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      });
    }
  };

  async function signup(email, password) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user);
    return result;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
      return result;
    } catch (error) {
      console.error("Erreur loginWithGoogle:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Écouter les changements du document utilisateur (crédits, rôle, etc.)
        const fetchUserData = (uid, email) => {
          const docRef = doc(db, 'users', uid);
          return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Force admin role for owner
              if (email === 'sgregoire300@gmail.com') {
                data.role = 'admin';
              }
              setUserData(data);
              setLoading(false);
            } else {
              setUserData(null);
              setLoading(false);
            }
          });
        };
        unsubscribeUserDoc = fetchUserData(user.uid, user.email);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
