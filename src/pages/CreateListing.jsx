import { useState } from 'react';
import Step1Info from '../components/forms/Step1Info';
import Step2Script from '../components/forms/Step2Script';
import Step3Review from '../components/forms/Step3Review';
import { ChevronRight } from 'lucide-react';

export default function CreateListing() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    listingUrl: '',
    address: '',
    price: '',
    rooms: '',
    highlights: '',
    script: '',
    avatarUrl: '',
    voiceMode: 'heygen', // 'heygen', 'upload', 'record'
    voiceId: '', // If heygen
    audioFile: null, // If upload
    photos: [], // List of uploaded property photos
  });

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const steps = [
    { id: 1, name: 'Propriété' },
    { id: 2, name: 'Avatar & Script' },
    { id: 3, name: 'Validation' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nouvelle Annonce Vidéo</h1>
        <p className="text-slate-500 mt-1">Créez une vidéo engageante pour votre propriété en quelques étapes.</p>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center mb-10 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
              currentStep >= step.id 
                ? 'bg-brand-navy text-brand-gold shadow-md scale-105' 
                : 'bg-slate-200 text-slate-400'
            }`}>
              {step.id}
            </div>
            <span className={`ml-3 font-medium whitespace-nowrap ${currentStep >= step.id ? 'text-brand-navy' : 'text-slate-400'}`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 mx-4 text-slate-300" />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
        {currentStep === 1 && (
          <Step1Info 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={() => setCurrentStep(2)} 
          />
        )}
        {currentStep === 2 && (
          <Step2Script 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={() => setCurrentStep(3)} 
            onBack={() => setCurrentStep(1)} 
          />
        )}
        {currentStep === 3 && (
          <Step3Review 
            formData={formData} 
            onBack={() => setCurrentStep(2)} 
          />
        )}
      </div>
    </div>
  );
}
