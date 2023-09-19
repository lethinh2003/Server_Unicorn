class SocketServices {
  connection(socket) {
    console.log("New client connected " + socket.id);
    console.log("ROOM ", _io.sockets.adapter.rooms);
    const { role } = _io;

    socket.on("disconnect", () => {
      console.log("Client disconnected ", socket.id);
    });
  }
}
module.exports = new SocketServices();
