const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB Atlas
mongoose.connect('your-mongodb-connection-string', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const buzzSchema = new mongoose.Schema({
    winningTeam: String
});
const Buzz = mongoose.model('Buzz', buzzSchema);

let buzzed = false;
let winningTeam = null;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('teamSelected', (team) => {
        console.log(`Team selected: ${team}`);
    });

    socket.on('buzz', (team) => {
        if (!buzzed) {
            buzzed = true;
            winningTeam = team;

            const newBuzz = new Buzz({ winningTeam });
            newBuzz.save();

            io.emit('buzzSuccess', winningTeam);
        }
    });

    socket.on('endBuzzing', () => {
        buzzed = false;
        winningTeam = null;
        io.emit('reset');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use(express.static('.'));

server.listen(3000, () => {
    console.log('Listening on *:3000');
});