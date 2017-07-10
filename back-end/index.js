const express = require('express');
const app = express();
const Model = require('./model')

app.get('/', function(req, res) {
  res.send(testobject);
});


app.listen('3001');

var testobject = {
  name: 'testobject',
  value: '1122'
}
