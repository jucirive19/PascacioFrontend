import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Clock, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import axios from 'axios';
import Preload from '../components/Preload';
import InstruccionesMinero from '../hooks/InstruccionesMinero.jsx';

// Importar audios de preguntas
import pregunta1 from '../assets/sounds/pregunta1.wav';
import pregunta2 from '../assets/sounds/pregunta2.wav';
import pregunta3 from '../assets/sounds/pregunta3.wav';
import pregunta4 from '../assets/sounds/pregunta4.wav';
import pregunta5 from '../assets/sounds/prehunta5.wav';
import pregunta6 from '../assets/sounds/pregunta6.wav';

// URL del backend
const BACKEND_URL = 'http://localhost:3000';

// Obtener las preguntas del backend
const obtenerPreguntas = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/obtener-preguntas`);
    console.log('Preguntas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    throw error;
  }
};

// Guardar las respuestas del niño
const guardarRespuestas = async (registroId, respuestas) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/guardar-respuestas`, {
      registro_id: registroId,
      respuestas: respuestas
    });
    
    console.log(' Respuestas guardadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    throw error;
  }
};

export default function Component() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [options, setOptions] = useState([]);
  const [addTimeUsed, setAddTimeUsed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Array de audios de preguntas
  const questionAudios = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6];

  // Función para reproducir audio de pregunta
  const playQuestionAudio = (questionIndex) => {
    // Detener audio actual si está reproduciéndose
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Verificar que existe el audio para esta pregunta
    if (questionIndex < questionAudios.length) {
      const audio = new Audio(questionAudios[questionIndex]);
      audio.volume = isAudioMuted ? 0 : 1;
      
      audio.addEventListener('ended', () => {
        setIsAudioPlaying(false);
        setCurrentAudio(null);
      });

      audio.addEventListener('error', (e) => {
        console.error('Error al reproducir audio de pregunta:', e);
        setIsAudioPlaying(false);
        setCurrentAudio(null);
      });

      setCurrentAudio(audio);
      setIsAudioPlaying(true);
      audio.play().catch(error => {
        console.error('Error al iniciar reproducción:', error);
        setIsAudioPlaying(false);
        setCurrentAudio(null);
      });
    }
  };

  // Función para detener audio actual
  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsAudioPlaying(false);
      setCurrentAudio(null);
    }
  };

  // Función para alternar mute
  const toggleAudioMute = () => {
    setIsAudioMuted(!isAudioMuted);
    if (currentAudio) {
      currentAudio.volume = isAudioMuted ? 1 : 0;
    }
  };

  // Cargar preguntas al inicio
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setLoading(true);
        const preguntasData = await obtenerPreguntas();
        /*console.log('Datos recibidos del backend:', preguntasData); */
        
        // Verificar si las preguntas vienen en un array o en un objeto con propiedad
        const preguntas = Array.isArray(preguntasData) ? preguntasData : preguntasData.preguntas || [];
        
        setQuestions(preguntas);
        if (preguntas.length > 0) {
          /*console.log('Primera pregunta:', preguntas[0]); */
          setOptions(preguntas[0].opciones || []);
        }
      } catch (error) {
        console.error('Error al cargar preguntas:', error);
        // En caso de error, usar preguntas por defecto
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        handleNextQuestion();
        return 60;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, gameStarted]);

  // Reproducir audio cuando cambie la pregunta
  useEffect(() => {
    if (gameStarted && questions.length > 0 && currentQuestionIndex < questionAudios.length) {
      playQuestionAudio(currentQuestionIndex);
    }
  }, [currentQuestionIndex, gameStarted, questions.length]);

  // Cleanup del audio al desmontar el componente
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  const handleAnswerSelect = (answer) => {
    if (!gameStarted) return;
    
    // Detener audio actual cuando se selecciona una respuesta
    stopCurrentAudio();
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    // Guardar la respuesta del usuario
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.opciones.find(option => option.texto === answer);
    
    const userAnswer = {
      pregunta_id: currentQuestion.id,
      opcion_id: selectedOption ? selectedOption.id : null,
      respuesta_text: null
    };

    setUserAnswers(prev => [...prev, userAnswer]);
  };

  const handleNextQuestion = async () => {
    // Detener audio actual antes de cambiar de pregunta
    stopCurrentAudio();
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(60);
      setOptions(questions[currentQuestionIndex + 1].opciones || []);
      setAddTimeUsed(false);
    } else {
      // Guardar todas las respuestas al finalizar
      try {
        const userId = sessionStorage.getItem('userId') || 1; // Obtener ID del usuario
        await guardarRespuestas(userId, userAnswers);
        console.log('Todas las respuestas guardadas exitosamente');
      } catch (error) {
        console.error('Error al guardar respuestas finales:', error);
      }
      setQuizCompleted(true);
    }
  };

  const handleAddTime = () => {
    if (addTimeUsed || !gameStarted) return;
  
    setTimeLeft(prevTime => prevTime + 15);
    setAddTimeUsed(true);
  };

  // Mostrar loading mientras se cargan las preguntas
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-100">
        <div className="text-2xl font-bold text-purple-700 mb-4">Cargando preguntas...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Mostrar error si no hay preguntas
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-100">
        <div className="text-2xl font-bold text-red-600 mb-4">Error al cargar las preguntas</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-500 text-white px-6 py-3 rounded-full"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-200 to-orange-300 p-6 text-purple-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full"
        >
          <h2 className="text-4xl font-bold mb-4">¡Gracias por participar! 🎉</h2>
          <p className="text-2xl mb-4">Recuerda: tienes derecho a sentirte seguro y respetado</p>
          <p className="text-lg text-purple-600">Tus respuestas han sido guardadas para ayudarnos a entender mejor tus opiniones</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Preload>
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-100 p-4 sm:p-6 md:p-24">
        {!gameStarted ? (
          <InstruccionesMinero setGameStarted={setGameStarted} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
          >
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg bg-opacity-60">
            {/* Header Section */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-between items-center mb-6 sm:mb-8"
            >
              <ArrowLeft className="w-8 h-8 text-purple-600" />
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 rounded-full shadow-lg"
              >
                Pregunta {currentQuestionIndex + 1}/{questions.length}
              </motion.span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAudioMute}
                  className="p-2 bg-white/20 rounded-full text-purple-600 hover:bg-white/30 transition-colors"
                >
                  {isAudioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </motion.div>

            {/* Question Section */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 sm:mb-8"
            >
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
                  {currentQuestion.texto}
                </h2>
                {isAudioPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-purple-600"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 bg-purple-500 rounded-full"
                    />
                    <span className="text-sm font-medium">Reproduciendo pregunta...</span>
                  </motion.div>
                )}
              </div>
              
              {/* Timer Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 60) * 100}%` }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                />
              </div>
              <div className="text-right text-lg font-semibold text-purple-700">
                {timeLeft}:00
              </div>
            </motion.div>

            {/* Options Section */}
            <div className="space-y-4 mb-6 sm:mb-8">
              {options.map((option, index) => (
                <motion.button
                  key={option.id || index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl text-left text-base sm:text-lg font-semibold transition-all duration-300 ${
                    selectedAnswer === option.texto
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white transform scale-105'
                      : 'bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200'
                  }`}
                  onClick={() => handleAnswerSelect(option.texto)}
                  disabled={showFeedback || !gameStarted}
                >
                  {option.texto}
                </motion.button>
              ))}
            </div>

            {/* Feedback Section */}
            {showFeedback && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-purple-200"
              >
                <p className="text-xl sm:text-2xl font-bold mb-2 text-purple-700">
                  ¡Gracias por responder! 😊
                </p>
                <p className="text-base sm:text-lg text-purple-600">
                  {currentQuestion.feedback || '¡Sigue así!'}
                </p>
              </motion.div>
            )}

            {/* Controls Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-wrap justify-between items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base ${
                  addTimeUsed
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
                onClick={handleAddTime}
                disabled={addTimeUsed || !gameStarted}
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Añadir tiempo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                onClick={handleNextQuestion}
                disabled={(!showFeedback && currentQuestionIndex < questions.length - 1) || !gameStarted}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        )}
      </div>
    </Preload>
  );
}