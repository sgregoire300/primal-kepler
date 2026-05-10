import { Check, Star } from 'lucide-react';
import clsx from 'clsx';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Pricing() {
  const { addCredits } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    {
      name: 'Pack Découverte',
      price: '29.00',
      credits: '5 crédits vidéo',
      creditsValue: 5,
      features: [
        'Valable sans limite de temps',
        'Voix IA standard',
        'Vidéos HD 720p',
        'Support par email'
      ],
      recommended: false
    },
    {
      name: 'Pack Croissance',
      price: '79.00',
      credits: '20 crédits vidéo',
      creditsValue: 20,
      features: [
        'Le meilleur rapport qualité/prix',
        'Voix clonée offerte',
        'Avatar personnalisé',
        'Vidéos Full HD 1080p',
        'Support prioritaire'
      ],
      recommended: true
    },
    {
      name: 'Pack Business',
      price: '199.00',
      credits: '60 crédits vidéo',
      creditsValue: 60,
      features: [
        'Idéal pour les agences',
        'Tout du pack Croissance',
        "Jusqu'à 5 accès agents",
        'API & Webhooks Make',
        'Gestionnaire de compte'
      ],
      recommended: false
    }
  ];

  const handlePaymentSuccess = async (plan) => {
    setLoading(true);
    try {
      await addCredits(plan.creditsValue);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Erreur après paiement:", error);
      alert("Le paiement a réussi mais une erreur est survenue lors de l'ajout des crédits. Veuillez contacter le support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Achetez des crédits selon vos besoins</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Pas d'abonnement, pas de frais cachés. Vos crédits n'expirent jamais et vous permettent de générer vos vidéos quand vous en avez besoin.
          </p>
          {success && (
            <div className="mt-4 p-4 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 animate-bounce">
              Paiement réussi ! Vos crédits ont été ajoutés à votre compte.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={clsx(
                "relative bg-white rounded-3xl p-8 transition-all duration-300 flex flex-col",
                plan.recommended 
                  ? "border-2 border-brand-gold shadow-xl scale-105 z-10" 
                  : "border border-slate-200 shadow-sm hover:shadow-md"
              )}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-brand-gold text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full flex items-center gap-1 shadow-md">
                    <Star size={14} className="fill-white" /> Meilleure offre
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-brand-navy">${plan.price}</span>
                <span className="text-slate-500"> paiement unique</span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 mb-8 text-center border border-slate-100">
                <span className="font-medium text-brand-emerald">{plan.credits}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto min-h-[150px]">
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          description: `Plan ${plan.name} - ${plan.credits}`,
                          amount: {
                            value: plan.price,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    await handlePaymentSuccess(plan);
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
