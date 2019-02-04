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

app.post('/save', function(req, res) {
  console.log("saving drawing");
  var drawing = req.body.value;
  saveDrawing(drawing, res);
  
});
app.post('/load', function(req, res) {
  console.log("get drawings");
  let data = getDrawings();
  if(data) res.json(data);
});

//TODO: save hash in localstorage and use it to optionally filter drawings
function saveDrawing(data, res) {
  var asd = "drawing " + data;
  var dataJson = JSON.parse(asd);
  console.log("DATA JSON", dataJson);
  
  fs.writeFile("public/drawings.json", dataJson, finished);
    
  
  function finished() {
    console.log("saved"); 
  }

}
//getDrawings();
function getDrawings() {
  const data = fs.readFileSync("public/drawings.json");
  console.log("DATA", data);
  
  if(data.toString() !== ""){
    const words = JSON.parse(data);
    console.log("got these drawings:", words);

    return words;
  } else return null;
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
