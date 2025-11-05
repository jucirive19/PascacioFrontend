import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeOff, Expand, House, Ear } from 'lucide-react';
import cancion from '../assets/sounds/cancion.mp3';

export const Leaderboard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(cancion));
  const navigate = useNavigate();

  useEffect(() => {
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
    });

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  const handleHomeClick = () => {
    const lastSpawnData = localStorage.getItem('lastSpawnData');
    if (lastSpawnData) {
      navigate('/', { state: { fromSpawn: true } });
    } else {
      navigate('/');
    }
  };

  const handleHelpClick = () => {
    navigate('/ayuda');
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="fixed top-0 right-0 p-4 flex z-10 gap-4">
        <button
          onClick={handleHomeClick}
          className="bg-white bg-opacity-60 backdrop-blur-sm text-black p-2 rounded-lg"
          aria-label="Ir a la página de inicio"
        >
          <House className="w-6 h-6" />
        </button>
        <button
          className="bg-white bg-opacity-60 backdrop-blur-sm text-black p-2 rounded-lg"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeOff className="w-6 h-6" />
          )}
        </button>
        <button
          className="bg-white bg-opacity-60 backdrop-blur-sm text-black p-2 rounded-lg"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
          aria-label="Toggle Fullscreen"
        >
          <Expand className="w-6 h-6" />
        </button>
      </div>

      {/* Botón de ayuda rojo y redondo */}
      <button
        onClick={handleHelpClick}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Ir a la página de ayuda"
      >
        <Ear className="w-6 h-6" />
      </button>
    </>
  );
};

