import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Fingerprint, Play } from 'lucide-react';

export default function InstruccionesSimonSays({ setGameStarted }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">Instrucciones de "Simón Dice"</h1>
        
        <motion.div
          className="space-y-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <Eye className="w-10 h-10 text-yellow-300" />
            <p className="text-lg">Observa atentamente la secuencia de imágenes que aparecerán en pantalla.</p>
          </div>

          <div className="flex items-center space-x-4">
            <Fingerprint className="w-10 h-10 text-blue-300" />
            <p className="text-lg">Cuando sea tu turno, haz clic en las imágenes en el mismo orden en que aparecieron.</p>
          </div>

          <div className="flex items-center space-x-4">
            <Play className="w-10 h-10 text-green-300" />
            <p className="text-lg">A medida que avances de nivel, la secuencia será más larga y el tiempo se reducirá.</p>
          </div>
        </motion.div>

        <motion.button
          onClick={() => setGameStarted(true)}
          className="mt-8 w-full bg-white text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ¡Entendido, quiero jugar!
        </motion.button>
      </div>
    </div>
  );
}
