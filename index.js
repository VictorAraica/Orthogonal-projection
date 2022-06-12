let board;
let controlPanel;

const controlsContainer = document.getElementById("controls-container");

const addButton = document.getElementById("add-button");

const WEBGLButton = document.getElementById("WEBGL-toggle-button");

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  board = new Board();
  controlPanel = new ControlPanel(controlsContainer, addButton, board);

  if (board.orthoWEBGL) {
    ortho();
  }

  WEBGLButton.addEventListener("click", () => {
    board.WEBGL = !board.WEBGL;
  });
}

function draw() {
  background(15);
  if (!board.WEBGL) {
    translate(-windowWidth / 2, -windowHeight / 2);
    board.drawBackground();
    board.drawShapes();
    board.xLimit = controlsContainer.offsetWidth;
  } else {
    translate(
      board.translateXWEBGL,
      board.translateYWEBGL,
      board.translateZWEBGL
    );

    rotateX(board.rotateXWEBGL);
    rotateY(board.rotateYWEBGL);

    board.drawAxisWEBGL();
    board.drawShapes();
    board.drawPH();
    board.drawPV();
  }
}

function mouseDragged(e) {
  if (!board.WEBGL) {
    board.moveCameraPos();
  } else {
    board.moveCameraPosWEBGL(e);
  }
}

function mouseClicked() {
  // board.test();
  // console.log(controlPanel.board.shapes[6]);
}

function mouseWheel(e) {
  if (!board.WEBGL) {
    board.zoom(e);
  } else {
    board.zoomWEBGL(e);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
