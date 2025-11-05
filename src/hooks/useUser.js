import { useState, useEffect, useCallback } from 'react';

/**
 * Hook simple para acceder al ID del usuario almacenado
 * Útil para incluir el ID en formularios posteriores
 */
export const useUser = () => {
  const [userId, setUserId] = useState(null);

  // Función para obtener el ID del usuario desde sessionStorage
  const getUserId = useCallback(() => {
    const storedUserId = sessionStorage.getItem('userId');
    console.log('🔍 [useUser] Obteniendo ID del usuario desde sessionStorage:', storedUserId);
    setUserId(storedUserId);
    return storedUserId;
  }, []);

  // Función para almacenar el ID del usuario
  const setUserIdStorage = useCallback((id) => {
    console.log('💾 [useUser] Almacenando ID del usuario:', id);
    sessionStorage.setItem('userId', id);
    setUserId(id);
    console.log('✅ [useUser] ID del usuario almacenado exitosamente en sessionStorage');
  }, []);

  // Cargar el ID del usuario al montar el hook
  useEffect(() => {
    console.log('🚀 [useUser] Hook inicializado, cargando ID del usuario...');
    getUserId();
  }, [getUserId]);

  // Log cuando el userId cambia
  useEffect(() => {
    if (userId) {
      console.log('🔄 [useUser] ID del usuario actualizado:', userId);
    } else {
      console.log('🔄 [useUser] No hay ID del usuario disponible');
    }
  }, [userId]);

  return {
    userId,
    getUserId,
    setUserId: setUserIdStorage
  };
};
