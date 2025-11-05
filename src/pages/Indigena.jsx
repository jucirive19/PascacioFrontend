import React, { useState, useEffect } from 'react';
import imagen from '../assets/img/indigenas.jpeg'; // Asegúrate de que la ruta de la imagen sea correcta
import Preload from '../components/Preload';
import { motion } from 'framer-motion';
const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const createInitialGrid = () => {
  const tiles = Array.from({ length: TILE_COUNT - 1 }, (_, i) => i + 1);
  return [...tiles, 0]; // 0 representa la ficha vacía
};

const shuffleGrid = (grid) => {
  const shuffled = [...grid];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ImageSlidingPuzzle() {
  const [grid, setGrid] = useState(shuffleGrid(createInitialGrid()));
  // const [grid, setGrid] = useState(createInitialGrid());
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const imageUrl = imagen; // Usa la imagen importada localmente

  const checkCompletion = (currentGrid) => {
    return currentGrid.every((tile, index) => 
      tile === 0 ? index === TILE_COUNT - 1 : tile === index + 1
    );
  };

  const moveEmpty = (index) => {
    const emptyIndex = grid.indexOf(0);
    const diff = Math.abs(index - emptyIndex);

    if (
      (diff === 1 && Math.floor(index / GRID_SIZE) === Math.floor(emptyIndex / GRID_SIZE)) ||
      diff === GRID_SIZE
    ) {
      const newGrid = [...grid];
      [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
      setGrid(newGrid);
      setMoves(moves + 1);
      setIsComplete(checkCompletion(newGrid));
    }
  };

  const handleKeyDown = (e) => {
    const emptyIndex = grid.indexOf(0);
    switch (e.key) {
      case 'ArrowUp':
        if (emptyIndex < TILE_COUNT - GRID_SIZE) moveEmpty(emptyIndex + GRID_SIZE);
        break;
      case 'ArrowDown':
        if (emptyIndex >= GRID_SIZE) moveEmpty(emptyIndex - GRID_SIZE);
        break;
      case 'ArrowLeft':
        if (emptyIndex % GRID_SIZE !== GRID_SIZE - 1) moveEmpty(emptyIndex + 1);
        break;
      case 'ArrowRight':
        if (emptyIndex % GRID_SIZE !== 0) moveEmpty(emptyIndex - 1);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid]);

  const handleShuffle = () => {
    setGrid(shuffleGrid(createInitialGrid()));
    setMoves(0);
    setIsComplete(false);
  };

  return (
    
    <Preload>
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-100 flex justify-center items-center p-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-60">
          {/* Header */}
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-center mb-8 text-purple-700"
          >
            Rompecabezas Mágico
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Puzzle Grid */}
            <div className="md:w-1/2">
              <div 
                className="grid grid-cols-3 gap-2 mb-6 bg-purple-50 p-3 rounded-2xl shadow-inner" 
                role="grid" 
                aria-label="Sliding Puzzle Grid"
              >
                {grid.map((tile, index) => (
                  <motion.button
                    key={index}
                    onClick={() => moveEmpty(index)}
                    whileHover={{ scale: tile !== 0 ? 1.02 : 1 }}
                    whileTap={{ scale: tile !== 0 ? 0.98 : 1 }}
                    className={`w-full pt-[100%] relative overflow-hidden rounded-xl ${
                      tile === 0 
                        ? 'bg-purple-100 border-2 border-dashed border-purple-300' 
                        : 'shadow-lg'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                    disabled={tile === 0}
                    aria-label={tile === 0 ? 'Espacio vacío' : `Ficha ${tile}`}
                  >
                    {tile !== 0 && (
                      <div
                        className="absolute inset-0 bg-cover bg-no-repeat rounded-xl"
                        style={{
                          backgroundImage: `url(${imageUrl})`,
                          backgroundPosition: `${((tile - 1) % GRID_SIZE) / (GRID_SIZE - 1) * 100}% ${Math.floor((tile - 1) / GRID_SIZE) / (GRID_SIZE - 1) * 100}%`,
                          backgroundSize: `${GRID_SIZE * 100}%`,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <motion.div 
                  className="px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  Movimientos: {moves}
                </motion.div>
                <motion.button
                  onClick={handleShuffle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  ✨ Mezclar de nuevo
                </motion.button>
              </div>

              {/* Success Message */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl"
                >
                  <p className="text-xl font-bold text-purple-700">
                    🎉 ¡Felicidades! Has completado el rompecabezas mágico ✨
                  </p>
                </motion.div>
              )}
            </div>

            {/* Reference Image */}
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-2xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4 text-purple-700">
                  ✨ Imagen de Referencia
                </h3>
                <img 
                  src={imageUrl} 
                  alt="Imagen de referencia del rompecabezas" 
                  className="w-full rounded-xl shadow-md"
                />
              </motion.div>
            </div>
          </div>

          {/* Instructions */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-purple-600 mt-6 text-center"
          >
            🎮 Usa las teclas de flecha o haz clic en las fichas para moverlas
          </motion.p>
        </div>
      </motion.div>
    </div>
    </Preload>
    
  );
}
