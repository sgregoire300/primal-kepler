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

      // Préparation enrichie des données à envoyer (compatibilité maximale)
      const payload = {
        // Champs Propriété
        address: formData.address,
        price: formData.price,
        rooms: formData.rooms,
        highlights: formData.highlights,
        script: formData.script,
        photos: formData.photos || [],
        
        // Champs Avatar (Variantes pour Talking Photo et Video Avatar)
        avatarUrl: formData.avatarUrl,
        avatar_url: formData.avatarUrl,
        talking_photo_url: formData.avatarUrl,
        talking_photo_url_alternative: formData.avatarUrl,
        avatarId: formData.avatarId || "",
        avatar_id: formData.avatarId || "",
        
        // Champs Audio / Voix
        voiceMode: formData.voiceMode,
        voice_mode: formData.voiceMode,
        voiceId: formData.voiceId || "",
        voice_id: formData.voiceId || "",
        audioUrl: formData.audioUrl || "",
        audio_url: formData.audioUrl || "",
        input_audio_url: formData.audioUrl || "",

        // Aide pour Make.com (Automatisé)
        heygen_voice_type: formData.voiceMode === 'heygen' ? 'text' : 'audio',
        heygen_voice_id: formData.voiceMode === 'heygen' ? (formData.voiceId || 'Marie') : formData.audioUrl,
        
        // Metadata
        userEmail: currentUser?.email,
        userId: currentUser?.uid,
        timestamp: new Date().toISOString()
      };

      console.log("Payload complet envoyé au webhook:", JSON.stringify(payload, null, 2));

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
            <li className="flex justify-between gap-4">
              <span className="text-slate-500 shrink-0">Avatar:</span>
              <span className="font-medium text-slate-900 truncate text-right">{formData.avatarUrl || "Non sélectionné"}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-slate-500 shrink-0">Mode vocal:</span>
              <span className="font-medium text-slate-900 capitalize text-right">{formData.voiceMode}</span>
            </li>
            {formData.audioUrl && (
              <li className="flex justify-between gap-4">
                <span className="text-slate-500 shrink-0">Audio URL:</span>
                <span className="font-medium text-slate-900 truncate text-right text-[10px]">{formData.audioUrl}</span>
              </li>
            )}
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
