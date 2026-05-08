import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Video, Trash2, Play, Calendar, MapPin, Film } from 'lucide-react';
import clsx from 'clsx';

export default function Library() {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    // Récupérer uniquement les vidéos de l'utilisateur actuel
    const q = query(
      collection(db, 'videos'),
      where('userid', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videoList);
      setLoading(false);
    }, (error) => {
      console.error("Erreur bibliothèque:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (videoId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette vidéo ?")) {
      try {
        await deleteDoc(doc(db, 'videos', videoId));
      } catch (error) {
        console.error("Erreur de suppression:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Film className="text-brand-gold" />
          Ma Bibliothèque
        </h1>
        <p className="text-slate-500 mt-1">Retrouvez toutes vos vidéos générées par IA.</p>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Aucune vidéo pour le moment</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Commencez par créer votre première annonce vidéo pour la voir apparaître ici.
          </p>
          <button className="mt-6 btn-primary">Créer une annonce</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.address} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <Video className="text-white/20" size={48} />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <a 
                    href={`https://app.heygen.com/share/${video.videourl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-brand-gold text-brand-navy rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform"
                  >
                    <Play size={24} fill="currentColor" />
                  </a>
                </div>
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 truncate">{video.address || "Sans adresse"}</h3>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span>Québec, Canada</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar size={12} />
                    <span>{video.createdAt?.toDate ? video.createdAt.toDate().toLocaleDateString() : new Date(video.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
