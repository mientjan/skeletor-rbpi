// Connect to the socket
const socket = io();

// Function to send an instruction
function sendInstruction() {
    const instruction = document.getElementById('instruction').value;

    // Emit the instruction to the server
    socket.emit('instruction', instruction);

    console.log('Instruction sent:', instruction);
}

// Listen for instruction broadcasted by the server
socket.on('instruction', (data) => {
    console.log('Received instruction from server:', data);
});