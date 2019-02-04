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
  console.log("save drawing");
  var data = Object.keys(req.body)[0];
  saveDrawing(data, res);
});

app.post('/load', function(req, res) {
  console.log("get drawings");
  let data = getDrawings();
  if(data) res.json(data);
});

//TODO: save hash in localstorage and use it to optionally filter drawings
function saveDrawing(dataToSave, res) {
  let index = 0;
  let data = fs.readFileSync("public/drawings.json");
  let imgs = {};
  if(data.toString()) {
    imgs = JSON.parse(data);
    index = Object.keys(imgs).length;
  } 
    
  imgs[index] = dataToSave;
  let json = JSON.stringify(imgs, null, 2);
  fs.writeFile("public/drawings.json", json, finished);
  function finished() {
    console.log("saved to file");
    let data = getDrawings();
    res.json(data);
  }
  
}
//getDrawings();
function getDrawings() { 
  let data = fs.readFileSync("public/drawings.json");
  if(data.toString()) {
    let imgs = JSON.parse(data);
    return imgs;
  } else return null;
  
}
function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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
