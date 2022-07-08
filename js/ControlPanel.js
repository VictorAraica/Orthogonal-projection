{
  /* <button class="flex justify-center content-center w-full border-b border-gray-600 p-1">
  <i class="material-icons text-neutral-400">more_vert</i>
</button>; */
}

class ControlPanel {
  constructor(controlsContainer, addButton, board) {
    this.controlsContainer = controlsContainer;
    this.addButton = addButton;
    // {
    // command: input value
    // dependencies: list of shapes that depend on this one
    // name
    // shape
    // show
    // optionsButton
    // }
    this.inputs = [];
    this.functions = [
      "intersection",
      "parallel",
      "perpendicularLine",
      "segment",
      "perpendicularPlane",
      "trazaH",
      "trazaV",
      "triangle",
      "pentagon",
    ];
    this.board = board;

    this.colors = [
      {
        rgb: [220, 38, 38],
        tailwind: "bg-red-600",
      },
      {
        rgb: [219, 39, 119],
        tailwind: "bg-pink-600",
      },
      {
        rgb: [217, 70, 239],
        tailwind: "bg-fuchsia-500",
      },
      {
        rgb: [124, 58, 237],
        tailwind: "bg-violet-600",
      },
      {
        rgb: [79, 70, 229],
        tailwind: "bg-indigo-600",
      },
      {
        rgb: [59, 130, 246],
        tailwind: "bg-blue-500",
      },
      {
        rgb: [14, 165, 233],
        tailwind: "bg-cyan-500",
      },
      {
        rgb: [22, 163, 74],
        tailwind: "bg-green-600",
      },
      {
        rgb: [251, 191, 36],
        tailwind: "bg-amber-400",
      },
    ];

    // size of controls container
    this.board.xLimit = controlsContainer.offsetWidth;

    // -----------------------------------------------------------------------------------

    this.inputContainer = document.createElement("div");
    this.inputContainer.className =
      "border-b border-gray-600 flex justify-between content-center items-center";

    // -----------------------------------------------------------------------------------

    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";
    this.inputElement.className = "w-full text-lg p-2 outline-none";

    // -----------------------------------------------------------------------------------

    this.inputVisibilityElement = document.createElement("div");
    this.inputVisibilityElement.className =
      "rounded-full border-2 border-black bg-black w-5 h-5 m-2 cursor-pointer bg-opacity-70 shrink-0";

    // -----------------------------------------------------------------------------------

    this.optionsButton = document.createElement("button");
    this.optionsButton.className =
      "flex justify-center content-center h-full p-2";
    this.optionsButton.innerHTML +=
      '<i class="material-icons text-neutral-400">more_vert</i>';

    // -----------------------------------------------------------------------------------

    this.optionsButton = document.createElement("button");
    this.optionsButton.className =
      "flex justify-center content-center h-full p-2 relative overflow-visible button";
    this.optionsButton.innerHTML +=
      '<i class="material-icons text-neutral-400 icon">more_vert</i>';

    // -----------------------------------------------------------------------------------

    this.addButton.onclick = () => {
      this.createInput("");
    };

    let commands = [
      "p1 = (1, 4, 4)",
      "p2 = (5.3, 7, 1)",
      "p3 = (3, 8, 4)",
      "plane = (p1, p2, p3)",
      // "l = (p2, p3)",
      // "aux1 = perpendicularLine(p1, l)",
      // "A = intersection(l, aux1)",
      // "aris1 = parallel(p2, aux1)",
      // "aris2 = perpendicularLine(plane, A)",
      // "p4 = (10, 8, 3)",
      // "plane2 = parallel(p4, plane)",
      // "B = intersection(plane2, aris2)",
      // "aris3 = parallel(aris2, p2)",
      // "C = intersection(plane2, aris3)",
      // "aris4 = parallel(l, p1)",
      // "D = intersection(aris4, aris1)",
      // "aris5 = parallel(D, aris3)",
      // "E = intersection(plane2, aris5)",
      // "aris6 = parallel(p1, aris3)",
      // "F = intersection(plane2, aris6)",
      // "a1 = segment(p1, A)",
      // "a2 = segment(p1, D)",
      // "a3 = segment(p1, F)",
      // "a4 = segment(p2, D)",
      // "a5 = segment(p2, A)",
      // "a6 = segment(p2, C)",
      // "a7 = segment(A, B)",
      // "a8 = segment(B, C)",
      // "a9 = segment(B, F)",
      // "a10 = segment(E, F)",
      // "a11 = segment(E, D)",
      // "a12 = segment(E, C)",
    ];

    for (let command of commands) {
      this.createInput(command);
    }

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].input.value = commands[i];
      this.updateInput(i);
    }
  }

  // -------------------------------------------------------------------------

  openColorOptions(e, index) {
    // if the target is not part of the original small button then dont open a new colors window
    // to make sure you dont open multiple color windows
    if (
      !e.target.classList.contains("button") &&
      !e.target.classList.contains("icon")
    ) {
      return false;
    }

    // create the container element
    let optionsContainer = document.createElement("div");
    optionsContainer.className = `fixed bg-white z-50 translate-x-1/2 translate-y-3 
                                  grid grid-cols-${this.colors.length} gap-1 p-1.5 
                                  border border-gray-500 colorContainer cursor-default`;

    // add a click event to the document, if click outside the button remove the colors element
    let onOutsideClickHandler = (e) => {
      if (
        !e.target.classList.contains("colorButton") &&
        !e.target.classList.contains("colorContainer") &&
        !e.target.classList.contains("button") &&
        !e.target.classList.contains("icon")
      ) {
        optionsContainer.remove();
        document.removeEventListener("click", onOutsideClickHandler, false);
      }
    };

    document.addEventListener("click", onOutsideClickHandler);

    // create all the color buttons
    for (let i = 5; i > 0; i--) {
      for (let color of this.colors) {
        let colorButton = document.createElement("button");
        colorButton.className = `w-4 h-4 ${color.tailwind} opacity-${
          i * 20
        } colorButton`;
        optionsContainer.appendChild(colorButton);

        colorButton.onclick = () => {
          this.inputs[index].shape.color = color.rgb.map(
            (x) => (x * (i * 2)) / 10
          );
        };
      }
    }

    // append the container element to the button
    this.inputs[index].optionsButton.appendChild(optionsContainer);
  }

  // -------------------------------------------------------------------------

  test() {
    // console.log(this.inputs[15]);
  }

  visibilityToggle(e, index) {
    if (this.inputs[index].show) {
      if (this.inputs[index].shape.constructor.name === "Array") {
        for (let shape of this.inputs[index].shape) shape.show = false;
      } else {
        this.inputs[index].shape.show = false;
      }
      this.inputs[index].show = false;
      e.target.className = e.target.className.replace(
        "bg-opacity-70",
        "bg-opacity-10"
      );
    } else {
      if (this.inputs[index].shape.constructor.name === "Array") {
        for (let shape of this.inputs[index].shape) shape.show = true;
      } else {
        this.inputs[index].shape.show = true;
      }
      this.inputs[index].show = true;
      e.target.className = e.target.className.replace(
        "bg-opacity-10",
        "bg-opacity-70"
      );
    }
  }

  addDependencies(index, dependencies) {
    // add index to dependencies list of the shapes used to make this one
    for (let i of dependencies) {
      if (!i.dependencies.includes(index)) {
        i.dependencies.push(index);
      }
    }
  }

  textToShape(data, index) {
    let shape;

    // if 3 numbers create point
    if (data.length === 3 && data.every((i) => !isNaN(i))) {
      shape = new Point(
        parseFloat(data[0]),
        parseFloat(data[1]),
        parseFloat(data[2])
      );
    } else if (data.length === 2) {
      const shape1 = this.inputs.find((element) => element.name === data[0]);
      const shape2 = this.inputs.find((element) => element.name === data[1]);

      if (!shape1 || !shape2) {
        return "argument not found";
      }

      // if two points create line
      if (shape1.shape.type === "point" && shape2.shape.type === "point") {
        shape = new Line(shape1.shape, shape2.shape);
      }
      // add dependencies to the points
      this.addDependencies(index, [shape1, shape2]);
    } else if (data.length === 3) {
      const shape1 = this.inputs.find((element) => element.name === data[0]);
      const shape2 = this.inputs.find((element) => element.name === data[1]);
      const shape3 = this.inputs.find((element) => element.name === data[2]);
      if (!shape1 || !shape2 || !shape3) {
        return "argument not found";
      }

      // if 3 points create plane
      if (
        shape1.shape.type === shape2.shape.type &&
        shape2.shape.type === shape3.shape.type &&
        shape1.shape.type === "point"
      ) {
        let line = new Line(shape1.shape, shape2.shape);
        if (line.pointInLine(shape3.shape)) {
          return "the 3 points on the same line";
        }
        shape = new Plane(shape1.shape, shape2.shape, shape3.shape);

        this.addDependencies(index, [shape1, shape2, shape3]);
      }
    }
    if (!shape) return "error creating the shape";

    return shape;
  }

  intersection(index, input1, input2) {
    let shape;

    if (input1.shape.type === "line" && input2.shape.type === "line") {
      shape = input1.shape.lineIntersection(input2.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "plane") {
      shape = input1.shape.planeIntersection(input2.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "line") {
      shape = input2.shape.planeIntersection(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "plane") {
      shape = input2.shape.planeIntersection(input1.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return "error creating the shape";
  }

  parallel(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.parallelLine(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.parallelLine(input2.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "point") {
      shape = input1.shape.parallelPlane(input2.shape);
    } else if (input1.shape.type === "point" && input2.shape.type === "plane") {
      shape = input2.shape.parallelPlane(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "plane") {
      shape = input2.shape.planeIntersection(input1.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return "error creating the shape";
  }

  perpendicularLine(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.perpendicularLine(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularLine(input2.shape);
    } else if (input1.shape.type === "point" && input2.shape.type === "plane") {
      shape = input2.shape.perpendicularLine(input1.shape);
    } else if (input1.shape.type === "plane" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularLine(input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return "error creating the shape";
  }

  perpendicularPlane(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "line") {
      shape = input2.shape.perpendicularPlane(input1.shape);
    } else if (input1.shape.type === "line" && input2.shape.type === "point") {
      shape = input1.shape.perpendicularPlane(input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return "error creating the shape";
  }

  segmentedLine(index, input1, input2) {
    let shape;
    if (input1.shape.type === "point" && input2.shape.type === "point") {
      shape = new SegmentedLine(input1.shape, input2.shape);
    }
    if (shape) {
      this.addDependencies(index, [input1, input2]);
      return shape;
    }
    return "error creating the shape";
  }

  trazaH(index, input) {
    let shape = false;
    if (input.shape.type === "line") {
      shape = input.shape.getPointUsingZ(0);
    } else if (input.shape.type === "plane") {
      shape = input.shape.planeIntersection(this.board.PH);
    } else {
      return "parameter must be a line or a plane";
    }
    if (shape) {
      this.addDependencies(index, [input]);
      return shape;
    }
    return "error creating the shape";
  }

  trazaV(index, input) {
    let shape = false;
    if (input.shape.type === "line") {
      shape = input.shape.getPointUsingY(0);
    } else if (input.shape.type === "plane") {
      shape = input.shape.planeIntersection(this.board.PV);
    } else {
      return "parameter must be a line or a plane";
    }

    if (shape) {
      this.addDependencies(index, [input]);
      return shape;
    }
    return "error creating the shape";
  }

  polygon(index, name, parameters) {
    let inputs = parameters.map((parameter) => {
      return this.inputs.find((element) => element.name === parameter);
    });
    let polygon;
    try {
      polygon = new Polygon(
        parameters[0],
        inputs[1].shape,
        inputs[2].shape,
        inputs[3].shape
      );
    } catch {
      return "error creating the shape";
    }

    let names = polygon.points.map((_, i) => `${name}${i}`);

    let sameNameElements = names.map((vertexName) =>
      this.inputs.find((element) => element.name === vertexName)
    );

    let commands = polygon.points.map(
      (point, i) =>
        `${name}${i} = (${point.vector.x}, ${point.vector.y}, ${point.vector.z})`
    );

    for (let i = 0; i < names.length; i++) {
      if (!sameNameElements[i]) {
        this.createInput(commands[i]);
        this.inputs[this.inputs.length - 1].input.blur();
      } else {
        sameNameElements[i].input.value = commands[i];
        this.updateInput(sameNameElements[i].input.index);
      }
    }

    if (polygon) {
      this.addDependencies(index, [inputs[1], inputs[2], inputs[3]]);
      return polygon;
    }

    return "error creating the shape";
  }

  functionToShape(index, functionName, parameters) {
    let shape = "error creating the shape";
    if (!functionName in this.functions) {
      return shape;
    }

    let inputs = parameters.map((parameter) => {
      return this.inputs.find((element) => element.name === parameter);
    });

    if (functionName === "intersection") {
      shape = this.intersection(index, inputs[0], inputs[1]);
    } else if (functionName === "parallel") {
      shape = this.parallel(index, inputs[0], inputs[1]);
    } else if (functionName === "perpendicularLine") {
      shape = this.perpendicularLine(index, inputs[0], inputs[1]);
    } else if (functionName === "perpendicularPlane") {
      shape = this.perpendicularPlane(index, inputs[0], inputs[1]);
    } else if (functionName === "segment") {
      shape = this.segmentedLine(index, inputs[0], inputs[1]);
    } else if (functionName === "trazaH") {
      shape = this.trazaH(index, inputs[0]);
    } else if (functionName === "trazaV") {
      shape = this.trazaV(index, inputs[0]);
    }

    return shape;
  }

  getNameAndData(value) {
    value = value.replace(/ /g, "");

    const splited = value.split("=");

    if (splited.length !== 2) {
      return [false, false];
    }

    return splited;
  }

  blurError(element, error) {
    this.board.shapes[element.input.index] = false;
    element.input.value = "";
    element.input.placeholder = error;
  }

  updateInput(index, userUpdate = true) {
    let element = this.inputs[index];
    let value = element.input.value;

    // if input is empty because the user deleted the command
    // reset everything and update the dependencies,
    // if not updated by the user then update using the command given in the funciton
    if (value === "" && userUpdate) {
      element.shape = "";
      element.name = "";
      element.command = "";
      element.input.placeholder = "";
      this.board.shapes[index] = false;
      element.shape = false;
      if (element.dependencies) {
        for (let i of element.dependencies) {
          this.updateInput(i);
        }
      }
      element.dependencies = [];
    } else if (value === "") {
      value = element.command;
    }

    // ---------------------------------------------

    // split on = and get name and data
    let [name, data] = this.getNameAndData(value);

    // if no data delete input value and return
    if (!data) {
      this.blurError(element, "no data");
      return false;
    }

    // ---------------------------------------------

    // find elements with the same name
    let sameNameElem = this.inputs.find((element) => element.name === name);

    // if there is an element with the same name and its not this one throw error
    if (sameNameElem) {
      if (sameNameElem.input.index !== index) {
        this.blurError(element, "name already used");
        return false;
      }
    }

    // ---------------------------------------------
    let shape = false;

    const functionRegex = /\w+\(.+\,?.*\,?.*?\,?.*?\)/;
    // if command is a function
    if (data.match(functionRegex)) {
      let [functionName, parameters] = data.replace(/\)/g, "").split("(");
      parameters = parameters.split(",");

      if (functionName === "polygon") {
        shape = this.polygon(index, name, parameters);
      } else {
        shape = this.functionToShape(index, functionName, parameters);
      }
      if (typeof shape === "string" || shape instanceof String) {
        this.blurError(element, shape);
        return false;
      }
      element.command = `${name} = ${functionName}(${parameters.join(", ")})`;
    } else {
      data = data.replace(/\(|\)/g, "").split(",");

      if (data.length > 3 && data.length < 2) {
        this.blurError(element, "expected 2 or 3 arguments");
        return false;
      }

      shape = this.textToShape(data, index);

      if (typeof shape === "string" || shape instanceof String) {
        this.blurError(element, shape);
        return false;
      }

      element.command = `${name} = (${data.join(", ")})`;
    }

    // ---------------------------------------------
    // if this input already has a shape then replace it
    if (this.board.shapes[index]) {
      this.board.shapes.splice(index, 1);
    }

    // if this input had a show = false then update the shape
    if (!element.show) {
      shape.show = false;
    }

    element.shape = shape;
    element.name = name;

    element.input.value = element.command;
    element.input.placeholder = "";
    this.board.addShape(shape, index);

    for (let i of element.dependencies) {
      this.updateInput(i, false);
    }

    return shape;
  }

  createInput(command) {
    let input = this.inputElement.cloneNode(true);
    let inputContainer = this.inputContainer.cloneNode(true);
    let optionsButton = this.optionsButton.cloneNode(true);
    let inputVisibilityElement = this.inputVisibilityElement.cloneNode(true);

    input.addEventListener("blur", (e) => this.updateInput(e.target.index));
    input.value = command;
    input.index = this.inputs.length;

    inputVisibilityElement.index = input.index;
    inputVisibilityElement.addEventListener("click", (e) =>
      this.visibilityToggle(e, input.index)
    );

    optionsButton.onclick = (e) => {
      this.openColorOptions(e, input.index);
    };

    inputContainer.appendChild(inputVisibilityElement);
    inputContainer.appendChild(input);
    inputContainer.appendChild(optionsButton);

    this.controlsContainer.insertBefore(inputContainer, this.addButton);
    this.inputs.push({
      input,
      dependencies: [],
      command: command,
      show: true,
      optionsButton,
    });
    input.focus();

    return input;
  }
}
