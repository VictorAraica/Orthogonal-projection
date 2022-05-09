let controlsContainer = document.getElementById("controls-container");

const shapes = ["plane", "line", "segmentedLine", "point"];

let addButton = document.getElementById("add-button");

let inputs = [];

let inputElement = document.createElement("input");
inputElement.type = "text";
inputElement.className =
  "w-full border-b border-gray-600 text-lg p-2 outline-none";

const textToShape = (data) => {
  let shape;
  if (data.length === 3 && data.every((i) => !isNaN(i))) {
    shape = new Point(
      parseFloat(data[0]),
      parseFloat(data[1]),
      parseFloat(data[2])
    );
  } else if (data.length === 2) {
    const shape1 = inputs.find((element) => element.name === data[0]).shape;
    const shape2 = inputs.find((element) => element.name === data[1]).shape;

    if (shape1.type === "point" && shape2.type === "point") {
      shape = new Line(shape1, shape2);
    } else if (shape1.type in shapes && shape2.type in shapes) {
      shape = new Plane(shape1, shape2);
    }
  } else if (data.length === 3) {
    const shape1 = inputs.find((element) => element.name === data[0]).shape;
    const shape2 = inputs.find((element) => element.name === data[1]).shape;
    const shape3 = inputs.find((element) => element.name === data[2]).shape;

    if (
      shape1.type === shape2.type &&
      shape2.type === shape3.type &&
      shape1.type === "point"
    ) {
      shape = new Plane(shape1, shape2, shape3);
    }
  }

  return shape;
};

const onBlur = (e) => {
  let value = e.target.value;
  const index = e.target.index;

  value = value.replace(/ /g, "");

  const splited = value.split("=");

  if (splited.length !== 2) {
    console.log("1");
    e.target.value = inputs[index].command ? inputs[index].command : "error";
    return false;
  }

  const name = splited[0];
  let data = splited[1];

  let sameNameElem = inputs.find((element) => element.name === name);

  if (sameNameElem) {
    if (sameNameElem.input.index !== index) {
      console.log("2");
      e.target.value = inputs[index].command ? inputs[index].command : "error";
      return false;
    }
  }

  data = data.replace(/\(|\)/g, "").split(",");

  if (data.length > 3 && data.length < 2) {
    console.log(data);
    console.log("3");
    e.target.value = inputs[index].command ? inputs[index].command : "error";
    return false;
  }

  let shape = textToShape(data);

  if (!shape) {
    console.log("4");
    e.target.value = inputs[index].command ? inputs[index].command : "error";
    return false;
  }

  if (sameNameElem) {
    const sameNameElemIndex = board.shapes.indexOf(shape);
    if (index > -1) {
      board.shapes.splice(sameNameElemIndex, 1); // 2nd parameter means remove one item only
    }
  }

  inputs[index].shape = shape;
  inputs[index].name = name;
  inputs[index].command = `${name} = (${data.join(", ")})`;
  e.target.value = inputs[index].command;
  board.addShape(shape);
};

addButton.onclick = () => {
  let input = inputElement.cloneNode(true);
  input.onblur = onBlur;
  input.index = inputs.length;

  controlsContainer.insertBefore(input, addButton);
  inputs.push({ input });
  input.focus();
};
