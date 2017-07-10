const express = require('express');
const app = express();
const Message = require('./schemas/message')

app.get('/', function(req, res) {
  Message.find({}, function(result) {
    res.send(result);
  });
});


app.listen('3001');

var testobject = {
  name: 'testobject',
  value: '1122'
}
