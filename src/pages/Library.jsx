import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Video, Trash2, Play, Calendar, MapPin, Film, User, Mic, Music } from 'lucide-react';
import clsx from 'clsx';

export default function Library() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Écouteurs pour les 3 collections
    const qVideos = query(collection(db, 'videos'), where('userid', '==', currentUser.uid));
    const qAvatars = query(collection(db, 'user_avatars'), where('userId', '==', currentUser.uid));
    const qVoices = query(collection(db, 'user_voices'), where('userId', '==', currentUser.uid));

    const unsubVideos = onSnapshot(qVideos, (snap) => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (activeTab === 'videos') setLoading(false);
    });

    const unsubAvatars = onSnapshot(qAvatars, (snap) => {
      setAvatars(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (activeTab === 'avatars') setLoading(false);
    });

    const unsubVoices = onSnapshot(qVoices, (snap) => {
      setVoices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (activeTab === 'voices') setLoading(false);
    });

    // Initial loading state helper
    setLoading(false);

    return () => {
      unsubVideos();
      unsubAvatars();
      unsubVoices();
    };
  }, [currentUser]);

  const handleDelete = async (id, collectionName) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet élément ?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error("Erreur de suppression:", error);
      }
    }
  };

  const tabs = [
    { id: 'videos', name: 'Mes Vidéos', icon: Video },
    { id: 'avatars', name: 'Mes Photos', icon: User },
    { id: 'voices', name: 'Mes Voix', icon: Mic },
  ];

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Film className="text-brand-gold" />
            Ma Bibliothèque
          </h1>
          <p className="text-slate-500 mt-1">Gérez vos vidéos, avatars et enregistrements vocaux.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-500 hover:text-brand-navy"
                )}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
        </div>
      ) : (
        <>
          {/* TAB: VIDEOS */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.length === 0 ? (
                <EmptyState icon={Video} text="Aucune vidéo pour le moment" />
              ) : (
                videos.map((video) => (
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
                          onClick={() => handleDelete(video.id, 'videos')}
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
                ))
              )}
            </div>
          )}

          {/* TAB: AVATARS */}
          {activeTab === 'avatars' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {avatars.length === 0 ? (
                <EmptyState icon={User} text="Aucune photo d'avatar" className="col-span-full" />
              ) : (
                avatars.map((avatar) => (
                  <div key={avatar.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50">
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleDelete(avatar.id, 'user_avatars')}
                        className="p-2 bg-red-500 text-white rounded-full shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: VOICES */}
          {activeTab === 'voices' && (
            <div className="space-y-3">
              {voices.length === 0 ? (
                <EmptyState icon={Mic} text="Aucun enregistrement vocal" />
              ) : (
                voices.map((voice) => (
                  <div key={voice.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm hover:border-brand-gold/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
                        <Music size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">{voice.name}</h4>
                        <p className="text-xs text-slate-500">
                          {voice.createdAt?.toDate ? voice.createdAt.toDate().toLocaleString() : new Date(voice.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <audio src={voice.url} controls className="h-8 w-48 md:w-64" />
                      <button 
                        onClick={() => handleDelete(voice.id, 'user_voices')}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text, className }) {
  return (
    <div className={clsx("bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center w-full", className)}>
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-slate-300" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{text}</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">
        Les éléments que vous créez apparaîtront ici automatiquement.
      </p>
    </div>
  );
}
