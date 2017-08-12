'use strict';

function AirCon(state, mode, temperature, fan, swing, powerful) {
	this.state = state;
	this.mode = mode;
	this.temperature = temperature;
	this.fan = fan;
	this.swing = swing;
	this.powerful = powerful;
}

module.exports = AirCon;