import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000')

function App() {
  const [message, setMessage] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('name', message)
    setMessage('')
  }

  useEffect(()=>{
    const recieveVariable = variable => {
      console.log(variable)
    }
    socket.on('preguntes', recieveVariable)
    socket.on('usuarios', recieveVariable)

    return () => {
      socket.off('preguntes', recieveVariable)
      socket.on('usuarios', recieveVariable)
    }
  },[])

  return (
    <div className="App">
      <h1>ADIVINA.io</h1>

    <input type="text" value={message} name="" id="" onChange={ (e) => {setMessage(e.target.value)}} />
    <button onClick={handleSubmit}>send</button>

    </div>
  )
}

export default App
