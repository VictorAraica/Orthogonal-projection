let board;
let controlPanel;

const controlsContainer = document.getElementById("controls-container");

const addButton = document.getElementById("add-button");

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board();
  controlPanel = new ControlPanel(controlsContainer, addButton, board);
}

function draw() {
  background(0);
  board.drawBackground();
  board.drawShapes();
}

function mouseDragged() {
  board.moveCameraPos();
}

function mouseClicked() {
  board.test();
}

function mouseWheel(e) {
  board.zoom(e);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
