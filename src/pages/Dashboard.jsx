import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import VideoGallery from '../components/videos/VideoGallery';

export default function Dashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, Agent ! 👋</h1>
          <p className="text-slate-500 mt-1">Prêt à créer votre prochaine annonce vidéo ?</p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2 group">
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Nouvelle Annonce</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-3">
            <span className="w-2 h-6 bg-brand-gold rounded-full"></span>
            Vos vidéos générées
          </h2>
        </div>
        <VideoGallery />
      </div>
    </div>
  );
}
