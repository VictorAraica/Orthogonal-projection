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
  board.xLimit = controlsContainer.offsetWidth;
}

function mouseDragged() {
  board.moveCameraPos();
}

function mouseClicked() {
  // board.test();
  // console.log(controlPanel.board.shapes[6]);
}

function mouseWheel(e) {
  board.zoom(e);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
