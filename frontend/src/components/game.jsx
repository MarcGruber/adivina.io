import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000')

export function TriviaGame(props) {
    const {roomId} = props
    const [response, setResponse] = useState('')
    const [pregunta, setPregunta] = useState({})
    const handleSubmit = (e) => {
        e.preventDefault()
        socket.emit('response', response)
        setResponse('')
    }

    useEffect(() => {
        const recieveVariable = variable => {
            console.log(variable)
            setPregunta(variable)
        }
        socket.on('pregunta', recieveVariable)

        return () => {
            socket.off('pregunta', recieveVariable)
        }
    }, [])

    let html = ''
    if(pregunta.pregunta){
        return (
            <>
            <h2>{pregunta.pregunta}</h2>
            <ul>
                <li><button>{pregunta.opciones[0].opcion}</button></li>
                <li><button>{pregunta.opciones[1].opcion}</button></li>
            </ul>
            </> 
        )
    } else {
        return (
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        )
    }


}