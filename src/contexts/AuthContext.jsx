import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
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

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Garantir que le profil existe dans Firestore
          await createUserProfile(user);
          
          // Écouter les changements du document utilisateur
          const docRef = doc(db, 'users', user.uid);
          unsubscribeUserDoc = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Forcer le rôle admin pour le propriétaire
              if (user.email === 'sgregoire300@gmail.com') {
                data.role = 'admin';
              }
              setUserData(data);
            } else {
              setUserData(null);
            }
            setLoading(false);
          }, (error) => {
            console.error("Erreur lors de l'écoute du profil:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Erreur lors de l'initialisation de l'utilisateur:", error);
          setLoading(false);
        }
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

  async function addCredits(amount) {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(userRef, {
        credits: increment(amount)
      }, { merge: true });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de crédits:", error);
      throw error;
    }
  }

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    loginWithGoogle,
    addCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
