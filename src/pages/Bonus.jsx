'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Map, Heart, Sparkles, Star } from 'lucide-react'
import confetti from 'canvas-confetti'
import questions from "../hooks/questions.js"

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-lg ${className}`}>
    {children}
  </div>
)

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)

  const handleAnswer = (isCorrect) => {
    const correctAudio = new Audio('/sounds/win.wav')
    const wrongAudio = new Audio('/sounds/wrong.wav')
  
    if (isCorrect) {
      setScore(score + 1)
      correctAudio.play()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      wrongAudio.play()
    }
  
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(score)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-3xl font-bold text-center text-[#d97706] mb-6">{questions[currentQuestion].question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questions[currentQuestion].answers.map((answer, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#fbbf24] to-[#d97706] hover:from-[#f59e0b] hover:to-[#b45309] text-white font-bold py-6 px-6 rounded-2xl text-xl shadow-md"
              onClick={() => handleAnswer(answer.isCorrect)}
            >
              {answer.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function MagicalDashboard() {
  const [points, setPoints] = useState(0)
  const [quizResults, setQuizResults] = useState({})
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const categories = [
    {
      title: "Internet Seguro",
      icon: Lock,
      color: "bg-gradient-to-r from-blue-400 to-blue-600",
      borderColor: "border-blue-300",
      emoji: "🔒",
      questions: questions["Internet Seguro"]
    },
    {
      title: "Mi Escuela",
      icon: Map,
      color: "bg-gradient-to-r from-green-400 to-green-600",
      borderColor: "border-green-300",
      emoji: "🚌",
      questions: questions["Mi colegio"]
    },
    {
      title: "Mis Emociones",
      icon: Heart,
      color: "bg-gradient-to-r from-pink-400 to-pink-600",
      borderColor: "border-pink-300",
      emoji: "😊",
      questions: questions["Mis Emociones"]
    }
  ]

  const handleQuizComplete = (category, score) => {
    setQuizResults({ ...quizResults, [category]: score })
    setPoints(points + score)
    setActiveQuiz(null)
    if (score === questions[category].length) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const handleCategoryClick = (category) => {
    setActiveQuiz(category)
  }

  return (
    <div className='pt-14 bg-gradient-to-b from-[#fef3c7] to-[#fde68a] min-h-screen'>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Card className="flex items-center gap-4 border-4 border-[#fbbf24]">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2 
              }}
              className="relative"
            >
              <span className="text-6xl">🧙‍♂️</span>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-[#fbbf24]" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-[#d97706]">
                ¡Hola, {username || "Aprendiz Mágico"}!
              </h1>
              <p className="text-2xl text-gray-600">Estrellas Mágicas: 
                <motion.span 
                  className="font-bold text-[#d97706] ml-2"
                  key={points}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 5 }}
                >
                  {points}
                </motion.span>
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className={`hover:shadow-xl transition-all cursor-pointer ${category.borderColor} hover:scale-105`}
              onClick={() => handleCategoryClick(category)}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0px 0px 8px rgb(255,255,255)"
              }}
            >
              <Card className={`${category.color} text-white`}>
                <motion.div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg bg-white"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2 
                  }}
                >
                  <span className="text-4xl">{category.emoji}</span>
                </motion.div>
                <h2 className="font-bold text-2xl text-center mb-2">{category.title}</h2>
                <p className="text-xl text-center">
                  Estrellas ganadas: {quizResults[category.title] || 0}
                </p>
                <div className="flex justify-center mt-2">
                  {[...Array(category.questions.length)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-8 h-8 ${i < (quizResults[category.title] || 0) ? 'text-yellow-300 fill-yellow-300' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeQuiz && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-80"
            >
              <Card className="w-full max-w-2xl mx-4">
                <Quiz questions={activeQuiz.questions} onComplete={(score) => handleQuizComplete(activeQuiz.title, score)} />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

