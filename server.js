var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser'),
  routes = require('./api/routes/lircRoutes'),
  firebaseHandler = require('./api/firebase/firebaseEventHandler')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(function(req, res) {
//  res.status(404).send({url: req.originalUrl + ' not found'})
//});

routes(app);

firebaseHandler.startListenEvent();
//firebaseHandler.listenValueChanged();

app.listen(port);

console.log('lirc pi RESTful API server started on: ' + port);
