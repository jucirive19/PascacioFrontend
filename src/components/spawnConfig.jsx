import { Sparkles, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SPAWN_INFO = [
    { 
        id: 1, 
        title: "Sección Minero", 
        description: "¿Sabías que como niño tienes derecho a estudiar y no a trabajar en minas? ¡Descúbrelo aquí!", 
        action: "/Minero" 
    },
    { 
        id: 2, 
        title: "Sección Bonus", 
        description: "Diviértete y mejora tus habilidades", 
        action: "/Bonus" 
    },
    { 
        id: 3, 
        title: "Sección Afro", 
        description: "En Boyacá y en todo el mundo hay muchas personas diferentes, pero todos somos iguales y tenemos los mismos derechos. ¡Ven a aprender más!", 
        action: "/Afro" 
    },
    { 
        id: 4, 
        title: "Sección Campesinos", 
        description: "Debemos estar muy orgullosos de nuestros campesinos y de nuestro hermoso departamento. ¡Descubre por qué aquí!", 
        action: "/Campesino" 
    },
    { 
        id: 5, 
        title: "Sección Indígena", 
        description: "Los indígenas de Boyacá tienen leyendas sobre el agua y la montaña. ¡Ven a explorar sus secretos!", 
        action: "/Indigena"  
    },
    { 
        id: 6, 
        title: "Ayuda", 
        description: "Te escuchamos", 
        action: "/Ayuda" 
    }
];


export const SpawnPopup = ({ title, description, onAction }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="w-80 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-200 p-6"
            style={{
                boxShadow: '0 4px 20px rgba(104, 109, 224, 0.15), 0 0 0 1px rgba(104, 109, 224, 0.1)'
            }}
        >
            <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <Compass className="w-7 h-7 text-indigo-500" />
                <h3 className="text-2xl font-bold text-indigo-700">{title}</h3>
            </motion.div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-lg text-gray-600 mb-6"
            >
                {description}
            </motion.p>
            
            <motion.button
                whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 0 15px rgba(104, 109, 224, 0.5)'
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg py-3 px-6 rounded-xl
                           flex items-center justify-center gap-3 group transition-all duration-300 ease-in-out
                           hover:from-indigo-600 hover:to-purple-700"
                onClick={onAction}
            >
                <Sparkles className="w-5 h-5" />
                <span>¡Explora la aventura!</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.div
                className="absolute -z-10 inset-0 rounded-2xl opacity-30"
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: [0.2, 0.3, 0.2],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #EC4899 100%)',
                    filter: 'blur(20px)',
                }}
            />
        </motion.div>
    );
};

export const getSpawnPoints = (scene) => {
    return SPAWN_INFO.map(info => {
        const spawn = scene.getObjectByName(`spawn_${info.id}`);
        if (spawn) {
            return {
                ...info,
                position: spawn.position,
            };
        }
        return null;
    }).filter(Boolean);
};