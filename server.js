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
  var data = req.body.value;
  saveDrawing(data, res);
});

app.post('/load', function(req, res) {
  console.log("get drawings");
  let data = getDrawings();
  if(data) res.json(data);
});

//TODO: save hash in localstorage and use it to optionally filter drawings
function saveDrawing(dataToSave, res) {
  fs.readFile('public/drawings.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    let obj = JSON.parse(data); //now it an object
    console.log("OBJECT", obj);
    obj["user1"].push(dataToSave);
    console.log("OBJECT", obj);
    let json = JSON.stringify(obj, null, 2); //convert it back to json
    fs.writeFile('public/drawings.json', json, 'utf8', done); // write it back 
      
    function done() {
      console.log("wrote to file"); 
    }
  }});
}
//getDrawings();
function getDrawings() { 
//   const data = fs.readFileSync("public/drawings.json");
  
//   if(data.toString() !== ""){
//     const words = JSON.parse(data);
//     console.log("got these drawings:", words);

//     return words;
//   } else return null;
  
  return null;
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
