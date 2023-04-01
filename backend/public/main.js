const socket = io();

// Crear sala
document.getElementById("createRoom").addEventListener("click", () => {
  socket.emit("createRoom");
});

socket.on("roomCreated", (data) => {
  const roomId = data.roomId;
  console.log("Room created:", roomId);
});

// Unirse a sala
document.getElementById("joinRoom").addEventListener("click", () => {
  const roomId = prompt("Enter room ID:");
  socket.emit("joinRoom", { roomId });
});

socket.on("roomJoined", (data) => {
  const roomId = data.roomId;
  console.log("Joined room:", roomId);
});

socket.on("roomError", (data) => {
  const message = data.message;
  alert(message);
});

// Agregar pregunta
document.getElementById("addQuestion").addEventListener("click", () => {
  const roomId = prompt("Enter room ID:");
  const question = prompt("Enter question:");
  socket.emit("addQuestion", { roomId, question });
});

socket.on("questionAdded", (data) => {
  const question = data.question;
  console.log("Question added:", question);
});
