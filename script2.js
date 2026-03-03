let webcam;
let handpose;
let hands = [];
let font;
let dotFont;
let points = [];
let textSizeValue = "400vw";
let displayedText = "DSAA";
let smoothEllipseSizeX = 20;
let smoothEllipseSizeY = 20;
let smoothedThumbPositions = [];
let smoothedIndexPositions = [];
let lastTextKey = "";

function preload() {
  font = loadFont('fonts/FAUNE-DISPLAYBOLDITALIC.OTF');
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
  const size = parseInt(textSizeValue);
  const currentTextKey = `${displayedText}-${size}-${width}-${height}`;
  if (currentTextKey === lastTextKey) {
    return;
  }

  textAlign(CENTER, CENTER);
  textSize(size);
  points = dotFont.textToPoints(displayedText, width / 2 - textWidth(displayedText) / 2, height / 2 + size / 3, size, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
  lastTextKey = currentTextKey;
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

  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    
    const thumbX = hand.landmarks[4][0];
    const thumbY = hand.landmarks[4][1];
    const indexFingerX = hand.landmarks[8][0];
    const indexFingerY = hand.landmarks[8][1];

    const dx = thumbX - indexFingerX;
    const dy = thumbY - indexFingerY;
    const pinchDistSq = dx * dx + dy * dy;
    if (pinchDistSq < 900) {
      fill (255);
      stroke (255);
    } else {
      fill (0);
      stroke (255);
    }
  }    

  if (hands.length > 0) {
    const indexFingerX = hands[0].landmarks[8][0];
    const indexFingerY = hands[0].landmarks[8][1];

    ellipseSizeX = map(indexFingerX, webcam.width / 2, webcam.width, 4, 200, false);
    ellipseSizeY = map(indexFingerY, webcam.height / 2, webcam.height, 4, 200, false);
  }

  smoothEllipseSizeX = lerp(smoothEllipseSizeX, ellipseSizeX, 0.2);
  smoothEllipseSizeY = lerp(smoothEllipseSizeY, ellipseSizeY, 0.2);

  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, smoothEllipseSizeX, smoothEllipseSizeY);
  }

  fill(0, 255, 38);
  stroke(0, 255, 38);
  strokeWeight(2);
  drawKeyPoints(offsetX, offsetY);
}

function drawKeyPoints(offsetX, offsetY){
  
  if (smoothedThumbPositions.length > hands.length) {
    smoothedThumbPositions = smoothedThumbPositions.slice(0, hands.length);
    smoothedIndexPositions = smoothedIndexPositions.slice(0, hands.length);
  }
  
  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];
    
    const thumbX = hand.landmarks[4][0];
    const thumbY = hand.landmarks[4][1];
    const indexFingerX = hand.landmarks[8][0];
    const indexFingerY = hand.landmarks[8][1];
    
    const drawThumbX = thumbX + offsetX;
    const drawThumbY = thumbY + offsetY;
    const drawIndexFingerX = indexFingerX + offsetX;
    const drawIndexFingerY = indexFingerY + offsetY;

    if (!smoothedThumbPositions[i]) {
      smoothedThumbPositions[i] = { x: drawThumbX, y: drawThumbY };
      smoothedIndexPositions[i] = { x: drawIndexFingerX, y: drawIndexFingerY };
    } else {
      smoothedThumbPositions[i].x = lerp(smoothedThumbPositions[i].x, drawThumbX, 0.25);
      smoothedThumbPositions[i].y = lerp(smoothedThumbPositions[i].y, drawThumbY, 0.25);
      smoothedIndexPositions[i].x = lerp(smoothedIndexPositions[i].x, drawIndexFingerX, 0.25);
      smoothedIndexPositions[i].y = lerp(smoothedIndexPositions[i].y, drawIndexFingerY, 0.25);
    }

    const dx = thumbX - indexFingerX;
    const dy = thumbY - indexFingerY;
    const d = Math.sqrt(dx * dx + dy * dy);
    textSize(d);
    
    const counter = floor(d);
      if (counter > 0 && counter < 30) {
      } else if(counter > 31 && counter <50){
      } else if(counter > 51 && counter < 70){
      } else if(counter > 71 && counter < 90){
      } else {
      }
    
    ellipse(smoothedThumbPositions[i].x, smoothedThumbPositions[i].y, 30);
    ellipse(smoothedIndexPositions[i].x, smoothedIndexPositions[i].y, 30);
    
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  lastTextKey = "";
  updateText();
}