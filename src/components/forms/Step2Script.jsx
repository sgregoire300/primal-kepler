import { useState } from 'react';
import { Wand2, Mic, Upload, User, Image as ImageIcon, Map, Camera, Info } from 'lucide-react';
import clsx from 'clsx';

export default function Step2Script({ formData, updateFormData, onNext, onBack }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [usePhotos, setUsePhotos] = useState(true);
  const [useNeighborhood, setUseNeighborhood] = useState(true);
  const [showPhotoInstructions, setShowPhotoInstructions] = useState(false);

  const handleGenerateScript = () => {
    setIsGenerating(true);
    // Simulate API call for script generation
    setTimeout(() => {
      let generatedScript = formData.listingUrl 
        ? "Voici une magnifique propriété récemment mise sur le marché. Découvrez ses grands espaces lumineux..." 
        : `Découvrez cette propriété située au ${formData.address}. Avec ses ${formData.rooms}, elle offre un cadre de vie exceptionnel pour le prix de ${formData.price}. Ses points forts incluent: ${formData.highlights}.`;
      
      if (usePhotos) {
        generatedScript += " L'IA a analysé les photos pour mettre en valeur la luminosité du salon et la finition moderne de la cuisine.";
      }
      if (useNeighborhood) {
        generatedScript += " Située dans un quartier familial, vous serez à quelques pas des parcs, écoles réputées et commerces locaux.";
      }
      
      updateFormData({ script: generatedScript });
      setIsGenerating(false);
    }, 1500);
  };

  const avatars = [
    { id: 'avatar_1', name: 'Agent Marie', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
    { id: 'avatar_2', name: 'Agent Thomas', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      
      {/* Script Generation Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-brand-gold rounded-full"></span>
            Script de la vidéo
          </h2>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={usePhotos} 
                onChange={(e) => setUsePhotos(e.target.checked)}
                className="rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
              />
              <Camera size={16} className="text-slate-500" />
              Analyser les photos du listing
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={useNeighborhood} 
                onChange={(e) => setUseNeighborhood(e.target.checked)}
                className="rounded border-slate-300 text-brand-gold focus:ring-brand-gold"
              />
              <Map size={16} className="text-slate-500" />
              Inclure le contexte du quartier (Google Maps)
            </label>
          </div>
          
          <button 
            type="button"
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald/20 transition-colors rounded-lg font-medium text-sm disabled:opacity-50 w-full sm:w-auto justify-center"
          >
            <Wand2 size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "Génération..." : "Générer par IA"}
          </button>
        </div>
        
        <textarea
          rows={5}
          value={formData.script}
          onChange={(e) => updateFormData({ script: e.target.value })}
          placeholder="Entrez le texte que votre jumeau numérique prononcera..."
          className="input-field resize-none leading-relaxed"
        />
        <p className="text-xs text-slate-500 mt-2 text-right">
          {formData.script.length} caractères (env. {Math.ceil(formData.script.length / 15)} secondes)
        </p>
      </section>

      <div className="h-px bg-slate-100"></div>

      {/* Avatar Selection */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <User size={18} className="text-brand-gold" />
          Choix de l'Avatar
        </h2>
        <div className="flex gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => updateFormData({ avatarUrl: avatar.id })}
              className={clsx(
                "relative rounded-xl overflow-hidden border-2 transition-all group",
                formData.avatarUrl === avatar.id 
                  ? "border-brand-gold shadow-md" 
                  : "border-transparent hover:border-slate-300"
              )}
            >
              <img src={avatar.url} alt={avatar.name} className="w-24 h-24 object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-1">
                {avatar.name}
              </div>
            </button>
          ))}
          
          <button 
            onClick={() => {
              updateFormData({ avatarUrl: 'custom_agent' });
              setShowPhotoInstructions(true);
            }}
            className={clsx(
              "w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
              formData.avatarUrl === 'custom_agent'
                ? "border-brand-gold text-brand-navy bg-brand-gold/10 shadow-md"
                : "border-dashed border-slate-300 text-slate-500 hover:text-brand-navy hover:border-brand-navy hover:bg-slate-50"
            )}
          >
            <Upload size={20} className="mb-1" />
            <span className="text-[10px] font-medium text-center px-2">Mon Avatar</span>
          </button>
        </div>

        {showPhotoInstructions && formData.avatarUrl === 'custom_agent' && (
          <div className="mt-4 bg-brand-light p-4 rounded-xl border border-brand-navy/10 flex items-start gap-3 animate-in fade-in duration-300">
            <Info className="text-brand-navy shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-brand-navy mb-2">Instructions pour une photo parfaite :</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside mb-4">
                <li>Prenez la photo de face, en regardant directement l'objectif.</li>
                <li>Privilégiez un éclairage naturel (face à une fenêtre).</li>
                <li>Utilisez un fond neutre et uni (ex: mur blanc).</li>
                <li>Gardez une expression neutre avec un léger sourire, bouche fermée.</li>
              </ul>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors">
                <ImageIcon size={14} />
                Sélectionner ma photo
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Voice Mode Selection */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Mic size={18} className="text-brand-gold" />
          Source Audio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => updateFormData({ voiceMode: 'heygen' })}
            className={clsx(
              "p-4 rounded-xl border text-left transition-all",
              formData.voiceMode === 'heygen' 
                ? "border-brand-navy bg-brand-navy text-white shadow-md" 
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <Wand2 size={20} className={formData.voiceMode === 'heygen' ? "text-brand-gold" : "text-slate-400"} />
            <h3 className="font-medium mt-2">Voix IA (HeyGen)</h3>
            <p className={clsx("text-xs mt-1", formData.voiceMode === 'heygen' ? "text-white/80" : "text-slate-500")}>
              Utilisez la voix clonée de l'avatar.
            </p>
          </button>

          <button
            onClick={() => updateFormData({ voiceMode: 'record' })}
            className={clsx(
              "p-4 rounded-xl border text-left transition-all",
              formData.voiceMode === 'record' 
                ? "border-brand-navy bg-brand-navy text-white shadow-md" 
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <Mic size={20} className={formData.voiceMode === 'record' ? "text-brand-gold" : "text-slate-400"} />
            <h3 className="font-medium mt-2">Enregistrer</h3>
            <p className={clsx("text-xs mt-1", formData.voiceMode === 'record' ? "text-white/80" : "text-slate-500")}>
              Enregistrez votre propre voix maintenant.
            </p>
          </button>

          <button
            onClick={() => updateFormData({ voiceMode: 'upload' })}
            className={clsx(
              "p-4 rounded-xl border text-left transition-all",
              formData.voiceMode === 'upload' 
                ? "border-brand-navy bg-brand-navy text-white shadow-md" 
                : "border-slate-200 hover:border-slate-300 bg-white"
            )}
          >
            <Upload size={20} className={formData.voiceMode === 'upload' ? "text-brand-gold" : "text-slate-400"} />
            <h3 className="font-medium mt-2">Téléverser</h3>
            <p className={clsx("text-xs mt-1", formData.voiceMode === 'upload' ? "text-white/80" : "text-slate-500")}>
              Fichier MP3 ou WAV.
            </p>
          </button>
        </div>
      </section>

      <div className="flex justify-between pt-6 border-t border-slate-100">
        <button type="button" onClick={onBack} className="btn-secondary">
          Retour
        </button>
        <button 
          type="button" 
          onClick={onNext} 
          className="btn-primary"
          disabled={!formData.script || !formData.avatarUrl}
        >
          Valider & Continuer
        </button>
      </div>
    </div>
  );
}
