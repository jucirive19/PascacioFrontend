import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Fox from './Fox';
import Loader from '../components/Loader';
import axios from 'axios';
import { motion } from 'framer-motion'
import { Loader2, Send, School, User, Users, MessageSquare } from 'lucide-react'
import { useUser } from '../hooks/useUser'

const Ayuda = () => {
  const { userId } = useUser();
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    confi: '',
    otroConfi: '',
    colegio: '',
    mensaje: '',
    latitud: '',
    longitud: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [currentAnimations, setCurrentAnimations] = useState('idle');
  const [isOtherConfi, setIsOtherConfi] = useState(false);
  const [errors, setErrors] = useState({});

  // Determinar la URL del backend basado en el entorno
  const backendUrl = import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_API_URL_PRODUCTION_1
    : import.meta.env.VITE_BACKEND_URL_DEVELOPMENT;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confi: value });
    setIsOtherConfi(value === 'otro');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!form.confi) {
      newErrors.confi = 'Debes seleccionar un superhéroe de confianza';
    }
    if (isOtherConfi && !form.otroConfi.trim()) {
      newErrors.otroConfi = 'Este campo es obligatorio si seleccionas "Otro"';
    }
    if (!form.colegio.trim()) {
      newErrors.colegio = 'El nombre de la escuela es obligatorio';
    }
    if (!form.mensaje.trim()) {
      newErrors.mensaje = 'Debes escribir un mensaje';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const obtenerGeolocalizacion = (callback) => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (posicion) => {
            const lat = posicion.coords.latitude;
            const long = posicion.coords.longitude;
            callback(lat, long);
            resolve({ lat, long });
          },
          (error) => {
            mostrarError(error);
            reject(error);
          }
        );
      } else {
        const errorMsg = "La geolocalización no es soportada por este navegador.";
        alert(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
    setCurrentAnimations('walk');
  
  
    try {
      await obtenerGeolocalizacion((latitud, longitud) => {
        const updatedForm = { 
          ...form, 
          latitud, 
          longitud,
          userId: userId // Incluir el ID del usuario
        };

        console.log('📤 [Ayuda] Enviando formulario con ID del usuario:', {
          userId: userId,
          formData: updatedForm
        });
  
        axios.post(`${backendUrl}/api/enviar`, updatedForm, { 
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log('Formulario enviado exitosamente:', response.data);
          setLoading(false);
          setCurrentAnimations('idle');
          alert('Formulario enviado con éxito');
        })
        .catch((error) => {
          console.error('Error al enviar el formulario:', error);
          setLoading(false);
          setCurrentAnimations('idle');
          alert(error.response?.data?.message || 'Ocurrió un error al enviar el formulario');
        });
      });
    } catch (error) {
      console.error('Error en el envío:', error);
      setLoading(false);
      setCurrentAnimations('idle');
      alert('No se pudo completar el envío del formulario');
    }
  };
  
  return (

    <section className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 p-4 md:p-8  ">
      <div className='pt-12'>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:flex-1 p-6 md:p-8">
            <motion.h1 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-4xl font-bold mb-6 text-center text-purple-600"
            >
              ¡Te Escuchamos!
            </motion.h1>
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <label htmlFor="name" className="block text-lg text-blue-600 mb-2">
                  <User className="inline-block mr-2" />
                  ¿Cómo te llamas?
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-yellow-50 border-2 border-yellow-300 focus:border-yellow-500 rounded-lg"
                  placeholder="Tu nombre mágico"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <label htmlFor="confi" className="block text-lg text-green-600 mb-2">
                  <Users className="inline-block mr-2" />
                  ¿Quién es tu superhéroe de confianza?
                </label>
                <select
                  id="confi"
                  name="confi"
                  value={form.confi}
                  onChange={handleSelectChange}
                  className="w-full p-2 bg-green-50 border-2 border-green-300 focus:border-green-500 rounded-lg"
                  required
                >
                  <option value="" disabled>Elige tu superhéroe</option>
                  <option value="amigo">Amigo Asombroso</option>
                  <option value="familiar">Familiar Fantástico</option>
                  <option value="compañero">Compañero Cósmico</option>
                  <option value="otro">Otro Héroe</option>
                </select>
              </motion.div>

              {isOtherConfi && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label htmlFor="otroConfi" className="block text-lg text-orange-600 mb-2">
                    <Users className="inline-block mr-2" />
                    ¿Quién es tu otro superhéroe?
                  </label>
                  <input
                    id="otroConfi"
                    name="otroConfi"
                    value={form.otroConfi}
                    onChange={handleChange}
                    className="w-full p-2 bg-orange-50 border-2 border-orange-300 focus:border-orange-500 rounded-lg"
                    placeholder="Nombre de tu superhéroe secreto"
                    required
                  />
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <label htmlFor="colegio" className="block text-lg text-red-600 mb-2">
                  <School className="inline-block mr-2" />
                  ¿Cómo se llama tu escuela mágica?
                </label>
                <input
                  id="colegio"
                  name="colegio"
                  value={form.colegio}
                  onChange={handleChange}
                  className="w-full p-2 bg-red-50 border-2 border-red-300 focus:border-red-500 rounded-lg"
                  placeholder="Nombre de tu escuela de magia"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <label htmlFor="mensaje" className="block text-lg text-indigo-600 mb-2">
                  <MessageSquare className="inline-block mr-2" />
                  Cuéntanos tu aventura
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  className="w-full p-2 bg-indigo-50 border-2 border-indigo-300 focus:border-indigo-500 rounded-lg"
                  placeholder="¿Cómo podemos ayudarte en tu misión? 🚀🦸‍♂️🌈"
                  rows={4}
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Preparando tu mensaje mágico...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    ¡Envía tu mensaje mágico!
                  </>
                )}
              </motion.button>
            </form>

       
          </div>

          <div className="md:flex-1 h-64 md:h-auto">
            <Canvas
              camera={{
                position: [0, 0, 5],
                fov: 75,
                near: 0.1,
                far: 1000
              }}
            >
              <directionalLight intensity={0.5} position={[2, 0, 1]} />
              <ambientLight intensity={1.8} />

              <Suspense fallback={<Loader />}>
                <Fox
                  currentAnimation={currentAnimations}
                  position={[0.5, 0.35, 0]}
                  rotation={[12.6, -0.6, 0]}
                  scale={[0.5, 0.5, 0.5]}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </motion.div>
      </div>
      
    </section>
    
  );
};

export default Ayuda;