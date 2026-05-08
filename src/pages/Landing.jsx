import { Link } from 'react-router-dom';
import { Video, Wand2, UserCheck, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tight text-brand-navy">
            <div className="w-10 h-10 rounded bg-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/20">
              <span className="text-white text-lg">IA</span>
            </div>
            Immo-Avatar
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-brand-navy font-medium hover:text-brand-gold transition-colors">
              Se connecter
            </Link>
            <Link to="/login" className="btn-primary">
              Démarrer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-medium text-sm">
          ✨ Le futur du marketing immobilier
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-brand-navy leading-tight tracking-tight mb-8">
          Votre Jumeau Numérique <br/>
          <span className="text-brand-gold">Au Service de Vos Ventes</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Générez des vidéos de présentation professionnelles en quelques secondes. Sans caméra, sans montage, juste avec l'URL de votre annonce.
        </p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-brand-navy text-white text-lg font-medium px-8 py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 group">
          Créer ma première vidéo
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Comment ça marche ?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Trois étapes simples pour transformer vos inscriptions en vidéos virales.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Ligne connectrice décorative pour desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            
            <div className="text-center relative z-10 bg-white">
              <div className="w-24 h-24 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-navy/5">
                <Video size={40} className="text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-brand-navy">1. Entrez le lien</h3>
              <p className="text-slate-500 leading-relaxed">Collez simplement l'URL de votre annonce immobilière. L'IA extrait les détails et analyse les photos.</p>
            </div>
            
            <div className="text-center relative z-10 bg-white">
              <div className="w-24 h-24 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-navy/5">
                <Wand2 size={40} className="text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-brand-navy">2. Script IA généré</h3>
              <p className="text-slate-500 leading-relaxed">Le script est rédigé instantanément en incluant les atouts de la propriété et le contexte du quartier.</p>
            </div>
            
            <div className="text-center relative z-10 bg-white">
              <div className="w-24 h-24 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-navy/5">
                <UserCheck size={40} className="text-brand-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-brand-navy">3. Vidéo prête !</h3>
              <p className="text-slate-500 leading-relaxed">Votre propre avatar présente la propriété. Téléchargez la vidéo et diffusez-la sur vos réseaux sociaux.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
