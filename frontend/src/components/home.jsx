import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TriviaGame } from './game';

// const socket = io('http://192.168.85.36:3000'); // Establecer la conexión con el servidor de Socket.io
const socket = io('http://localhost:3000');
export function ChatRoom() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [ranking, setRanking] = useState([]);
  const [activeForm, setActiveForm] = useState('room');
  const [categoria, setCategoria] = useState('react');
  const [segundos, setSegundos] = useState(10);


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
        setRanking(sortedRanking);
        console.log(sortedRanking + 'ranking')

      } catch (error) {
        console.log(error)
      }
    });
  }, []);


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

          <button onClick={handleConfiguracion}>Guardar configuración</button>


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
      <div  className="form-container sign-up-container" >
      {isGameStarted ? (
        <>
          {currentQuestion ? (
            <TriviaGame props={{ roomId: room, pregunta: currentQuestion, user: username }} />
          ) : (
            <div>
              {activeForm === 'ranking'? (
                <div>
                  <h2>Ranking:</h2>
                  <ol>
                    {ranking.map((user, index) => (
                      <li key={index}>
                        {user.username} - {user.score}
                      </li>
                    ))}
                  </ol>
                </div>
              )  : null}
            </div>
          )}
        </>
     ) :({})}
     </div>
      </div>
      );
}
