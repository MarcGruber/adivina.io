import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import '../App.css'
import '../index.css'
const socket = io('http://localhost:3000')

export function TriviaGame(props) {
  const { roomId, pregunta, user } = props.props
  console.log(props.props)
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false) // Nuevo estado para indicar si la respuesta es correcta

  const handleOptionClick = (optionNumber, roomId, user) => {
    setIsLoading(true)
    console.log(roomId)
  
    socket.emit('respuesta', {optionNumber, roomId, user})
    setResponse('')
  }
  useEffect(()=>{
    setIsLoading(false)
    setResponse('')
  },[pregunta])

  useEffect(() => {
    socket.on('respuestaCorrecta', (respuesta) => {
      setIsLoading(false)
      setRespuestaCorrecta(respuesta) // Actualizar el estado con la respuesta correcta
    })
    
    const [puntajes, setPuntajes] = useState([]);

    useEffect(() => {
      // Escucha la actualización del ranking desde el servidor
      socket.on("ranking", (nuevoRanking) => {
        setPuntajes(nuevoRanking);
      });
  
      // Solicita el ranking al servidor
      socket.emit("solicitarRanking");
    }, []);
  

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
              <li><button onClick={() => handleOptionClick(0, roomId, user)}>{pregunta.opciones[0].opcion}</button></li>
              <li><button onClick={() => handleOptionClick(1, roomId, user)}>{pregunta.opciones[1].opcion}</button></li>
            </ul>
          </>
        }
        {isLoading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
        {respuestaCorrecta && <div>Respuesta correcta!</div>} {/* Mostrar el mensaje de respuesta correcta */}

        <div>
      <h1>Ranking</h1>
      <ul>
        {puntajes.map((puntaje, index) => (
          <li key={index}>
            {puntaje.usuario}: {puntaje.puntaje}
          </li>
        ))}
      </ul>
    </div>
      </>
    )
  } else {
    return (
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    )
  }
}
