let webcam;
let handpose;
let hands = [];
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
let textSizeValue = "400vw";
let displayedText = "DSAA";

function preload() {
  font = loadFont('fonts/Antique-Olive-Std-Black.ttf');
  font2 = loadFont('fonts/Ballet-Regular-VariableFont_opsz.ttf');
  font3 = loadFont('fonts/JALLEAU.ttf');
  font4 = loadFont('fonts/ClashDisplay-Variable.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  webcam = createCapture(VIDEO);
  webcam.size(640, 480);
  webcam.position((width - webcam.width) / 2, (height - webcam.height) / 2);
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
  
  textAlign(CENTER, CENTER);
  textSize(parseInt(textSizeValue));
  points = dotFont.textToPoints(displayedText, width/2 - textWidth(displayedText)/2, height/2 + parseInt(textSizeValue)/3, parseInt(textSizeValue), {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
}

function modelLoaded(){
  console.log("model is ready")
}

function draw() {
  background(0);
  const offsetX = (width - webcam.width) / 2;
  const offsetY = (height - webcam.height) / 2;
  

  fill(0);
  stroke(255);


  let ellipseSizeX = 20;
  let ellipseSizeY = 20;

  for(let i = 0; i < hands.length; i++){
    const hand = hands[i];
    
    const thumbX = hand.landmarks[4][0];
    const thumbY = hand.landmarks[4][1];
    const indexFingerX = hand.landmarks[8][0];
    const indexFingerY = hand.landmarks[8][1];

    d = dist(thumbX, thumbY, indexFingerX, indexFingerY);
    if (d < 30) {
      dotFont = font3;
    } else {
      dotFont = font;
    }
  }    

  if (hands.length > 0) {
    const indexFingerX = hands[0].landmarks[8][0];
    const indexFingerY = hands[0].landmarks[8][1];

    ellipseSizeX = map(indexFingerX, 0, webcam.width, 4, 200, true);
    ellipseSizeY = map(indexFingerY, 0, webcam.height, 4, 200, true);
  }

  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, ellipseSizeX, ellipseSizeY);
  }

  updateText();
  drawKeyPoints(offsetX, offsetY);
}

function drawKeyPoints(offsetX, offsetY){
  stroke(255);
  fill(0, 255, 38);
  strokeWeight(2);
  
  for(let i = 0; i < hands.length; i++){
    const hand = hands[i];
    
    const thumbX = hand.landmarks[4][0];
    const thumbY = hand.landmarks[4][1];
    const indexFingerX = hand.landmarks[8][0];
    const indexFingerY = hand.landmarks[8][1];
    
    const drawThumbX = thumbX + offsetX;
    const drawThumbY = thumbY + offsetY;
    const drawIndexFingerX = indexFingerX + offsetX;
    const drawIndexFingerY = indexFingerY + offsetY;

    d = dist(thumbX, thumbY, indexFingerX, indexFingerY);
    textSize(d);
    
     counter = floor(d);
      if(counter > 0 && counter <30){
      } else if(counter > 31 && counter <50){
      } else if(counter > 51 && counter < 70){
      } else if(counter > 71 && counter < 90){
      } else {
      }
    
    ellipse(drawThumbX, drawThumbY, 10);
    ellipse(drawIndexFingerX, drawIndexFingerY, 10);
    
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}