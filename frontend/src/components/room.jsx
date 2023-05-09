import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import '../App.css'
import '../index.css'
import '../table.css'
// const socket = io('http://192.168.85.36:3000'); // Establecer la conexión con el servidor de Socket.io
const socket = io('http://localhost:3000');

export function createRoom(anfitrion) {

    const handleJoinRoom = (event) => {
        event.preventDefault();
        console.log(room);
        socket.emit('join', { username, room, segundos, categoria });
        setJointRoom(true)
    };

    return (
        <>

            {anfitrion ? (
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
                            Crear a la sala
                        </button>
                    </form>

                </>
            ) :
                <>
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
            }
        </>
    )
}

