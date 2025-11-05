import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tutorial = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-white p-8 rounded-2xl max-w-md">
      <h2 className="text-2xl font-bold mb-4">¡Bienvenido a Tu Aventura Segura!</h2>
      <div className="space-y-4">
        <p>🌟 Explora diferentes lugares y aprende a mantenerte seguro</p>
        <p>🎮 Toma decisiones y gana medallas por tus buenas elecciones</p>
        <p>🤝 Recuerda: ¡Siempre hay alguien que puede ayudarte!</p>
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
      >
        ¡Comenzar Aventura!
      </button>
    </div>
  </motion.div>
);

const CharacterSelection = ({ characters, onSelect }) => (
  <div className="flex flex-wrap justify-center space-x-4">
    {characters.map((character) => (
      <button
        key={character.id}
        onClick={() => onSelect(character)}
        className="text-center bg-white p-4 rounded-lg shadow-lg hover:bg-blue-100"
      >
        <div className="text-4xl">{character.avatar}</div>
        <h3 className="text-lg font-bold">{character.name}</h3>
        <p className="text-sm text-gray-500">{character.powerPhrase}</p>
      </button>
    ))}
  </div>
);

const GameSetup = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [characterSelected, setCharacterSelected] = useState(null);

  const characters = [
    { id: 'girl1', avatar: '👧', name: 'Luna', powerPhrase: '¡Mi voz es mi poder!' },
    { id: 'boy1', avatar: '👦', name: 'Leo', powerPhrase: '¡Juntos somos más fuertes!' },
    { id: 'girl2', avatar: '👧', name: 'Sol', powerPhrase: '¡No tengo miedo de hablar!' },
    { id: 'boy2', avatar: '👦', name: 'Max', powerPhrase: '¡La verdad nos hace libres!' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-6">
      <AnimatePresence>
        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
      
      {!showTutorial && (
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Selecciona tu Personaje</h2>
          <CharacterSelection 
            characters={characters}
            onSelect={(character) => setCharacterSelected(character)}
          />
          {characterSelected && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Personaje Seleccionado:</h3>
              <div className="text-3xl">{characterSelected.avatar}</div>
              <p className="font-bold">{characterSelected.name}</p>
              <p className="italic">{characterSelected.powerPhrase}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameSetup;
