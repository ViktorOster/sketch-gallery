// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

const fs = require("fs");

function saveDrawing(base64drawing) {
  fs.writeFile(".data/drawings.json", base64drawing, finished);
  function finished(err) {
    console.log("all set."); 
  }
}
getDrawings();
function getDrawings() {
  const data = fs.readFileSync(".data/drawings.json");
  const words = JSON.parse(data);
  console.log(words);
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
