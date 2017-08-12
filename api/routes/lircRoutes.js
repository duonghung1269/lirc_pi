'use strict';
module.exports = function(app) {
  var lircPi = require('../controllers/lircController');


  // Routes
  app.route('/remote/powerOn')
    .post(lircPi.powerOn);

  app.route('/remote/powerOff')
	.post(lircPi.powerOff);

  app.route('/ping')
        .get(lircPi.ping);
}
