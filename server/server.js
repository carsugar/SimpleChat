const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('./client'));

io.on('connection', function(socket){
  console.log('A user has connected.');

  socket.on('message', function(msg){
    io.emit('message', msg);
  });

  socket.on('disconnect', function(){
    console.log('A user has disconnected.');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log('Server listening on port:', port));
