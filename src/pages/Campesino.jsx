import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import img1 from '../assets/img/campesinos/1.png';
import img2 from '../assets/img/campesinos/2.png';
import img3 from '../assets/img/campesinos/3.png';
import img4 from '../assets/img/campesinos/4.png';
import img5 from '../assets/img/campesinos/5.png';
import img6 from '../assets/img/campesinos/6.png';
import img7 from '../assets/img/campesinos/7.png';
import img8 from '../assets/img/campesinos/8.png';
import Preload from '../components/Preload';
import InstruccionesSimonSays  from '../hooks/InstruccionesCampesinos';

const initialImages = [img1, img1, img2, img2, img3, img3, img4, img4, img5, img5, img6, img6, img7, img7, img8, img8];

export default function SimonSaysGame() {
  const [images, setImages] = useState(initialImages);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState('idle');
  const [currentImage, setCurrentImage] = useState(null);
  const [speed, setSpeed] = useState(1000);
  const [gameStarted, setGameStarted] = useState(false);
  const [hasSeenInstructions, setHasSeenInstructions] = useState(false);

  const shuffleImages = useCallback(() => {
    setImages(prevImages => [...prevImages].sort(() => Math.random() - 0.5));
  }, []);

  const generateRandomSequence = useCallback((length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * images.length));
  }, [images.length]);

  const startGame = () => {
    if (!hasSeenInstructions) return;
    
    shuffleImages();
    setGameStatus('showing');
    setScore(0);
    setLevel(1);
    setSpeed(1000);
    setSequence(generateRandomSequence(1));
    setUserSequence([]);
  };

  const showSequence = useCallback(() => {
    setGameStatus('showing');
    
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < sequence.length) {
        setCurrentImage(sequence[i]);
        i++;
      } else {
        clearInterval(intervalId);
        setCurrentImage(null);
        setGameStatus('playing');
        setTimeLeft(Math.max(30 - level, 10));
      }
    }, speed);
    return () => clearInterval(intervalId);
  }, [sequence, level, speed]);

  useEffect(() => {
    // Only start the game automatically if instructions have been seen
    if (hasSeenInstructions) {
      startGame();
    }
  }, [hasSeenInstructions]);

  useEffect(() => {
    if (gameStatus === 'showing') {
      showSequence();
    }
  }, [gameStatus, showSequence]);

  const handleImageClick = (index) => {
    if (gameStatus !== 'playing') return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameStatus('gameOver');
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(prevScore => prevScore + level);
      setLevel(prevLevel => prevLevel + 1);
      setSequence(generateRandomSequence(level + 1));
      setUserSequence([]);
      shuffleImages();
      setSpeed(prevSpeed => Math.max(prevSpeed * 0.9, 300));
      setGameStatus('showing');
    }
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameStatus('gameOver');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleInstructionsComplete = () => {
    setHasSeenInstructions(true);
    setGameStarted(true);
  };

  return (
    <Preload>
      {!gameStarted ? (
        <InstruccionesSimonSays setGameStarted={handleInstructionsComplete} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Simón dice</h1>
  
            <AnimatePresence mode="wait">
              {(gameStatus === 'showing' || gameStatus === 'playing') && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xl mb-4 text-center text-white">
                    {gameStatus === 'showing' ? 'Observa la secuencia' : 'Repite la secuencia'}
                  </p>
                  <div className="flex justify-between mb-4 text-white">
                    <p className="text-lg">Nivel: {level}</p>
                    {gameStatus === 'playing' && (
                      <div className="flex items-center">
                        <p className="text-lg mr-2">Tiempo: {timeLeft}s</p>
                        <div className="w-40 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
  
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {images.map((src, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleImageClick(index)}
                        disabled={gameStatus === 'showing'}
                        className={`
                          rounded-xl p-2 bg-white/20 hover:bg-white/30
                          focus:outline-none focus:ring-2 focus:ring-white
                          transition-all duration-200
                          ${gameStatus === 'showing' && currentImage === index ? 'ring-2 ring-yellow-400' : ''}
                          ${gameStatus === 'showing' ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          opacity: gameStatus === 'showing' && currentImage !== index ? 0.5 : 1
                        }}
                      >
                        <img src={src} alt="" className="w-full h-auto object-contain" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
  
              {gameStatus === 'gameOver' && (
                <motion.div
                  key="gameOver"
                  className="text-center text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-3xl font-bold mb-4">¡Fin del Juego!</p>
                  <p className="text-xl mb-2">Puntaje Final: {score}</p>
                  <p className="text-xl mb-6">Nivel Más Alto: {level - 1}</p>
                  <button 
                    onClick={startGame} 
                    className="w-full bg-white text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Jugar de Nuevo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
  
            <motion.p 
              className="text-xl mt-6 text-center font-semibold text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              Puntaje: {score}
            </motion.p>
          </div>
        </div>
      )}
    </Preload>
  );
  
}