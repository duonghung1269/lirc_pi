#!/usr/bin/env node

// The path to your python script
const myPythonScript = "irsender.py";
// Provide the path of the python executable, if python is available as environment variable then you can use only "python"
const pythonExecutable = "python";
const lirc_encode = require('./lirc_encode');
const spawn = require('child_process').spawn;

// Function to convert an Uint8Array to a string
function uint8arrayToString(data){
    return String.fromCharCode.apply(null, data);
};

function execute(airConModel) {
	var states = lirc_encode.generateStates(airConModel.powerState, airConModel.mode, airConModel.temperature, 
								airConModel.fan, airConModel.swing, airConModel.powerful);
	var firstPart = lirc_encode.getFirstPartBinaryString(states);
	var secondPart = lirc_encode.getSecondPartBinaryString(states);
	

	const scriptExecution = spawn(pythonExecutable, [myPythonScript, "-cs", firstPart, "-cm", secondPart]);

	// Handle normal output
	scriptExecution.stdout.on('data', (data) => {
	    console.log(uint8arrayToString(data));
	});

	// Handle error output
	scriptExecution.stderr.on('data', (data) => {
	    // As said before, convert the Uint8Array to a readable string.
	    console.log(uint8arrayToString(data));
	});

	scriptExecution.on('exit', (code) => {
	    console.log("Process quit with code : " + code);
	});
}

module.exports = {
	execute
}
