import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import '../App.css'
import '../index.css'
const socket = io('http://localhost:3000')

export function TriviaGame(props) {
  const { roomId, pregunta } = props.props
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false) // Nuevo estado para indicar si la respuesta es correcta

  const handleOptionClick = (optionNumber) => {
    setIsLoading(true)
    socket.emit('response', pregunta.opciones[optionNumber].opcion)
    setResponse('')
  }

  useEffect(()=>{
    setIsLoading(false)
  },[pregunta])

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
              <li><button onClick={() => handleOptionClick(0)}>{pregunta.opciones[0].opcion}</button></li>
              <li><button onClick={() => handleOptionClick(1)}>{pregunta.opciones[1].opcion}</button></li>
            </ul>
          </>
        }
        {isLoading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
        {respuestaCorrecta && <div>Respuesta correcta!</div>} {/* Mostrar el mensaje de respuesta correcta */}
      </>
    )
  } else {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
  }
}
