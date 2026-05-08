import { Download, Share2, Link2, Clock, CheckCircle } from 'lucide-react';

export default function VideoGallery() {
  const videos = [
    {
      id: 1,
      title: 'Aperçu: 123 Rue de la Paix, Montréal',
      status: 'ready',
      date: "Aujourd'hui",
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      title: 'Aperçu: 45 Ave des Érables, Québec',
      status: 'generating',
      date: 'En cours',
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <div key={video.id} className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:border-brand-gold/50 hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-video bg-slate-200 overflow-hidden">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
            
            <div className="absolute top-3 right-3">
              {video.status === 'ready' ? (
                <span className="bg-brand-emerald/90 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm">
                  <CheckCircle size={14} /> Prêt ✅
                </span>
              ) : (
                <span className="bg-brand-navy text-brand-gold text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm border border-brand-gold/30">
                  <Clock size={14} className="animate-pulse" /> En cours ⏳
                </span>
              )}
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-medium text-sm truncate drop-shadow-md">{video.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{video.date}</p>
            </div>
          </div>
          
          <div className="p-3 bg-white flex justify-between items-center">
            <button 
              className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent" 
              disabled={video.status !== 'ready'} 
              title="Télécharger"
            >
              <Download size={18} />
            </button>
            <button 
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent" 
              disabled={video.status !== 'ready'} 
              title="Partager sur Facebook"
            >
              <Share2 size={18} />
            </button>
            <button 
              className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent" 
              disabled={video.status !== 'ready'} 
              title="Copier le lien"
            >
              <Link2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
