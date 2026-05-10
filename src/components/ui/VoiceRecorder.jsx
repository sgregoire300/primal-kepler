import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from 'lucide-react';

export default function VoiceRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    console.log("Démarrage de startRecording...");
    setError(null);
    setIsInitializing(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Votre navigateur ne supporte pas l'enregistrement audio ou vous n'êtes pas dans un environnement sécurisé (HTTPS).");
      }

      console.log("Demande d'accès au micro...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Accès au micro accordé.");
      streamRef.current = stream;
      
      // Essayer différents types MIME pour la compatibilité
      let mimeType = '';
      const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("Enregistrement arrêté, création du blob...");
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      console.log("MediaRecorder démarré.");
      setIsRecording(true);
      setIsInitializing(false);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Erreur détaillée lors du démarrage de l'enregistrement:", err);
      setError(err.message);
      setIsInitializing(false);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-4 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4">
        {!audioURL && (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-brand-navy/10'}`}>
              <Mic size={32} className={isRecording ? 'text-red-500' : 'text-brand-navy'} />
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-mono font-bold text-slate-700">
                {formatTime(recordingTime)}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {isInitializing ? "Initialisation du micro..." : isRecording ? "Enregistrement en cours..." : "Cliquez pour commencer"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs max-w-xs text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isInitializing}
              className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-md ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : isInitializing
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-brand-navy text-white hover:bg-slate-800'
              }`}
            >
              {isRecording ? <Square size={18} fill="white" /> : isInitializing ? <Mic size={18} className="animate-pulse" /> : <Mic size={18} />}
              {isRecording ? "Terminer et Sauvegarder" : isInitializing ? "Connexion..." : "Commencer l'enregistrement"}
            </button>
          </>
        )}

        {audioURL && (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <button onClick={handlePlayPause} className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 focus:outline-none">
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <div>
                  <p className="text-sm font-medium text-slate-900">Enregistrement terminé</p>
                  <p className="text-xs text-slate-500">{formatTime(recordingTime)}</p>
                </div>
              </div>
              <audio ref={audioRef} src={audioURL} className="hidden" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetRecording}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Recommencer
              </button>
              <button
                onClick={resetRecording}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
