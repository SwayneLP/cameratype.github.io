let font;
let font2;
let font3;
let font4;
let dotFont;
let points = [];
let xMouse;
let yMouse;
let fValue = 220;
let sValue = 0;
let sAlpha = 0;
let textSizeValue = 200;
let displayedText = "DSAA";

function preload() {
  font = loadFont('fonts/Antique-Olive-Std-Black.ttf');
  font2 = loadFont('fonts/Ballet-Regular-VariableFont_opsz.ttf');
  font3 = loadFont('fonts/JALLEAU.ttf');
  font4 = loadFont('fonts/ClashDisplay-Variable.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
    webcam = createCapture(VIDEO);
  webcam.size(1920, 1080);
  webcam.hide();
  const options = {
    flipHorizontal : true
  }
  handpose = ml5.handpose(webcam, options, modelLoaded);
  handpose.on("hand", (results) => {
    hands = results;
    // console.log(hands);
  })
  dotFont = font;
  updateText();
}

function updateText() {
  points = dotFont.textToPoints(displayedText, 0, 0, textSizeValue, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
}

function draw() {
  background(0);
  fill(fValue);
  stroke(sValue, sValue, sValue, sAlpha);

  xMouse = mouseX - width / 2;
  yMouse = mouseY - height / 2;

  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, xMouse * 0.1, yMouse * 0.1);
    if (keyIsPressed && keyCode === 32) {
      ellipse(points[i].x, points[i].y, xMouse * 0.1, xMouse * 0.1);
    }
  }
}

function mouseClicked() {
  if (fValue === 220) {
    fValue = 10;
  } else {
    fValue = 220;
  }

  if (sValue === 0) {
    sValue = 220;
  } else {
    sValue = 0;
  }

  if (sAlpha === 0) {
    sAlpha = 255;
  } else {
    sAlpha = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}