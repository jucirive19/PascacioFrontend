import React from 'react';
import { HelpCircle, BookOpen, ShieldAlert, ThumbsUp } from 'lucide-react';

const InstruccionesMinero = ({ setGameStarted }) => {
  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-gradient-to-r from-purple-600/80 to-purple-400 p-4 sm:p-6 rounded-lg max-w-2xl w-full mx-auto text-white backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Prevención de Trabajo Infantil</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">1. Lee cada pregunta con atención</h3>
              <p className="text-xs sm:text-sm">Cada pregunta está diseñada para que aprendas sobre los derechos de los menores y la importancia de evitar el trabajo infantil en sectores como la minería.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">2. Selecciona la respuesta que consideres correcta</h3>
              <p className="text-xs sm:text-sm">Elige la opción que creas adecuada. Cada respuesta proporciona información adicional y educativa sobre el tema.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">3. Reflexiona sobre el impacto</h3>
              <p className="text-xs sm:text-sm">Conocerás los riesgos y razones por las que el trabajo infantil es perjudicial y debe prevenirse en ambientes laborales peligrosos.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">4. Completa el quiz y sigue aprendiendo</h3>
              <p className="text-xs sm:text-sm">Al finalizar, recibirás una puntuación junto con consejos útiles sobre cómo promover entornos seguros y éticos en el trabajo.</p>
            </div>
          </div>
        </div>
        <button
          onClick={startGame}
          className="w-full mt-4 sm:mt-6 bg-white text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base"
        >
          ¡Entendido, quiero aprender!
        </button>
      </div>
    </div>
  );
};

export default InstruccionesMinero;

