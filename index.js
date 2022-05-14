let controlsContainer = document.getElementById("controls-container");

const shapes = ["plane", "line", "segmentedLine", "point"];

let addButton = document.getElementById("add-button");

let inputs = [];

let inputElement = document.createElement("input");
inputElement.type = "text";
inputElement.className =
  "w-full border-b border-gray-600 text-lg p-2 outline-none";

const textToShape = (data, index) => {
  let shape;
  if (data.length === 3 && data.every((i) => !isNaN(i))) {
    shape = new Point(
      parseFloat(data[0]),
      parseFloat(data[1]),
      parseFloat(data[2])
    );
  } else if (data.length === 2) {
    const shape1 = inputs.find((element) => element.name === data[0]);
    const shape2 = inputs.find((element) => element.name === data[1]);

    if (shape1.shape.type === "point" && shape2.shape.type === "point") {
      shape = new Line(shape1.shape, shape2.shape);
    } else if (shape1.shape.type in shapes && shape2.shape.type in shapes) {
      shape = new Plane(shape1.shape, shape2.shape);
    }
    for (i of [shape1, shape2]) {
      if (!i.dependencies.includes(index)) {
        i.dependencies.push(index);
      }
    }
  } else if (data.length === 3) {
    const shape1 = inputs.find((element) => element.name === data[0]);
    const shape2 = inputs.find((element) => element.name === data[1]);
    const shape3 = inputs.find((element) => element.name === data[2]);

    if (
      shape1.shape.type === shape2.shape.type &&
      shape2.shape.type === shape3.shape.type &&
      shape1.shape.type === "point"
    ) {
      shape = new Plane(shape1.shape, shape2.shape, shape3.shape);
      for (i of [shape1, shape2, shape3]) {
        if (!i.dependencies.includes(index)) {
          i.dependencies.push(index);
        }
      }
    }
  }

  return shape;
};

getNameAndData = (value) => {
  value = value.replace(/ /g, "");

  const splited = value.split("=");

  if (splited.length !== 2) {
    return [false, false];
  }

  return splited;
};

const blurError = (element, error) => {
  element.input.value = element.command ? element.command : "";
  element.input.placeholder = error;
};

const updateInput = (index) => {
  element = inputs[index];
  value = element.input.value;
  // split on = and get name and data
  let [name, data] = getNameAndData(value);
  // if no data delete input value and return
  if (!data) {
    blurError(element, "");
    return false;
  }

  let sameNameElem = inputs.find((element) => element.name === name);

  if (sameNameElem) {
    if (sameNameElem.input.index !== index) {
      blurError(element, "name already used");
      return false;
    }
  }

  data = data.replace(/\(|\)/g, "").split(",");

  if (data.length > 3 && data.length < 2) {
    blurError(element, "expected 2 or 3 arguments");
    return false;
  }

  let shape = textToShape(data, index);

  if (!shape) {
    blurError(element, "error");
    return false;
  }

  if (sameNameElem) {
    const sameNameElemIndex = board.shapes.indexOf(sameNameElem.shape);
    if (index > -1) {
      board.shapes.splice(sameNameElemIndex, 1);
    }
  }
  element.shape = shape;
  element.name = name;
  element.command = `${name} = (${data.join(", ")})`;
  if (element.dependencies.length > 0) {
    for (i of element.dependencies) {
      updateInput(i);
    }
  }

  element.input.value = element.command;
  element.input.placeholder = "";
  board.addShape(shape);
};

const onBlur = (e) => {
  updateInput(e.target.index);
};

addButton.onclick = () => {
  let input = inputElement.cloneNode(true);
  input.onblur = onBlur;
  input.index = inputs.length;

  controlsContainer.insertBefore(input, addButton);
  inputs.push({ input, dependencies: [] });
  input.focus();
};
