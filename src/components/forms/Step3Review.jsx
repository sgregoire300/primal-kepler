import { useState } from 'react';
import { CheckCircle2, AlertCircle, PlayCircle, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function Step3Review({ formData, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

    try {
      if (!MAKE_WEBHOOK_URL) {
        throw new Error("L'URL du Webhook n'est pas configurée.");
      }

      // Préparation des données à envoyer
      const payload = {
        ...formData,
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        timestamp: new Date().toISOString()
      };

      // 1. Envoi au Webhook Make.com
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error("Erreur de communication avec Make.com");

      // 2. Déduction du crédit dans Firebase
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          credits: increment(-1)
        });
      }
      
      setSubmitStatus('success');
      
      // Retour au dashboard après succès
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
      
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-brand-emerald/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-brand-emerald" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Annonce Envoyée !</h2>
        <p className="text-slate-500 max-w-md">
          Votre vidéo est en cours de génération par votre jumeau numérique. 
          Elle apparaîtra dans votre tableau de bord dans quelques minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-brand-gold rounded-full"></span>
          Résumé de votre commande
        </h2>
        <p className="text-sm text-slate-500">
          Vérifiez les informations avant de lancer la génération de la vidéo (coûte 1 crédit).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-brand-navy mb-4 border-b border-slate-200 pb-2">Informations</h3>
          <ul className="space-y-3 text-sm">
            {formData.listingUrl && (
              <li className="flex justify-between">
                <span className="text-slate-500">Lien:</span>
                <span className="font-medium text-slate-900 truncate max-w-[200px]">{formData.listingUrl}</span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="text-slate-500">Adresse:</span>
              <span className="font-medium text-slate-900">{formData.address || "Généré via URL"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Prix:</span>
              <span className="font-medium text-slate-900">{formData.price || "-"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Avatar:</span>
              <span className="font-medium text-slate-900">{formData.avatarUrl}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-500">Mode vocal:</span>
              <span className="font-medium text-slate-900 capitalize">{formData.voiceMode}</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-brand-navy mb-4 border-b border-slate-200 pb-2">Script IA</h3>
          <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-6">
            "{formData.script}"
          </p>
        </div>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">Une erreur est survenue lors de l'envoi. Veuillez réessayer.</span>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-slate-100">
        <button type="button" onClick={onBack} className="btn-secondary" disabled={isSubmitting}>
          Retour
        </button>
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="btn-primary flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Génération...</span>
          ) : (
            <>
              <Video size={18} />
              Générer la Vidéo (-1 crédit)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
