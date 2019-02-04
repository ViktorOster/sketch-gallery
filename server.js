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
  if(data) res.send(data);
});

//TODO: save hash in localstorage and use it to optionally filter drawings
function saveDrawing(dataToSave, res) {
  fs.open('public/drawings.txt', 'a', 666, function( err, data ) {
   fs.write( data, dataToSave + "\n", null, 'utf8', function(){
    fs.close(data, function(){
     console.log('file is updated');
    });
   });
  });
}
//getDrawings();
function getDrawings() { 
  var data = fs.readFileSync("public/drawings.txt", "utf8");
  if(data){
    return data;
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
