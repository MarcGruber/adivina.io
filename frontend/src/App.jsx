import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'
import { TriviaGame } from './components/game'

const socket = io('http://localhost:3000')

function App() {
  const [room, setRoom] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  const createRoom = () => {
    socket.emit('createRoom', (roomId) => {
      setRoom(roomId);

    });
  };
  socket.on('gameStarted', () => {
    setGameStarted(true)
  });
  const joinRoom = (roomId, username) => {
    socket.emit('joinRoom', roomId, username, (success) => {
      if (success) {
        setRoom(roomId);
        setJoiningRoom(false);
      } else {
        alert('No se pudo unir a la sala');
      }
    });
  };


  const startGame = () => {
    console.log(room)
    socket.emit('startGame', room);
    setGameStarted(true);
  };

  return (
    <div className="App">
      <h1>ADIVINA.io</h1>
      {!room && !joiningRoom && (
        <>
          <button onClick={createRoom}>Crear sala</button>
          <button onClick={() => setJoiningRoom(true)}>Unirse a sala</button>
        </>
      )}
      {joiningRoom && (
        <JoinRoom onJoin={joinRoom} />
      )}
      {room && !joiningRoom && !gameStarted &&  (
        <>
          <h2>ID de la sala: {room}</h2>
          <button onClick={startGame}>Empezar juego</button>
        </>
      )}
      {gameStarted && (
        <>
          <h3>Juego Empezado</h3>
          <TriviaGame roomId={room} />
        </>
      )}
    </div>
  );
}

function JoinRoom(props) {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoinRoom = () => {
    props.onJoin(roomId, username);
  };

  return (
    <div>
      <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="ID de la sala" />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tu nombre" />
      <button onClick={handleJoinRoom}>Unirse a sala</button>
    </div>
  );
}


export default App
