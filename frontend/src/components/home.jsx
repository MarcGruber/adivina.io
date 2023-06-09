import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TriviaGame } from './game';


// const socket = io('http://192.168.85.36:3000'); // Establecer la conexión con el servidor de Socket.io
const socket = io('http://localhost:3000');
export function ChatRoom() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [joinRoom, setJointRoom] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [activeForm, setActiveForm] = useState('room');
  const [categoria, setCategoria] = useState('react');
  const [segundos, setSegundos] = useState(10);
  const [ranking, setRanking] = useState([]);
  const [listaUsers, setListaUsers] = useState('');
  const [anfitrion, setAnfitrion] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const [gameEnded, setGameEnded] = useState(false);
  const [viewForm, setViewForm] = useState(false)
  const [segundosRestantes, setSegundosRestantes] = useState(10);

  const handleFormUser = () => {
    setActiveForm('room');
  };

  const handleFormSala = () => {
    setActiveForm('user');
  };


  useEffect(() => {
    let intervalId;
    if (segundosRestantes > 0) {
      intervalId = setTimeout(() => {
        setSegundosRestantes(segundosRestantes - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [segundosRestantes]);


  useEffect(() => {

    socket.on('gameStarted', (boolean) => {
      setIsGameStarted(boolean);
    });

    socket.on('pregunta', (data) => {
      setCurrentQuestion(data.question);
      document.body.style.backgroundColor = "white"
      // pillamos segundos del setinterval del backend  y los dividmos para hacer el contador
      setSegundosRestantes((data.segundos / 1000))
    });
    socket.on('usuariosJugando', (listaUsuarios) => {
      setListaUsers(listaUsuarios)
    });

    socket.on('ranking', (sortedRanking) => {
      try {
        sortedRanking.sort((a, b) => {
          if (a[1].correctas === b[1].correctas) {
            return b[1].puntuacion - a[1].puntuacion;
          } else {
            return b[1].correctas - a[1].correctas;
          }
        });
        setRanking(sortedRanking);
        if (ranking.length > 0) console.log(ranking)
        setGameEnded(true)
      } catch (error) {
        console.log(error)
      }
    });

  }, []);


  const handleJoinRoom = (event) => {
    event.preventDefault();
    socket.emit('join', { username, room, segundos, categoria });
    setJointRoom(true)
  };
  socket.on('gameStarted', (boolean) => {
    setIsGameStarted(boolean);
    setShowMenu(false)
  });

  const handleStartGame = (event) => {
    event.preventDefault();
    if (username && room) {
      socket.emit('startGame', { room, username });
    } else {
      alert('Falta rellenar campos')
    }
  };
  const clearGame = () => {
    setIsGameStarted(!isGameStarted), setJointRoom(false), setViewForm(false),
      setShowMenu(true), setGameEnded(!gameEnded), setListaUsers('')
  }

  return (
    <>
      <div onClick={() => { location.reload() }} style={{ cursor: 'pointer' }}><h1>ADIVINA.<span style={{ color: 'orange' }}>IO</span></h1></div>

      <div className="btnsM">

        {showMenu ? (<>
          <button onClick={() => { setAnfitrion(true) }} className="ButtonM">Crear Sala</button>
          <button onClick={() => { setAnfitrion(false) }} className="ButtonM">Unirse a sala</button>
        </>) : ''}

      </div>
      <div className=" form form-container sign-up-container">

        {!(joinRoom || viewForm) ? (
          <>
            {anfitrion ? (<>
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
            </>) : ''}
            <form onSubmit={handleJoinRoom}>
              <label>
                Nombre de usuario:
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>
              <label>
                Sala:
                <input
                  type="text"
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                  required
                />
              </label>
              <button type="submit" onClick={handleFormUser}>
                {anfitrion ? 'Crear' : 'Unirse'}
              </button>
            </form>

          </>
        ) : null}

        {isGameStarted ? (
          <>
            {currentQuestion ? (
              <TriviaGame props={{ roomId: room, pregunta: currentQuestion, user: username }} />
            ) : null}
            {!gameEnded ? <h1>{segundosRestantes}</h1> : ''}
          </>
        ) : (
          <div >
            {(activeForm === 'room' && anfitrion) ? (
              <div onClick={handleFormSala}>
                <h2>Sala: {room}</h2>
                <button onClick={handleStartGame} className="secondButton">
                  Comenzar juego
                </button>
              </div>
            ) : null}
            <div className='usersGame'>
              {
                listaUsers ?
                  <>
                    <b><p>Usuarios en la sala</p></b>
                    <div className='nameDiv'>
                      <ul className='usuarios'>
                        {listaUsers.map((name) =>
                        (
                          <li>{name}</li>
                        ))}
                      </ul>

                    </div>

                  </>
                  : null
              }
            </div>
          </div>
        )}



      </div>




      {gameEnded ? (
        <>
          <button onClick={() => { clearGame() }} className="secondButton" >Reiniciar Juego</button>
          <table className='table' >
            <thead>
              <tr>
                <th>Posición</th>
                <th>Nombre de usuario</th>
                <th>Correctas</th>
                <th>Incorrectas</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((rank, index) =>
              (

                <tr key={index + rank.username}>
                  <td>{index + 1}</td>
                  <td>{rank[0]}</td>
                  <td>{rank[1].correctas}</td>
                  <td>{rank[1].incorrectas}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </>
      ) : null
      }
    </>
  );
}
