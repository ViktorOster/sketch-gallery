var chosenTool = [false, true, false, false];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasShapes = document.getElementById("canvasShapes");
var ctxShapes = canvasShapes.getContext("2d");

var colorPicker = document.getElementById("colorPicker");
var shapeStart = { x: 0, y: 0 };
var isMouseHeld = false;
var isCreatingTextElement = false;
var textElement;
var sizeFont = "16px";
var fontType = "Arial";
var backgroundColor = document.getElementById("box1").style.background;
var highlightColor = "#ffffff";

var painting = document.getElementById("paint");
var paint_style = getComputedStyle(painting);
canvas.width = parseInt(paint_style.getPropertyValue("width"));
canvas.height = parseInt(paint_style.getPropertyValue("height"));
canvasShapes.width = canvas.width;
canvasShapes.height = canvas.height;
var myCursor = document.getElementById("cursor");

var mouse = { x: 0, y: 0 };

var toolButtons = [];
toolButtons.push(document.getElementById("box1"));
toolButtons.push(document.getElementById("box2"));
toolButtons.push(document.getElementById("box3"));
toolButtons.push(document.getElementById("box4"));

//for undo/redo
// var cPushArray = new Array();
// var cStep = -1;
// //undo redo doesnt work yet
// function cPush() {
//   console.log("PUSHED");
//   cStep++;
//   if (cStep < cPushArray.length) {
//     cPushArray.length = cStep;
//   }
//   var image = document.getElementById("canvas").toDataURL();
//   cPushArray.push(image);
// }
// function cUndo() {
//   if (cStep > 0) {
//     cStep--;
//     var canvasPic = new Image();
//     // canvasPic.src = cPushArray[cStep];
//     canvasPic.src = "https://i.stack.imgur.com/kS9Kf.png";
//     canvasPic.onload = function() {
//       console.log("UNDO");
//       ctx.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
//       ctxShapes.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
//     };
//   }
// }
// function cRedo() {
//   if (cStep < cPushArray.length - 1) {
//     cStep++;
//     var canvasPic = new Image();
//     canvasPic.src = cPushArray[cStep];
//     canvasPic.onload = function() {
//       console.log("REDO");
//       ctx.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
//       ctxShapes.drawImage(canvasPic, 0, 0, canvas.width, canvas.height);
//     };
//   }
// }

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
 });
}
 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', false); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

canvasShapes.addEventListener(
  "mousemove",
  function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    // myCursor.style.left = (mouse.x + 68).toString() + "px";
    // myCursor.style.top = (mouse.y + 30).toString() + "px";
    myCursor.style.left = e.pageX - 2 - ctx.lineWidth / 2 + "px";
    myCursor.style.top = e.pageY - 2 - ctx.lineWidth / 2 + "px";

    myCursor.style.width = ctx.lineWidth + "px";
    myCursor.style.height = ctx.lineWidth + "px";
  },
  false
);
canvasShapes.addEventListener(
  "mouseenter",
  function(e) {
    myCursor.style.visibility = "visible";
  },
  false
);
canvasShapes.addEventListener(
  "mouseout",
  function(e) {
    myCursor.style.visibility = "hidden";
  },
  false
);

ctx.lineWidth = 10;
ctxShapes.lineWidth = ctx.lineWidth;
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctxShapes.lineJoin = "round";
ctxShapes.lineCap = "round";
var val = "#00ff00";
ctx.strokeStyle = val;
ctxShapes.strokeStyle = val;

document.getElementById("myRange").oninput = function() {
  var val2 = document.getElementById("myRange").value; //gets the oninput value
  ctx.lineWidth = val2;
  ctxShapes.lineWidth = val2;
};

window.onload = function() {
  for (var x in toolButtons) {
    toolButtons[x].addEventListener("click", handleToolButtons);
  }
};
function handleToolButtons() {
  for (var x in chosenTool) {
    if (x == parseInt(this.id.substring(3)) - 1) {
      chosenTool[x] = true;
      toolButtons[x].className += " button-selected";
    } else {
      chosenTool[x] = false;
      toolButtons[x].classList.remove("button-selected");
    }
  }
  if (this.id == "box4") {
    ctxShapes.strokeStyle = "white";
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = val;
    ctxShapes.strokeStyle = val;
  }
  if (document.body.contains(textElement)) painting.removeChild(textElement);
}

colorPicker.addEventListener("change", watchColorPicker, false);
function watchColorPicker(event) {
  ctx.strokeStyle = event.target.value;
  ctxShapes.strokeStyle = event.target.value;
  val = event.target.value;
}
var mouseMoveListener = function() {
  // document.removeEventListener('mousemove', mouseMoveListener, false);
  if ((chosenTool[0] == true || chosenTool[2] == true) && isMouseHeld) {
    // clear the canvas
    ctxShapes.clearRect(0, 0, canvas.width, canvas.height);

    var width = mouse.x - shapeStart.x;
    var height = mouse.y - shapeStart.y;
    var temp1 = ctxShapes.lineWidth;
    var temp2 = ctx.strokeStyle;
    if (isCreatingTextElement) {
      ctxShapes.lineWidth = 1;

      ctxShapes.strokeStyle = "#000000";
    }
    ctxShapes.strokeRect(shapeStart.x, shapeStart.y, width, height);
    ctxShapes.lineWidth = temp1;
    ctxShapes.strokeStyle = temp2;
  }
};

document.addEventListener("mousemove", mouseMoveListener, false);

canvasShapes.addEventListener(
  "mouseup",
  function(e) {
    if (chosenTool[0] == true) {
      ctx.strokeRect(
        shapeStart.x,
        shapeStart.y,
        mouse.x - shapeStart.x,
        mouse.y - shapeStart.y
      );
    }
    if (isCreatingTextElement) {
      ctxShapes.clearRect(0, 0, canvas.width, canvas.height);
      textElement = document.createElement("textarea");
      // textElement.type = "textarea";
      textElement.style.position = "relative";
      textElement.style.left = shapeStart.x + "px";
      textElement.style.top = shapeStart.y + "px";
      textElement.style.fontFamily = fontType;
      textElement.style.fontSize = sizeFont;
      textElement.style.lineHeight = sizeFont;
      textElement.style.opacity = "0.5";
      var width = mouse.x - shapeStart.x;
      var height = mouse.y - shapeStart.y;
      textElement.style.height = height + "px";
      textElement.style.width = width + "px";

      painting.appendChild(textElement);
      isCreatingTextElement = false;
    }
    isMouseHeld = false;
  },
  false
);

canvasShapes.addEventListener(
  "mousedown",
  function(e) {
    isMouseHeld = true;
    if (chosenTool[0] == true) {
      shapeStart.x = mouse.x;
      shapeStart.y = mouse.y;
      drawShapePreview();
    }

    if (chosenTool[1] == true || chosenTool[3] == true) {
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctxShapes.beginPath();
      ctxShapes.moveTo(mouse.x, mouse.y);

      canvasShapes.addEventListener("mousemove", onPaint, false);
    }
    if (chosenTool[2] == true) {
      isCreatingTextElement = true;
      shapeStart.x = mouse.x;
      shapeStart.y = mouse.y;
      if (document.body.contains(textElement)) {
        ctx.font = sizeFont + " " + fontType;
        ctx.font.lineHeight = "0";
        var leftPos =
          parseInt(
            textElement.style.left.substring(
              0,
              textElement.style.left.length - 2
            )
          ) + 1;
        var topPos =
          parseInt(
            textElement.style.top.substring(0, textElement.style.top.length - 2)
          ) - 2;
        var lines = textElement.value.split("\n");
        var offset = parseInt(sizeFont.substring(0, sizeFont.length - 2));

        for (var i = 0; i < lines.length; i++)
          // ctx.fillText(lines[i], leftPos, topPos + (i*parseInt(sizeFont.substring(0, sizeFont.length - 2))) );
          ctx.fillText(
            lines[i],
            leftPos,
            topPos +
              offset +
              i * parseInt(sizeFont.substring(0, sizeFont.length - 2))
          );

        painting.removeChild(textElement);
      }
    }
  },
  false
);
function drawShapePreview() {
  if (isMouseHeld && chosenTool[0] == true) {
    ctxShapes.strokeRect(
      shapeStart.x,
      shapeStart.y,
      mouse.x - shapeStart.x,
      mouse.y - shapeStart.y
    );
    setTimeout("drawShapePreview()", 1);
  } else return;
}

canvasShapes.addEventListener(
  "mouseup",
  function() {
    canvasShapes.removeEventListener("mousemove", onPaint, false);
    //cPush();
  },
  false
);

var onPaint = function() {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
  ctxShapes.lineTo(mouse.x, mouse.y);
  ctxShapes.stroke();
};
let drawingsPage = document.querySelector("#drawings-page");
let drawPage = document.querySelector("#draw-page");
let gallery = document.querySelector("#gallery");

document.querySelector("#button-wall").addEventListener("click", function() {
  drawingsPage.style.display = "inline";
  drawPage.style.display ="none";
});
document.querySelector("#button-draw").addEventListener("click", function() {
  drawPage.style.display ="inline";
  drawingsPage.style.display ="none";
});

document.querySelector("#button-add-drawing").addEventListener("click", function() {
  //save drawing and create div with drawing and add it to drawings page with addelement

  putImage();
});
document.querySelector("#button-clear-drawing").addEventListener("click", function() {
  ctxShapes.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
});
let imagesData = [];
function putImage() {
  //save dataUrl in flat file system???
  let myImage = canvas.toDataURL("image/png");  
  imagesData.push(myImage);
  console.log(myImage);
  // let img = document.createElement("img");
  // img.style.width = "266px";
  // img.style.height = "175px";
  // img.style.background = "white";
  // img.style.margin = "10px";
  // img.style.border ="1px solid black";
  // img.src = myImage;
  //gallery.appendChild(img);
  sendToServer(myImage);
}  

window.onload = function () {
  //get the stored images from file and display them 
}
function sendToServer(base64drawing)
{
  console.log("calling server");
  var data = {value: base64drawing}
  console.log(data);
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", reqListener);
  xhr.open('POST', '/', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify(data));

  function reqListener () {
    console.log("response from server");
    var root = document.getElementById("gallery");
    
    var res = JSON.parse(this.response);
    console.log("RESPONSE", res);
    Object.keys(res).forEach(function(key) {

    let img = document.createElement("img");
    img.style.width = "266px";
    img.style.height = "175px";
    img.style.background = "white";
    img.style.margin = "10px";
    img.style.border ="1px solid black";
    img.src = res[key];


    gallery.appendChild(img);

    });
 
//     let img = document.createElement("img");
//     img.style.width = "266px";
//     img.style.height = "175px";
//     img.style.background = "white";
//     img.style.margin = "10px";
//     img.style.border ="1px solid black";
//     console.log("ADD SRC", obj[prop]);
//     img.src = obj[prop];


//     gallery.appendChild(img);
     
    
    
    
  }
    
}