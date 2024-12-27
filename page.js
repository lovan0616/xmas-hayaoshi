const socket = io();
let team = null;

function selectTeam(selectedTeam) {
    team = selectedTeam;
    socket.emit('teamSelected', team);
    document.getElementById('selection-stage').classList.add('hidden');
    document.getElementById('buzzer-stage').classList.remove('hidden');
}

function sendBuzz() {
    socket.emit('buzz', team);
}

function endBuzzing() {
    socket.emit('endBuzzing');
}

socket.on('buzzSuccess', (winningTeam) => {
    document.getElementById('buzzer-stage').classList.add('hidden');
    document.getElementById('success-stage').classList.remove('hidden');
    document.getElementById('success-message').textContent = `Success! Team ${winningTeam} buzzed first.`;

    if (team === winningTeam) {
        document.getElementById('end-button').classList.remove('hidden');
        new Audio('https://upcdn.io/FW25cL5/raw/time.mp3').play();
    } else {
        document.getElementById('buzzer-button').disabled = true;
    }
});

socket.on('reset', () => {
    document.getElementById('success-stage').classList.add('hidden');
    document.getElementById('buzzer-stage').classList.remove('hidden');
    document.getElementById('buzzer-button').disabled = false;
    document.getElementById('end-button').classList.add('hidden');
});