'use strict';

const executePython = require('../../executePython');
const AirConModel = require('../models/AirConModel')
const ResponseModel = require('../models/ResponseModel')

exports.powerOn = function(req, res) {
  console.log('Reached powerOn endpoint ' + req.body);
  var airConModel = new JSON.parse(req.body);
  executePython.execute(airConModel);
  res.json(new ResponseModel("", "Powered on aircon successfully!", ""));
};