import React from 'react'
import { motion } from 'framer-motion'

const MagicInstructions = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl"
      >
        <h2 className="text-[#7835ff] text-2xl md:text-3xl font-bold mb-4">
          🌟 ¡Bienvenido a Pascasio! 🌟
        </h2>
        
        <div className="space-y-4 text-left text-[#8A4FFF] font-medium">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🦸‍♀️</span>
            <p>Elige tu Avatar Mágico</p>
          </div>
          <ul className="list-disc list-inside text-sm ml-6 text-gray-600">
            <li>Mira el personaje en la pantalla</li>
            <li>Haz clic en el botón de refresh para cambiar</li>
            <li>¡Elige el avatar que más te guste!</li>
          </ul>

          <div className="flex items-center space-x-3">
            <span className="text-3xl">📝</span>
            <p>Escribe tu Nombre Mágico</p>
          </div>
          <ul className="list-disc list-inside text-sm ml-6 text-gray-600">
            <li>Escribe tu nombre en el cuadro blanco</li>
            <li>Este será tu nombre de aventurero</li>
          </ul>

          <div className="flex items-center space-x-3">
            <span className="text-3xl">🚀</span>
            <p>¡Inicia tu Aventura!</p>
          </div>
          <ul className="list-disc list-inside text-sm ml-6 text-gray-600">
            <li>Haz clic en "¡INICIÁ TÚ AVENTURA!"</li>
            <li>Si no escribes un nombre, verás un mensaje mágico</li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-[#FF5C8A] to-[#FFB23F] text-white rounded-full py-3 font-bold"
        >
          ¡Entendido! 🌈
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default MagicInstructions