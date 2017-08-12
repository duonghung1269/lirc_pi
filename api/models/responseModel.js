'use strict';

function ResponseModel(errorMessage, message, data) {
	this.errorMessage = errorMessage;
	this.message = message;
	this.data = data;
}

module.exports = ResponseModel;