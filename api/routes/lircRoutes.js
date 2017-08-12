'use strict';
module.exports = function(app) {
  var lircPi = require('../controllers/lircController');


  // todoList Routes
  app.route('/remote/powerOn')
    .post(lircPi.powerOn);

  app.route('/remote/powerOff')
	.post(lircPi.powerOff);