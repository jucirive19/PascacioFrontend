import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from "react-router-dom"
import { RefreshCcw, Heart, SendHorizonal } from 'lucide-react'
import { motion } from "framer-motion"
import clsx from 'clsx'
import axios from 'axios'
import Swal from 'sweetalert2'
import Fondo from '../components/Fondo.jsx'
import MagicInstructions from '../hooks/MagicInstructions.jsx'
import { useUser } from '../hooks/useUser'

// Importar imágenes
import img1 from "../assets/img/Avatars/4.jpeg"
import img2 from "../assets/img/Avatars/2.jpeg"
import img3 from "../assets/img/Avatars/3.jpeg"
import img4 from "../assets/img/Avatars/4.jpeg"
import img5 from "../assets/img/Avatars/5.jpeg"
import img6 from "../assets/img/Avatars/6.jpg"

const BACKEND_URL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_BACKEND_URL_DEVELOPMENT
  : import.meta.env.VITE_API_URL_PRODUCTION_1

const CustomInput = React.memo(({ 
  value, 
  onChange, 
  placeholder, 
  className, 
  ...props 
}) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={clsx(
      "bg-white rounded-full px-4 md:px-8 py-2 md:py-3 flex items-center justify-center border-2 border-[#22C55E]",
      className
    )}
  >
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(
        "text-[#8A4FFF] font-bold bg-transparent text-center outline-none flex-1 text-lg md:text-xl placeholder-[#8A4FFF]/50",
        className
      )}
      {...props}
    />
    <Heart className="text-[#FF4545] h-5 w-5 md:h-6 md:w-6 ml-2" />
  </motion.div>
))

const CustomButton = React.memo(({ 
  children, 
  className, 
  ...props 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={clsx(
      "bg-gradient-to-r from-[#FF5C8A] to-[#FFB23F] hover:from-[#FF5C8A]/90 hover:to-[#FFB23F]/90 text-white rounded-full py-3 md:py-4 text-lg md:text-xl font-bold mt-4 transition-colors flex items-center justify-center w-full shadow-lg",
      className
    )}
    {...props}
  >
    <SendHorizonal className="mr-2 h-5 w-5 md:h-6 md:w-6" />
    {children}
  </motion.button>
))

export default function Creacion() {
  const navigate = useNavigate()
  const { setUserId } = useUser()
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [username, setUsername] = useState("")
  const selectedColor = "bg-[#8A4FFF]"
  const [showInstructions, setShowInstructions] = useState(true)

  const avatars = useMemo(() => [img1, img2, img3, img4, img5, img6], [])

  const handleAvatarChange = useCallback(() => {
    setAvatarIndex((prevIndex) => (prevIndex + 1) % avatars.length)
  }, [avatars])

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])

  const handleEnter = useCallback(async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      return Swal.fire({
        title: '¡Te Escuchamos!',
        text: '¡No olvides escribir tu nombre mágico!',
        icon: 'warning',
        confirmButtonText: '¡Entendido!',
        background: '#FFFFFF',
        confirmButtonColor: '#8A4FFF'
      })
    }

    try {
      console.log('📤 [Creacion] Enviando datos de registro al backend:', {
        username: username.trim(),
        avatar: avatars[avatarIndex],
        avatarColor: selectedColor
      });

      const response = await axios.post(`${BACKEND_URL}/api/registrar`, { 
        username: username.trim(),
        avatar: avatars[avatarIndex],
        avatarColor: selectedColor    
      })
      
      console.log('📥 [Creacion] Respuesta del backend:', response.data);
      
      if (response.data.success) {
        console.log('✅ [Creacion] Registro exitoso, almacenando datos del usuario...');
        
        // Almacenar datos básicos del usuario
        sessionStorage.setItem('registeredUser', 'true')
        sessionStorage.setItem('username', username.trim())
        sessionStorage.setItem('avatar', avatars[avatarIndex])
        sessionStorage.setItem('avatarColor', selectedColor)
        
        console.log('💾 [Creacion] Datos básicos almacenados en sessionStorage');
        
        // Almacenar el ID del usuario usando el hook
        // Buscar el ID en diferentes propiedades posibles
        const userId = response.data.userId || 
                      response.data.id || 
                      response.data.user?.id || 
                      response.data.userId || 
                      response.data.user_id ||
                      response.data.userID;
        
        console.log('🔍 [Creacion] ID del usuario extraído de la respuesta:', userId);
        console.log('🔍 [Creacion] Respuesta completa del backend:', response.data);
        
        if (userId) {
          setUserId(userId)
          console.log('🎉 [Creacion] Usuario registrado exitosamente con ID:', userId);
        } else {
          console.warn('⚠️ [Creacion] No se encontró ID del usuario en la respuesta del backend');
          console.error('❌ [Creacion] El backend debe devolver el userId en la respuesta');
        }
        
        navigate('/welcome', { replace: true })
      } else {
        console.error('❌ [Creacion] El backend devolvió success: false');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error Mágico',
        text: error.response?.data?.message || '¡Ups! Parece que la magia falló.',
        icon: 'error',
        confirmButtonText: 'Intentar otro hechizo',
        background: '#FFFFFF',
        confirmButtonColor: '#FF4545'
      })
    }
  }, [username, avatarIndex, avatars, navigate])

  return (
    <div className="relative min-h-screen w-full">
      {showInstructions && (
        <MagicInstructions onClose={() => setShowInstructions(false)} />
      )}
      <div className="absolute inset-0 z-0">
        <Fondo />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/20 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <h1 className="text-[#7835ff] text-3xl md:text-4xl font-bold">¡BIENVENIDO A PASCASIO!</h1>
            
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={clsx(
                  "w-32 h-32 md:w-40 md:h-40 rounded-full p-2",
                  selectedColor
                )}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FF5C8A] to-[#FFB23F] relative">
                  <img
                    src={avatars[avatarIndex]}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -top-2 -right-2 rounded-full bg-white text-[#8A4FFF] hover:bg-[#8A4FFF] hover:text-white h-8 w-8 md:h-10 md:w-10 flex items-center justify-center shadow-md"
                    onClick={handleAvatarChange}
                  >
                    <RefreshCcw className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.button>
                </div>
              </motion.div>
              {/* PowerBI Dashboard - Comentado temporalmente para despliegue */}
              {/* <iframe 
                title="PowerBI Dashboard" 
                width="800" 
                height="836" 
                src="https://app.powerbi.com/view?r=eyJrIjoiODI4YjY4MjYtNmI5YS00NDhkLTgxYTYtYWRmMjgzYzQwZWE3IiwidCI6IjAzZTFiMjI2LTU3ODktNGE5Ny05MGY2LTQ0YTQ0MjQxYmE2ZCIsImMiOjR9" 
                frameBorder="0" 
                allowFullScreen={true}
                sandbox="allow-same-origin allow-scripts allow-forms"
              ></iframe> */}
            </div>

            <CustomInput
              value={username}
              onChange={handleUsernameChange}
              placeholder="Tu nombre mágico"
            />

            <CustomButton onClick={handleEnter}>
              ¡INICÍA TÚ AVENTURA!
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}