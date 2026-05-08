import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, CreditCard, Package, LogIn, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Afficher le message d'erreur spécifique de Firebase
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Afficher le message d'erreur spécifique de Firebase
      setError(`Erreur Google: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans animate-in fade-in duration-500">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-brand-navy">
            <div className="w-10 h-10 rounded bg-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/20">
              <span className="text-white text-lg">IA</span>
            </div>
            Immo-Avatar
          </Link>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-brand-navy transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Auth Form */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-brand-navy/5 border border-slate-100 max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold text-brand-navy mb-2">
            {isLogin ? "Bon retour !" : "Créer un compte"}
          </h1>
          <p className="text-slate-500 mb-6">
            {isLogin ? "Connectez-vous pour accéder à vos vidéos." : "Rejoignez-nous et créez votre première vidéo."}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 mb-6 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl hover:bg-slate-50 transition-all mb-6 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-xs font-medium text-slate-400 uppercase">ou avec courriel</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Courriel</label>
              <input 
                type="email" 
                required 
                className="input-field" 
                placeholder="agent@immobilier.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Mot de passe</label>
                {isLogin && <a href="#" className="text-xs text-brand-gold font-medium hover:underline">Oublié ?</a>}
              </div>
              <input 
                type="password" 
                required 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-50">
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500">
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-2 text-brand-navy font-semibold hover:text-brand-gold transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>

        {/* Right Side: Pricing / Features info */}
        <div className="space-y-8 lg:pt-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Fonctionnement & Tarifs</h2>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              Une fois connecté, vous conservez votre compte, vos vidéos et vos préférences de jumeau numérique. Vous ne payez que ce que vous utilisez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay as you go */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-gold/50 transition-colors shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
              <CreditCard className="text-slate-400 mb-4" size={28} />
              <h3 className="font-semibold text-lg text-brand-navy mb-1">Paiement à l'acte</h3>
              <div className="text-2xl font-bold text-slate-800 mb-3">15$ <span className="text-sm font-normal text-slate-500">/ vidéo</span></div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Payez pour chaque vidéo au moment de la génération (Pay-as-you-go). Idéal pour essayer ou pour des besoins ponctuels.
              </p>
            </div>

            {/* Advance Purchase */}
            <div className="bg-brand-navy p-6 rounded-2xl border border-brand-navy shadow-lg relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Package size={64} />
              </div>
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
              <Package className="text-brand-gold mb-4" size={28} />
              <h3 className="font-semibold text-lg mb-1">Achat d'avance (Solde)</h3>
              <div className="text-2xl font-bold text-white mb-1">99$ <span className="text-sm font-normal text-white/70">pour 10 vidéos</span></div>
              <div className="text-xs text-brand-gold font-medium mb-3">Soit 9.90$ / vidéo (Économisez 33%)</div>
              <p className="text-sm text-white/80 leading-relaxed">
                Achetez un pack de crédits qui reste sur votre compte sans date d'expiration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-brand-light p-4 rounded-xl border border-brand-navy/10 text-sm font-medium text-brand-navy">
            <ShieldCheck size={20} className="text-brand-emerald" />
            Aucun engagement, aucune carte requise pour créer un compte.
          </div>
        </div>

      </div>
    </div>
  );
}
