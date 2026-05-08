import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function CreditsWidget() {
  const { currentUser } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    
    // Écoute en temps réel du document utilisateur
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setCredits(docSnap.data().credits || 0);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="bg-brand-dark p-4 rounded-xl border border-white/10 shadow-lg">
      <h4 className="text-sm font-medium text-slate-300 mb-2">Crédits Vidéos</h4>
      <div className="flex justify-between items-center text-xs mb-3">
        <span className="text-brand-gold font-bold text-lg">{credits}</span>
        <span className="text-slate-500 text-right">vidéos<br/>restantes</span>
      </div>
      <Link 
        to="/pricing" 
        className="text-xs text-center block bg-white/5 py-2 rounded-lg text-brand-emerald hover:text-emerald-400 hover:bg-white/10 transition-all font-medium"
      >
        Acheter des crédits
      </Link>
    </div>
  );
}
