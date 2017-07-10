const express = require('express');
const app = express();
const Model = require('./model')

var model =　new Model();

app.get('/', function(req, res) {
  model.getMessages().then(console.log(results));
  console.log();
  res.send(model.getMessages());
});


app.listen('3001');

var testobject = {
  name: 'testobject',
  value: '1122'
}
