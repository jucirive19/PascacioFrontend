import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png'; //cambiar por la imagen "pensando "

const Preload = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-violet-500"></div>
            <img src={logo} alt="Gobernación de Boyacá" className="h-28 w-28" />
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default Preload;