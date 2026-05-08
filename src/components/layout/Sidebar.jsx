import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, CreditCard, LogOut, Video, ShieldCheck } from 'lucide-react';
import CreditsWidget from './CreditsWidget';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  const isAdmin = userData?.role === 'admin';

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Bibliothèque', href: '/library', icon: Video },
    { name: 'Nouvelle Annonce', href: '/create', icon: PlusCircle },
    { name: 'Tarification', href: '/pricing', icon: CreditCard },
  ];

  if (isAdmin) {
    links.push({ name: 'Admin', href: '/admin', icon: ShieldCheck });
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erreur de déconnexion", error);
    }
  };

  return (
    <div className="w-64 bg-brand-navy text-white flex flex-col h-full border-r border-slate-800 shadow-xl z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded bg-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/20">
            <span className="text-brand-navy">IA</span>
          </div>
          Immo-Avatar
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive 
                  ? 'bg-white/10 text-brand-gold font-medium shadow-inner' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex flex-col gap-4">
        <CreditsWidget />
        
        <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
          <div className="text-xs text-slate-400 truncate px-1">
            {currentUser?.email}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors w-full"
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
