'use strict';

const executePython = require('../../executePython');
const AirConModel = require('../models/airconModel');
const ResponseModel = require('../models/responseModel');

exports.powerOn = function(req, res) {
  console.log('Reached powerOn endpoint');
  console.log(req.body);
  console.log(req.body.mode);
  var airConModel = req.body;
  executePython.execute(airConModel);
  res.json(new ResponseModel("", "Powered on aircon successfully!", ""));
};

exports.powerOff = function(req, res) {
  console.log('Reached powerOff endpoint ' + req.body);
  var airConModel = req.body;
  executePython.execute(airConModel);
  res.json(new ResponseModel("", "Powered on aircon successfully!", ""));
};

exports.ping = function(req, res) {
  console.log('Reached ping');
  res.json({message: 'pong'});
};
