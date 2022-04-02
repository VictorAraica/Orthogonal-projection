let board;

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight);
  board = new Board();
}

function draw() {
  // put drawing code here
  background(0);
  board.draw_background();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
