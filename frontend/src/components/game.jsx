import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000')

export function TriviaGame(props) {
    const { roomId } = props
    const [response, setResponse] = useState('')
    const [pregunta, setPregunta] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleOptionClick = (optionNumber) => {
        setIsLoading(true)
        socket.emit('response', pregunta.opciones[optionNumber].opcion)
        setResponse('')
    }

    useEffect(() => {
        const recieveVariable = variable => {
            console.log(variable)
            setPregunta(variable)
            setIsLoading(false)
        }
        socket.on('pregunta', recieveVariable)

        const respuestaCorrecta = (respuesta) => {
            setIsLoading(false)
            if (respuesta) {
                alert('Respuesta correcta!')
            } else {
                alert('Respuesta incorrecta')
            }
        }

        socket.on('respuestaCorrecta', respuestaCorrecta)

        return () => {
            socket.off('pregunta', recieveVariable)
            socket.off('respuestaCorrecta', respuestaCorrecta)
        }
    }, [])

    let html = ''
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
            </>
        )
    } else {
        return (
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        )
    }
}
