const questions = {

    "Internet Seguro": [
        {
          question: "Si alguien te pide que te reúnas en persona sin que un adulto te acompañe, ¿qué debes hacer?",
          answers: [
            { text: "Ir, porque esa persona parece amigable 👫", isCorrect: false },
            { text: "Contárselo a tus padres o un adulto de confianza antes de ir 👨‍👩‍👧‍👦", isCorrect: true },
            { text: "Aceptar la invitación sin pensarlo 🤔", isCorrect: false },
            { text: "Ignorarlo y no hacer nada 🤷‍♀️", isCorrect: false }
          ]
        },
        {
          question: "Si alguien en internet te envía mensajes o fotos que te hacen sentir incómodo, ¿qué debes hacer?",
          answers: [
            { text: "Responder rápidamente para que no se moleste 🙇‍♀️", isCorrect: false },
            { text: "Guardar los mensajes y contárselo a un adulto o a las autoridades 🛡️", isCorrect: true },
            { text: "Decirle que se detenga y no hacer nada más 🛑", isCorrect: false },
            { text: "Hablar con esa persona y continuar la conversación 📲", isCorrect: false }
          ]
        }
    ],
    
//preguntas para la seccion del colegio 
    "Mi colegio": [
  {
    question: "Si un compañero o profesor te está intimidando psicológicamente (te hace sentir mal, te grita, te ridiculiza), ¿qué debes hacer?",
    answers: [
      { text: "Quedarte callado para que no te sigan molestando 🤐", isCorrect: false },
      { text: "Contárselo a un adulto de confianza como tus padres o un maestro 👨‍🏫", isCorrect: true },
      { text: "Decirle que dejen de hacerlo y continuar callado 🤐", isCorrect: false },
      { text: "Tratar de vengarte o pelear 🥊", isCorrect: false }
    ]
  },
  {
    question: "Si un compañero o profesor te hace sentir incómodo con comentarios o toques inapropiados, ¿qué debes hacer?",
    answers: [
      { text: "Decirle que no te moleste y seguir adelante 👋", isCorrect: false },
      { text: "Contárselo a un adulto de confianza inmediatamente 📞", isCorrect: true },
      { text: "Ignorarlo porque seguro se va a calmar 🧘‍♂️", isCorrect: false },
      { text: "Quedarte callado y esperar que pase 🤐", isCorrect: false }
    ]
  },
  {
    question: "Si alguien te amenaza con hacerte daño o con contar algo que no es cierto sobre ti, ¿qué debes hacer?",
    answers: [
      { text: "No hacer nada, solo quedarme tranquilo 🤔", isCorrect: false },
      { text: "Contarle a un adulto para que te ayude 🧑‍🏫", isCorrect: true },
      { text: "Amenazar a esa persona para que deje de hablar mal de ti 💥", isCorrect: false },
      { text: "Aceptar la amenaza porque no quieres que te hagan más daño 😟", isCorrect: false }
    ]
  },
  {
    question: "Si algún compañero o profesor te está tocando de manera inapropiada, ¿qué debes hacer?",
    answers: [
      { text: "Dejarlo pasar porque no quiere hacer daño 🙇‍♂️", isCorrect: false },
      { text: "Decirle que se detenga y buscar ayuda de un adulto 🛑", isCorrect: true },
      { text: "No decir nada para evitar problemas 🤐", isCorrect: false },
      { text: "Tratar de evadirlo sin hablar con nadie 🏃‍♀️", isCorrect: false }
    ]
  }
],


//preguntas para la seccion de mis emociones
    "Mis Emociones": [
  {
    question: "¿Qué es lo mejor que puedes hacer si tienes miedo o te sientes inseguro en alguna situación?",
    answers: [
      { text: "Mantener el miedo para ti mismo y no contarle a nadie 😞", isCorrect: false },
      { text: "Hablar con un adulto o un amigo de confianza sobre cómo te sientes 🗣️", isCorrect: true },
      { text: "Actuar como si no estuvieras asustado, aunque sí lo estés 😅", isCorrect: false },
      { text: "Evitar enfrentarlo y quedarte callado 😔", isCorrect: false }
    ]
  },
  {
    question: "Si te sientes triste porque algo te ha pasado y no sabes cómo expresarlo, ¿qué puedes hacer?",
    answers: [
      { text: "Callarme y no decir nada a nadie 🤐", isCorrect: false },
      { text: "Hablar con un amigo o un adulto de confianza para sentirte mejor 🗣️", isCorrect: true },
      { text: "Escribir lo que siento en un papel o en un diario 📝", isCorrect: true },
      { text: "Evitar hablar de lo que siento porque no es importante 🧠", isCorrect: false }
    ]
  },
  {
    question: "Si tienes rabia o frustración por algo que te ha pasado, ¿cómo puedes manejar esos sentimientos?",
    answers: [
      { text: "Guardar esos sentimientos para ti mismo y no hacer nada 🤐", isCorrect: false },
      { text: "Hablar con alguien de confianza sobre lo que te molesta 🗣️", isCorrect: true },
      { text: "Gritar o golpear cosas para liberar la rabia 😤", isCorrect: false },
      { text: "Hacer como si todo estuviera bien cuando no lo está 😞", isCorrect: false }
    ]
  }
]

  };
  
  export default questions;