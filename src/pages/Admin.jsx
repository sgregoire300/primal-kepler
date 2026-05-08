import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc, updateDoc, increment, query, orderBy } from 'firebase/firestore';
import { Users, CreditCard, ShieldCheck, Video, Search, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Protection : redirection si pas admin
  useEffect(() => {
    if (userData && userData.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [userData, navigate]);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCredits = async (userId, amount) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        credits: increment(amount)
      });
    } catch (error) {
      console.error("Erreur ajout crédits:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-brand-gold" />
            Panneau d'Administration
          </h1>
          <p className="text-slate-500 mt-1">Gérez vos utilisateurs et distribuez des crédits.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur..."
            className="input-field pl-10 w-full md:w-64 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Utilisateurs</p>
              <h3 className="text-2xl font-bold text-slate-900">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Activités Récentes</p>
              <h3 className="text-2xl font-bold text-slate-900">En direct</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Video size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Vidéos Produites</p>
              <h3 className="text-2xl font-bold text-slate-900">Suivi actif</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Utilisateur</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Rôle</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Crédits</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{user.email}</span>
                      <span className="text-xs text-slate-400">ID: {user.id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-brand-navy">
                    {user.credits || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAddCredits(user.id, 10)}
                        className="p-2 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-brand-navy rounded-lg transition-all text-xs font-bold"
                        title="Ajouter 10 crédits"
                      >
                        +10
                      </button>
                      <button 
                        onClick={() => handleAddCredits(user.id, 50)}
                        className="p-2 bg-brand-emerald/10 text-brand-emerald hover:bg-brand-emerald hover:text-white rounded-lg transition-all text-xs font-bold"
                        title="Ajouter 50 crédits"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
