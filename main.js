let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  board = new Board();
}

function draw() {
  background(0);
  board.draw_background();
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
