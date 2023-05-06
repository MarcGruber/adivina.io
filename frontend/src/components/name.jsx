import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import '../App.css'
import '../index.css'
// const socket = io('http://localhost:3000')
const socket = io('192.168.85.36:3000');


export function SendName() {
    const [message, setMessage] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        socket.emit('name', message)
        setMessage('')
    }

    useEffect(() => {
        const recieveVariable = variable => {
            console.log(variable)
        }
        socket.on('preguntes', recieveVariable)
        socket.on('usuarios', recieveVariable)

        return () => {
            socket.off('preguntes', recieveVariable)
            socket.on('usuarios', recieveVariable)
        }
    }, [])

    return (
        <>
            <input type="text" value={message} name="" id="" onChange={(e) => { setMessage(e.target.value) }} />
            <button onClick={handleSubmit}>send</button>
        </>
    )
}