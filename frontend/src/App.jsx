import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TriviaGame } from './components/game';


// const socket = io('http://192.168.85.36:3000'); // Establecer la conexión con el servidor de Socket.io
const socket = io('http://localhost:3000');
function ChatRoom() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [activeForm, setActiveForm] = useState('room');
  const [categoria, setCategoria] = useState('react');
  const [segundos, setSegundos] = useState(10);
  const [ranking, setRanking] = useState([]);
  const [showRanking, setShowRanking] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);


  const handleFormUser = () => {
    setActiveForm('room');
  };

  const handleFormSala = () => {
    setActiveForm('user');
  };

  useEffect(() => {
    // Escuchar eventos del servidor
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('gameStarted', (boolean) => {
      setIsGameStarted(boolean);
    });

    socket.on('pregunta', (pregunta) => {
      setCurrentQuestion(pregunta);
    });
    
    socket.on('ranking', (sortedRanking) => {
      try {
        // Lógica para actualizar el ranking aquí
        // ...
        // Cuando se actualiza el ranking, se envía a los clientes
        console.log(sortedRanking);
        setRanking(sortedRanking);
        if (ranking.length > 0) console.log(ranking)
        setGameEnded(true)
      } catch (error) {
        console.log(error)
      }
    });
  
  }, []);

socket.on('gameStarted', (boolean) => {
      setIsGameStarted(boolean);
    });
  
  const handleJoinRoom = (event) => {
    event.preventDefault();
    console.log(room);
    socket.emit('join', { username, room, segundos, categoria });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    socket.emit('chatMessage', message);
    setMessage('');
  };
  const handleConfiguracion = () => {
    console.log(segundos, categoria)
    //socket.emit('configuracion', { secondsNew: seconds, categoriaNew: categoria, room: room });
  };
  const handleStartGame = (event) => {
    event.preventDefault();
    console.log(room);
    socket.emit('startGame', room);
  };

  const handleAnswerSubmit = (event) => {
    event.preventDefault();
    socket.emit('answer', { answer, room });
    setAnswer('');
  };





  return (
    <>
    <div className="form-container sign-up-container">
      {!isGameStarted ? (
        <>
          <label>
            Categoría:
            <select onChange={(e) => setCategoria(e.target.value)}>
              <option value="react">React</option>
              <option value="pokemon">Pokemon</option>
              <option value="barça">Barça</option>
            </select>
          </label>
          <label>
            Segundos entre preguntas
            <input defaultValue={segundos} type="number" name="" id=""
              onChange={(e) => setSegundos(e.target.value)}
            />
          </label>
          <form onSubmit={handleJoinRoom}>
            <label>
              Nombre de usuario:
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
            <label>
              Sala:
              <input
                type="text"
                value={room}
                onChange={(event) => setRoom(event.target.value)}
              />
            </label>
            <button type="submit" onClick={handleFormUser}>
              Unirse a la sala
            </button>
          </form>
        </>
      ) : null}

      {isGameStarted ? (
        <>
          {console.log('patata')}
          {currentQuestion ? (
            <TriviaGame props={{ roomId: room, pregunta: currentQuestion, user: username }} />
          ) : null}
        </>
      ) : (
        <div className="form-container sign-up-container">
          {activeForm === 'room' ? (
            <div onClick={handleFormSala}>
              <button onClick={handleStartGame}>Comenzar juego</button>
            </div>
          ) : null}
        </div>
      )}
      
      
    </div>
    {gameEnded ? (
      <table className='table' >
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nombre de usuario</th>
            <th>Puntos</th>
            <th>Correctas</th>
            <th>Incorrectas</th>
          </tr>
        </thead>
        <tbody>
          { ranking.map((rank, index) =>
          (

            <tr key={index + rank.username}>
              <td>{index + 1}</td>
              <td>{rank[0]}</td>
              <td>{rank[1].puntuacion}</td>
              <td>{rank[1].correctas}</td>
              <td>{rank[1].incorrectas}</td>
            </tr>
          )) }
        </tbody>
      </table>) : null}
            </>
  );
}
export default ChatRoom;