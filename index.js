let board;
let controlPanel;
let rotateAngle = 0;

const controlsContainer = document.getElementById("controls-container");

const addButton = document.getElementById("add-button");

const WEBGLButton = document.getElementById("WEBGL-toggle-button");

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  board = new Board();
  controlPanel = new ControlPanel(controlsContainer, addButton, board);

  WEBGLButton.addEventListener("click", () => {
    board.WEBGL = !board.WEBGL;
  });
}

function draw() {
  // rotate(rotateAngle, createVector(1, 1, 0));
  // rotateAngle += 0.01;
  background(15);
  if (!board.WEBGL) {
    translate(-windowWidth / 2, -windowHeight / 2);
    board.drawBackground();
    board.drawShapes();
    board.xLimit = controlsContainer.offsetWidth;
  } else {
    camera();
    translate(controlsContainer.offsetWidth / 2, 0);
    stroke(255);
    line(-50, 0, 0, 50, 0, 0);
  }
}

function mouseDragged() {
  if (!board.WEBGL) {
    board.moveCameraPos();
  }
}

function mouseClicked() {
  // board.test();
  // console.log(controlPanel.board.shapes[6]);
}

function mouseWheel(e) {
  if (!board.WEBGL) {
    board.zoom(e);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
