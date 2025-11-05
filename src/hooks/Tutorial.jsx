import React from 'react';
import { motion } from 'framer-motion';
import { Home, Volume2, Maximize } from 'lucide-react';

const Tutorial = ({ tutorialStep, setTutorialStep }) => {
    if (tutorialStep === 'none') return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white bg-opacity-90 rounded-3xl p-8 max-w-md mx-4 relative z-10"
            >
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
                    ¡Aprende a Jugar! 🎮
                </h2>
                
                {tutorialStep === 'joystick' ? (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-purple-600 mb-4">
                            ¡Mueve el Joystick!
                        </h3>
                        <p className="text-gray-700 mb-6">
                            Usa el joystick para mover a tu personaje en todas las direcciones.
                        </p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-purple-600 mb-4">
                            ¡Prueba los Botones Mágicos!
                        </h3>
                        <div className="flex justify-center gap-4 mb-4">
                            <div className="bg-red-400 w-12 h-12 rounded-full flex items-center justify-center">
                                <Home className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-blue-400 w-12 h-12 rounded-full flex items-center justify-center">
                                <Volume2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-green-400 w-12 h-12 rounded-full flex items-center justify-center">
                                <Maximize className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Usa estos botones para ir a casa, controlar el sonido y agrandar la pantalla.
                        </p>
                    </div>
                )}
                
                <button
                    onClick={() => {
                        if (tutorialStep === 'joystick') {
                            setTutorialStep('buttons');
                        } else {
                            setTutorialStep('none');
                        }
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold w-full hover:bg-blue-600 transition-colors"
                >
                    {tutorialStep === 'joystick' ? 'Ver Botones' : 'Comenzar a Jugar'}
                </button>
            </motion.div>
        </div>
    );
};

export default Tutorial;