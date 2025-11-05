import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import img1 from '../assets/img/afro/1.png';
import img2 from '../assets/img/afro/2.png';
import img3 from '../assets/img/afro/3.png';
import img4 from '../assets/img/afro/4.png';
import img5 from '../assets/img/afro/5.png';
import img6 from '../assets/img/afro/6.png';
import img7 from '../assets/img/afro/7.png';
import img8 from '../assets/img/afro/8.png';
import rigth from '../assets/sounds/rigth.wav'
import win from '../assets/sounds/win.wav'
import wrong from '../assets/sounds/wrong.wav'
import Preload from '../components/Preload'
import GameInstructions from '../hooks/GameInstructions'

const imagenes = [img1, img1, img2, img2, img3, img3, img4, img4, img5, img5, img6, img6, img7, img7, img8, img8];
const imagenesBarajadas = imagenes.sort(() => Math.random() - 0.5);

const Afro = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [tarjetasDestapadas, setTarjetasDestapadas] = useState(0);
  const [tarjeta1, setTarjeta1] = useState(null);
  const [tarjeta2, setTarjeta2] = useState(null);
  const [primerResultado, setPrimerResultado] = useState(null);
  const [segundoResultado, setSegundoResultado] = useState(null);
  const [movimientos, setMovimientos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [temporizador, setTemporizador] = useState(false);
  const [timer, setTimer] = useState(60);
  const [timerInicial] = useState(60);
  const [tiempoRegresivoId, setTiempoRegresivoId] = useState(null);
  const [mensajeFelicitacion, setMensajeFelicitacion] = useState('');
  const [mensajeMovimientos, setMensajeMovimientos] = useState('');

  const cardRefs = useRef([]);
  const audioRigth = new Audio(rigth)
  const audioWin = new Audio(win)
  const audioWrong = new Audio(wrong)

  useEffect(() => {
    if (temporizador && gameStarted) {
      const id = setInterval(() => {
        setTimer(prev => {
          const nuevoTiempo = prev - 1;
          if (nuevoTiempo === 0) {
            clearInterval(id);
            bloquearTarjetas();
          }
          return nuevoTiempo;
        });
      }, 1000);
      setTiempoRegresivoId(id);
    }

    return () => clearInterval(tiempoRegresivoId);
  }, [temporizador, gameStarted]);

  const bloquearTarjetas = () => {
    cardRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.innerHTML = `<img src="${imagenesBarajadas[i]}" alt="imagen" class="w-4/5 mx-auto"/>`;
        ref.disabled = true;
      }
    });
  };

  const destapar = id => {
    if (!gameStarted) return; 

    if (!temporizador) {
      setTemporizador(true);
    }

    const mostrarImagen = (id, src) => {
      const card = cardRefs.current[id];
      if (card) {
        card.innerHTML = `<img src="${src}" alt="imagen" class="w-4/5 mx-auto"/>`;
        card.disabled = true;
      }
    };

    setTarjetasDestapadas(prev => {
      const nuevos = prev + 1;
      if (nuevos === 1) {
        setTarjeta1(id);
        setPrimerResultado(imagenesBarajadas[id]);
        mostrarImagen(id, imagenesBarajadas[id]);
      } else if (nuevos === 2) {
        setTarjeta2(id);
        setSegundoResultado(imagenesBarajadas[id]);
        mostrarImagen(id, imagenesBarajadas[id]);
        setMovimientos(prev => prev + 1);
      }
      return nuevos;
    });
  };

  useEffect(() => {
    if (tarjetasDestapadas === 2) {
      if (primerResultado === segundoResultado) {
        setAciertos(prev => prev + 1);
        audioRigth.play();

        if (aciertos + 1 === 8) {
          setTemporizador(false);
          activarConfeti();
        }

        setTarjetasDestapadas(0);
      } else {
        audioWrong.play();
        setTimeout(() => {
          if (cardRefs.current[tarjeta1]) {
            cardRefs.current[tarjeta1].innerHTML = '';
            cardRefs.current[tarjeta1].disabled = false;
          }
          if (cardRefs.current[tarjeta2]) {
            cardRefs.current[tarjeta2].innerHTML = '';
            cardRefs.current[tarjeta2].disabled = false;
          }
          setTarjetasDestapadas(0);
        }, 800);
      }
    }
  }, [tarjetasDestapadas, primerResultado, segundoResultado, aciertos]);

  const activarConfeti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    audioWin.play();
    
    setMensajeFelicitacion(`¡Increíble! Lo acabaste en ${timerInicial - timer} segundos. 🤓🧠⏱️`);
    setMensajeMovimientos(`¡Increíble! Lo lograste en solo ${movimientos} movimientos. 😎🎉🤘`);
  };

  const resetGame = () => {
    clearInterval(tiempoRegresivoId);
    setTemporizador(false);
    setTimer(timerInicial);
    setMovimientos(0);
    setAciertos(0);
    setTarjetasDestapadas(0);
    setTarjeta1(null);
    setTarjeta2(null);
    setPrimerResultado(null);
    setSegundoResultado(null);
    setMensajeFelicitacion('');
    setMensajeMovimientos('');
    setShowInstructions(true);
    setGameStarted(false);

    const nuevasImagenes = imagenes.sort(() => Math.random() - 0.5);
    cardRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.innerHTML = '';
        ref.disabled = false;
      }
    });
  };

  return (
    <Preload>
      {showInstructions && (
        <GameInstructions 
          onClose={() => setShowInstructions(false)}
          setGameStarted={setGameStarted}
        />
      )}
      
      <main className="flex flex-col md:flex-row justify-center items-center w-full min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 p-4 pt-8">
        <section className="bg-white bg-opacity-20 p-4 rounded-lg w-full mt-8 md:w-auto md:mt-0">
          <h2 className="text-center text-white text-2xl mb-4 md:text-lg">Juego de memoria</h2>
          <div className="grid grid-cols-4 gap-1 md:grid-cols-4 md:gap-1">
            {Array.from({ length: 16 }).map((_, index) => (
              <button
                key={index}
                ref={el => cardRefs.current[index] = el}
                className={`h-16 w-16 bg-gray-300 rounded-md text-black font-bold text-4xl md:h-24 md:w-24 md:text-xl ${
                  !gameStarted ? 'cursor-not-allowed opacity-50' : ''
                }`}
                onClick={() => destapar(index)}
                disabled={!gameStarted}
              />
            ))}
          </div>
        </section>

        <section className="bg-white bg-opacity-20 mt-4 md:mt-0 w-full md:w-1/3 lg:w-1/4 h-auto rounded-lg px-5 py-4 flex flex-col items-center">
          <div className="border border-white w-full max-w-xs md:max-w-full rounded-lg p-3 box-border mb-3 md:h-26 md:p-5 md:mb-4">
            <h2 className="text-center text-white text-base md:text-lg">
              {mensajeFelicitacion || `Tiempo: ${timer} seg`}
            </h2>
          </div>

          <div className="border border-white w-full max-w-xs md:max-w-full rounded-lg p-3 box-border mb-3 md:h-26 md:p-5 md:mb-4">
            <h2 className="text-center text-white text-base md:text-lg">
              {mensajeMovimientos || `Movimientos: ${movimientos}`}
            </h2>
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </section>
      </main>
    </Preload>
  );
};

export default Afro;