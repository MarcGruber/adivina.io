import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import '../App.css'
import '../index.css'
import '../table.css'
// const socket = io('http://192.168.85.36:3000'); // Establecer la conexión con el servidor de Socket.io
const socket = io('http://localhost:3000');

export function TriviaGame(props) {
  const { roomId, pregunta, user } = props.props
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false) // Nuevo estado para indicar si la respuesta es correcta
  const [respuestaCorrectaClass, setRespuestaCorrectaClass] = useState('');
  const handleOptionClick = (optionNumber, roomId, user) => {
    setIsLoading(true)
    socket.emit('respuesta', { optionNumber, roomId, user })
    if (pregunta.opciones[optionNumber].correcta === true) {
     document.body.style.backgroundColor="#94E14E"
    
    } else {
      
      document.body.style.backgroundColor="#FF6243"
    }
    setResponse('')
  }
  useEffect(() => {
    setIsLoading(false)
    setResponse('')
  }, [pregunta])

  useEffect(() => {
    socket.on('respuestaCorrecta', (respuesta) => {
      setIsLoading(false)
      setRespuestaCorrecta(respuesta) // Actualizar el estado con la respuesta correcta
    })

    return () => {
      socket.off('respuestaCorrecta')
    }
  }, [])

  if (pregunta.pregunta) {
    return (
      <>
        {!isLoading &&
          <>
            <h2>{pregunta.pregunta}</h2>
            <ul>
              <li><button onClick={() => handleOptionClick(0, roomId, user)} className="secondButton">{pregunta.opciones[0].opcion}</button></li>
              <li><button onClick={() => handleOptionClick(1, roomId, user)} className="secondButton">{pregunta.opciones[1].opcion}</button></li>
            </ul>
          </>
        }
        {isLoading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
        {/* {respuestaCorrecta && <div>Respuesta correcta!</div>} Mostrar el mensaje de respuesta correcta */}
        {respuestaCorrecta && <div className="respuesta-correcta ">Respuesta correcta!</div>} {/* Mostrar el mensaje de respuesta correcta */}
        {!respuestaCorrecta && response && <div className="respuesta-incorrecta">Respuesta incorrecta</div>} {/* Mostrar el mensaje de respuesta incorrecta */}

      </>
    )
  } else {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
  }
}
