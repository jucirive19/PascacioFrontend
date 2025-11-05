import { MessageCircle, ArrowRight, Send, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const MESSAGE_INFO = [
    {
        id: 0,
        title: "¡Bienvenido a la Aventura !",
        message: "¡Es hora de empezar tu viaje!",
        description: "Para moverte, ¡usa el mágico joystick en la parte inferior izquierda! 🕹️\n\nEn la parte superior derecha, encontrarás tres botones especiales:\n- ¡El botón de pantalla completa te llevará a un mundo más grande! 🔍\n- El botón de música te permitirá silenciar los sonidos mágicos. 🔇\n- ¡Y el botón de la casita te llevará de vuelta al mapa principal cuando quieras! 🏠",
        type: "standard"
      },
      {
        id: 1,
        title: "¡Pascasio es un lugar seguro!",
        message: "¿Sabes que aquí nadie te juzgará?",
        description: "En Pascasio, todos somos amigos y queremos que te sientas feliz y protegido. ¡Nunca tienes que temer ser tú mismo!",
        type: "standard"
      },
      {
        id: 2,
        title: "¿Algo te está molestando?",
        message: "Cuéntanos lo que pasa",
        description: "Si necesitas ayuda con algo, sea en la escuela o en cualquier otro lugar, puedes confiar en nosotros. Escucharemos con atención y haremos todo lo posible por cuidarte.",
        type: "form",
        formFields: [
          { name: "feedback_text", label: "Déjanos tu mensaje", type: "textarea" }
        ]
      },
    {
        id: 3,
        title: "¡Cuéntanos tu Aventura!",
        message: "¿Qué fue lo más divertido?",
        description: "Nos encantaría saber qué parte de tu exploración te gustó más. ¡Tu opinión es súper importante!",
        type: "standard"
      },
      {
        id: 4,
        title: "¡Sé tú mismo en Pascasio!",
        message: "¿Quieres compartir algo?",
        description: "En Pascasio, puedes ser exactamente como eres. ¡Aquí aceptamos a todos! Si quieres contarnos algo importante, estaremos listos para escucharte con mucho cariño.",
        type: "standard"
      },
      {
        id: 5,
        title: "¡Juntos somos más fuertes!",
        message: "¿Necesitas un amigo?",
        description: "Recuerda que en Pascasio tienes muchos amigos mágicos que siempre estarán ahí para apoyarte. ¡Nunca estás solo!",
        type: "standard"
      },
      {
        id: 6,
        title: "¿Hay algo que te preocupe?",
        message: "Queremos escucharte",
        description: "Si hay algo que te esté molestando o te haga sentir triste, no dudes en compartirlo con nosotros. Aquí en Pascasio, siempre estaremos aquí para apoyarte y ayudarte de la mejor manera.",
        type: "standard"
      },
    
];

export const MessagePopup = ({ title, message, description, onClose, type = 'standard', formFields = [], onSubmit }) => {
    const [formData, setFormData] = useState({});

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (onSubmit) {
            await onSubmit(formData);
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="w-[32rem] bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-200 p-6"
            style={{
                boxShadow: '0 4px 20px rgba(45, 212, 191, 0.15), 0 0 0 1px rgba(45, 212, 191, 0.1)'
            }}
        >
            <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, rotate: [0, -5, 5, 0] }}
                transition={{ delay: 0.1, duration: 0.5 }}
            >
                <Star className="w-7 h-7 text-teal-500" />
                <h3 className="text-xl font-bold text-teal-700">{title}</h3>
            </motion.div>
            
            <motion.div 
                className="mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <h4 className="text-lg font-semibold text-teal-600 mb-2">
                    {message}
                </h4>
                <p className="text-base text-gray-600">
                    {description}
                </p>
            </motion.div>

            {type === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="block text-base font-medium text-gray-700">
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                                    rows={3}
                                    required
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    min={field.min}
                                    max={field.max}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                                    required
                                />
                            )}
                        </div>
                    ))}
                    
                    <motion.button
                        type="submit"
                        whileHover={{ 
                            scale: 1.03,
                            boxShadow: '0 0 15px rgba(45, 212, 191, 0.5)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-lg py-3 px-6 rounded-xl
                                flex items-center justify-center gap-3 group transition-all duration-300 ease-in-out
                                hover:from-teal-600 hover:to-emerald-700"
                    >
                        <span>¡Enviar!</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                </form>
            ) : (
                <motion.button
                    whileHover={{ 
                        scale: 1.03,
                        boxShadow: '0 0 15px rgba(45, 212, 191, 0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-lg py-3 px-6 rounded-xl
                             flex items-center justify-center gap-3 group transition-all duration-300 ease-in-out
                             hover:from-teal-600 hover:to-emerald-700"
                    onClick={onClose}
                >
                    <span>¡Entendido!</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
            )}

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
                    background: 'linear-gradient(135deg, #2DD4BF 0%, #34D399 50%, #059669 100%)',
                    filter: 'blur(20px)',
                }}
            />
        </motion.div>
    );
};

export const getMessagePoints = (scene) => {
    return MESSAGE_INFO.map(info => {
        const message = scene.getObjectByName(`mensaje_${info.id}`);
        if (message) {
            return {
                ...info,
                position: message.position,
            };
        }
        return null;
    }).filter(Boolean);
};

