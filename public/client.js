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
var touchPos = { x: 0, y: 0 };
var paintSettings = {
  color: "green",
  lineWidth: 10
  
}

canvasShapes.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
    touchPos.x = e.touches[0].clientX - this.getBoundingClientRect().left;
    touchPos.y = e.touches[0].clientY - this.getBoundingClientRect().top;
  },
  false
);

canvasShapes.addEventListener(
  "mousemove",
  function(e) {
    mouse.x = e.pageX - this.getBoundingClientRect().left;
    mouse.y = e.pageY - this.getBoundingClientRect().top;
    // console.log(this.getBoundingClientRect().top);
    // console.log(this.offsetTop);
  
    myCursor.style.left = (e.pageX -2 - (ctx.lineWidth / 2) ) + "px";
    myCursor.style.top = ((e.pageY + 4 -(ctx.lineWidth / 2) ) - this.offsetTop)+ "px"; //this is weird, because of fixed position

    // myCursor.style.width = ctx.lineWidth + "px";
    // myCursor.style.height = ctx.lineWidth + "px";
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
  paintSettings.lineWidth = val2;
};

let toolButtons = [];
toolButtons.push(document.getElementById("box1"));
toolButtons.push(document.getElementById("box2"));
toolButtons.push(document.getElementById("box3"));
toolButtons.push(document.getElementById("box4"));

document.querySelector("#clear").addEventListener("click", function() {
  ctxShapes.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

for (let x in toolButtons) {
  toolButtons[x].addEventListener("click", handleToolButtons);
}

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
  paintSettings.color = event.target.value;
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

var isTouching = false;
canvasShapes.addEventListener("touchstart", function(e) {
  isTouching= true;
  if (chosenTool[1] == true || chosenTool[3] == true) {
    ctx.moveTo(touchPos.x, touchPos.y);
    ctxShapes.moveTo(touchPos.x, touchPos.y);
    ctx.beginPath();
    ctxShapes.beginPath();

    canvasShapes.addEventListener("touchmove", onPaintTouch, false);
  }
});

canvasShapes.addEventListener(
  "touchend",
  function() {
    canvasShapes.removeEventListener("touchmove", onPaintTouch, false);
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
      ctx.moveTo(mouse.x, mouse.y);
      ctxShapes.moveTo(mouse.x, mouse.y);
      ctx.beginPath();
      ctxShapes.beginPath();

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
var onPaintTouch = function() {
  ctx.lineTo(touchPos.x, touchPos.y);
  ctx.stroke();
  ctxShapes.lineTo(touchPos.x, touchPos.y);
  ctxShapes.stroke();
};

let drawingsPage = document.querySelector("#drawings-page");
let drawPage = document.querySelector("#draw-page");
let gallery = document.querySelector("#gallery");
let buttonWall = document.querySelector("#button-wall");
let buttonDraw = document.querySelector("#button-draw");

buttonWall.addEventListener("click", function() {
  // drawingsPage.style.display = "inline";
  // drawPage.style.display ="none";
  drawPage.className += " hide";
  drawingsPage.classList.remove("hide");
  this.className = "selected";
  buttonDraw.classList.remove("selected");
});
buttonDraw.addEventListener("click", function() {
  // drawPage.style.display ="inline";
  // drawingsPage.style.display ="none";
  drawingsPage.className += " hide";
  drawPage.classList.remove("hide");
  this.className = "selected";
  buttonWall.classList.remove("selected");
});

document.querySelector("#button-add-drawing").addEventListener("click", function() {
 putImage();
});

let imagesData = [];
function putImage() {
  //save dataUrl in flat file system???
  let myImage = canvas.toDataURL("image/png");  
  imagesData.push(myImage);
  sendToServer(myImage);
}  

window.onload = function () {
  //get the stored images from file and display them 
  loadImages();
}

function loadImages() {
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", reqListener);
  xhr.open('POST', '/load', true);
  xhr.send();

  function reqListener () {

    var root = document.getElementById("gallery");
    let obj = JSON.parse(this.response);
    if(obj) {
      for (let key in obj) {
        let imgData = obj[key].data.toString();
        let img = document.createElement("img");
        let heightRatio = obj[key].height/obj[key].width;
        let maxWidth = 500;
        let height = maxWidth * heightRatio;
        img.classList.add('drawing');
        img.style.width = maxWidth + "px";
        img.style.height = height + "px";
        img.style.background = "white";
        img.src = imgData;
        gallery.appendChild(img);
      }
    }
    
  }
}

function sendToServer(base64drawing)
{
  console.log("calling server");
  
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", reqListener);
  xhr.open('POST', '/save', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ data: base64drawing, width: canvas.width, height: canvas.height }));
  function reqListener () {
    //console.log("response from server", this.response);
    var root = document.getElementById("gallery");
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
    
    let obj = JSON.parse(this.response);
    if(obj) {
      for (var key in obj) {
        let imgData = obj[key].data.toString();
        let img = document.createElement("img");
        let heightRatio = obj[key].height/obj[key].width;
        let maxWidth = 500;
        let height = maxWidth * heightRatio;
        img.style.width = maxWidth + "px";
        img.style.height = height + "px";
        img.style.background = "white";
        img.style.margin = "10px";
        img.style.border ="1px solid black";
        img.src = imgData;
        gallery.appendChild(img);
      }
    }
  } 
}

window.onresize = function(event) {
  console.log("resize");
  //let myImage = canvas.toDataURL("image/png");  
  canvas.width = parseInt(paint_style.getPropertyValue("width"));
  canvas.height = parseInt(paint_style.getPropertyValue("height"));
  canvasShapes.width = canvas.width;
  canvasShapes.height = canvas.height;
  ctx.lineWidth = paintSettings.lineWidth;
  ctxShapes.lineWidth = ctx.lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctxShapes.lineJoin = "round";
  ctxShapes.lineCap = "round";
  ctx.strokeStyle = paintSettings.color;
  ctxShapes.strokeStyle = ctx.strokeStyle;
  
};