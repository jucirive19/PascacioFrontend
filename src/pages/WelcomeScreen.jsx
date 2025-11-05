import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, SkipForward } from 'lucide-react';
import Infobienvenida from '../assets/sounds/Infobienvenida.wav';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [canSkip, setCanSkip] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  useEffect(() => {
    // Crear instancia del audio
    const audioInstance = new Audio(Infobienvenida);
    audioInstance.preload = 'auto';
    
    audioInstance.addEventListener('loadeddata', () => {
      setAudioLoaded(true);
    });

    audioInstance.addEventListener('ended', () => {
      setIsPlaying(false);
      setTimeLeft(0);
      // Redirigir al Home después de que termine el audio
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    });

    setAudio(audioInstance);

    // Cleanup
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }
    };
  }, [navigate]);

  useEffect(() => {
    let interval;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    // Permitir saltar después de 10 segundos
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 10000);

    return () => clearTimeout(skipTimer);
  }, []);

  const handlePlayPause = () => {
    if (!audio || !audioLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSkip = () => {
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setTimeLeft(0);
    
    // Redirigir inmediatamente
    navigate('/', { replace: true });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((45 - timeLeft) / 45) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full text-center border border-white/20"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Bienvenido! 🎉
          </h1>
          <p className="text-xl text-white/80">
            Escucha esta información importante antes de comenzar tu aventura
          </p>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/20 rounded-2xl p-6 mb-6"
        >
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <motion.div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Time Display */}
          <div className="text-white text-lg font-semibold mb-4">
            {formatTime(timeLeft)}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMuteToggle}
              className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              disabled={!audioLoaded}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </motion.button>

            {canSkip && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSkip}
                className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <SkipForward size={20} />
                <span className="text-sm">Saltar</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/70 text-sm"
        >
          <p className="mb-2">
            {!audioLoaded && "Cargando audio..."}
            {audioLoaded && !isPlaying && "Presiona play para comenzar"}
            {isPlaying && "Reproduciendo información de bienvenida..."}
          </p>
          {canSkip && (
            <p className="text-xs text-white/50">
              Puedes saltar después de escuchar al menos 10 segundos
            </p>
          )}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-20 h-20 border-4 border-white/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-10 -left-10 w-16 h-16 border-4 border-white/20 rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
