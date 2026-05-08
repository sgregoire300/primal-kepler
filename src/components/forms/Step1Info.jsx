import { useState } from 'react';
import { Link2, MapPin, DollarSign, Home as HomeIcon, Star, Upload, X, ImageIcon } from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import clsx from 'clsx';

export default function Step1Info({ formData, updateFormData, onNext }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newPhotos = [...(formData.photos || [])];

    try {
      for (const file of files) {
        const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newPhotos.push(url);
      }
      updateFormData({ photos: newPhotos });
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors du téléversement des photos.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateFormData({ photos: newPhotos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-brand-gold rounded-full"></span>
          Informations sur la propriété
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Fournissez le lien de l'annonce ou remplissez les informations manuellement.
        </p>
      </div>

      <div className="bg-brand-navy/5 p-5 rounded-xl border border-brand-navy/10">
        <label className="block text-sm font-semibold text-brand-navy mb-1">
          URL du listing (Optionnel)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="url"
            value={formData.listingUrl}
            onChange={(e) => updateFormData({ listingUrl: e.target.value })}
            className="input-field pl-10 bg-white"
            placeholder="https://centris.ca/..."
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
          <Star size={12} className="text-brand-gold" />
          L'IA pourra générer le script à partir de ce lien à l'étape suivante.
        </p>
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">OU SAISIE MANUELLE</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Photos de la propriété
          </label>
          <div className="flex flex-wrap gap-3">
            {(formData.photos || []).map((url, index) => (
              <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                <img src={url} alt="Propriété" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className={clsx(
              "w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
              uploading ? "bg-slate-100 border-slate-300" : "border-slate-300 hover:border-brand-gold hover:bg-slate-50"
            )}>
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-gold border-t-transparent"></div>
              ) : (
                <>
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 mt-1">Ajouter</span>
                </>
              )}
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Adresse
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required={!formData.listingUrl && (formData.photos?.length === 0)}
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              className="input-field pl-10"
              placeholder="123 Rue de la Paix, Montréal"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Prix
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required={!formData.listingUrl && (formData.photos?.length === 0)}
              value={formData.price}
              onChange={(e) => updateFormData({ price: e.target.value })}
              className="input-field pl-10"
              placeholder="450 000 $"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Caractéristiques (Pièces)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HomeIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={formData.rooms}
              onChange={(e) => updateFormData({ rooms: e.target.value })}
              className="input-field pl-10"
              placeholder="Ex: 4 chambres, 2 salles de bain"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Points forts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Star className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={formData.highlights}
              onChange={(e) => updateFormData({ highlights: e.target.value })}
              className="input-field pl-10"
              placeholder="Ex: Cour arrière aménagée, comptoir quartz"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100">
        <button type="submit" className="btn-primary">
          Continuer
        </button>
      </div>
    </form>
  );
}
