import React from 'react';
import { Brain, Clock, MousePointer2, Repeat } from 'lucide-react';

const GameInstructions = ({ onClose, setGameStarted }) => {
  const handleStart = () => {
    setGameStarted(true);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 p-6 rounded-lg max-w-2xl w-full mx-4 text-white backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Cómo jugar al Juego de Memoria</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <MousePointer2 className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">1. Voltea las cartas</h3>
              <p>Haz clic en cualquier carta para revelar la imagen oculta.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Brain className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">2. Encuentra parejas</h3>
              <p>Intenta encontrar dos cartas con la misma imagen. Si coinciden, permanecerán volteadas.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">3. Contra el reloj</h3>
              <p>Tienes 60 segundos para encontrar todas las parejas. ¡El tiempo comienza cuando volteas la primera carta!</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Repeat className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">4. Reinicia el juego</h3>
              <p>Si quieres empezar de nuevo, puedes reiniciar el juego en cualquier momento con el botón "Reiniciar".</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleStart}
          className="w-full mt-6 bg-white text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
        >
          ¡Entendido, vamos a jugar!
        </button>
      </div>
    </div>
  );
};

export default GameInstructions;