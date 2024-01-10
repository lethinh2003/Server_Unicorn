class SocketServices {
  connection(socket) {
    console.log("New client connected " + socket.id);
    console.log("ROOM ", global._io.sockets.adapter.rooms);
    const { role } = global._io;

    socket.on("disconnect", () => {
      console.log("Client disconnected ", socket.id);
    });
  }
}
module.exports = new SocketServices();
