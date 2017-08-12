var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

console.log('lirc pi RESTful API server started on: ' + port);
