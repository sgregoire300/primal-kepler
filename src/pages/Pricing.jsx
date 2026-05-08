import { Check, Star } from 'lucide-react';
import clsx from 'clsx';

export default function Pricing() {
  const plans = [
    {
      name: 'Solo',
      price: '49',
      credits: '10 vidéos / mois',
      features: [
        'Voix IA standard',
        '1 Avatar générique',
        'Vidéos 720p',
        'Support par email'
      ],
      recommended: false
    },
    {
      name: 'Pro',
      price: '99',
      credits: '30 vidéos / mois',
      features: [
        'Voix clonée',
        'Avatar personnalisé',
        'Vidéos 1080p',
        'Crédits reportables',
        'Support prioritaire'
      ],
      recommended: true
    },
    {
      name: 'Équipe',
      price: '249',
      credits: '100 vidéos / mois',
      features: [
        'Tout du forfait Pro',
        "Jusqu'à 5 agents",
        'API & Webhooks Make',
        'Gestionnaire dédié'
      ],
      recommended: false
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Des forfaits simples et flexibles</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Choisissez le plan qui correspond à votre volume d'annonces. Tous nos forfaits Pro incluent le report des crédits non utilisés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={clsx(
              "relative bg-white rounded-3xl p-8 transition-all duration-300",
              plan.recommended 
                ? "border-2 border-brand-gold shadow-xl scale-105 z-10" 
                : "border border-slate-200 shadow-sm hover:shadow-md"
            )}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-brand-gold text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
                  <Star size={14} className="fill-white" /> Le plus populaire
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-brand-navy">${plan.price}</span>
              <span className="text-slate-500"> / mois</span>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-3 mb-8 text-center border border-slate-100">
              <span className="font-medium text-brand-emerald">{plan.credits}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-brand-gold shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={clsx(
                "w-full py-3 px-4 rounded-xl font-medium transition-all",
                plan.recommended 
                  ? "bg-brand-navy text-white hover:bg-slate-800 shadow-md" 
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              )}
            >
              Choisir ce forfait
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
