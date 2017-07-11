const express = require('express');
const app = express();
const Model = require('./model');
const Message = require('./schemas/message');

var model = new Model();

app.get('/', function(req, res) {
  Message.find(function(err, result) {
    if (err) {
      throw err;
      return false;
    }
    res.send(result);
  });
});


app.listen('3001');

var testobject = {
  name: 'testobject',
  value: '1122'
}
