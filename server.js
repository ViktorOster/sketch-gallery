// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const fs = require("fs");
const rp = require('request-promise');
const bodyParser = require('body-parser');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/', function(req, res) {
  console.log("saving drawing");
  console.log("heres what i got", req.body.value);
  var drawing = req.body.value;
  saveDrawing(drawing, res);
  
  
});

//TODO: save hash in localstorage and use it to optionally filter drawings
function saveDrawing(data, res) {
  fs.writeFile(".data/drawings.json", data, finished);
  function finished(err) {
    console.log("saved.");
    var drawings = getDrawings();
    res.json(drawings);
  }
}
//getDrawings();
function getDrawings() {
  const data = fs.readFileSync(".data/drawings.json");
  const words = JSON.parse(data);
  console.log("got these drawings:", words);
}


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
