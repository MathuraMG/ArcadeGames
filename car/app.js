/******************* VARIABLE DEFINITION *************************/
//Constants
let ROW = 30,
  COL = 20;
let EMPTY = 0,
  CAR = 1,
  RCAR = 2;
let CENTER = 9,
  LEFT = 3,
  RIGHT = 15;

//Key states
let KEY_LEFT = 37,
  KEY_RIGHT = 39,
  KEY_UP = 38,
  ESC = 27;

//speed variables
let FAST = 2,
  NORMAL = 8;

//Game variables
let canvas, ctx, score, frames, keystate, currFrame, speed;
let carpos = CENTER;
let gamefail = 0;
let count = 0;

//Score variables
let carcrossed;
let startTime, endTime;

//Main variables
class Map {
  constructor() {
    this.width = null;
    this.height = null;
    this._grid = null;
  }

  init(d) {
    this.width = COL;
    this.height = ROW * 20;

    this._grid = [];

    for (let i = 0; i < this.width; i++) {
      this._grid.push([]);
      for (let j = 0; j < this.height; j++) {
        this._grid[i].push(d);
      }
    }

    let posx = [LEFT, CENTER, RIGHT];
    let posyprev = 0;
    let posxprev = 1;
    let ydiff = [8, 9, 10];
    let randx, randy;
    while (posyprev < this.height - 20) {
      do {
        randx = Math.floor(Math.random() * 3);
      } while (randx == posxprev);
      posxprev = randx;
      randy = Math.floor(Math.random() * 3);
      setCar(this, CAR, posx[randx], posyprev + ydiff[randy]);
      posyprev = posyprev + ydiff[randy];
    }
  }

  set(val, x, y) {
    this._grid[x][y] = val;
  }

  get(x, y) {
    return this._grid[x][y];
  }
}

let map = new Map();

class Grid {
  constructor() {
    this.width = null;
    this.height = null;
    this._grid = null;
  }

  init(d, c, r) {
    this.width = COL;
    this.height = ROW;

    this._grid = [];

    for (let i = 0; i < c; i++) {
      this._grid.push([]);
      for (let j = 0; j < r; j++) {
        this._grid[i].push(d);
      }
    }
  }

  set(val, x, y) {
    this._grid[x][y] = val;
  }

  get(x, y) {
    return this._grid[x][y];
  }
}

let grid = new Grid();

/*************** FUNCTION DEFINITIONS **********************/
function mainScreen() {
  let div = document.getElementById("canvas");
  if (div) {
    document.body.removeChild(div);
  }

  mainDiv = document.createElement("div");
  mainDiv.classList.add("mainScreen");
  mainDiv.id = "mainScreen";
  document.body.appendChild(mainDiv);

  startButton = document.createElement("button");
  startButton.classList.add("start");
  startButton.innerHTML = "Start";
  startButton.addEventListener("click", function () {
    clearScreen();
    game();
  });
  mainDiv.appendChild(startButton);
}

function clearScreen() {
  let div = document.getElementById("mainScreen");
  document.body.removeChild(div);
}

function setCar(place, type, x, y) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (!((i == 0 || i == 2) && (j == 0 || j == 2))) {
        place.set(type, x + i, y + j);
      }
    }
  }
}

function createCanvas() {
  canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.classList.add("grid");
  width = COL * 20;
  height = ROW * 20;
  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function getKey() {
  keystate = [];
  document.addEventListener("keydown", function (evt) {
    keystate[evt.keyCode] = true;
  });

  document.addEventListener("keyup", function (evt) {
    delete keystate[evt.keyCode];
  });
}

function setup() {
  //initialise the game
  init();

  //map + cars
  createCanvas(COL * 20, ROW * 20);
  background(143, 200, 45);
}

function draw() {
  update();
}

function update() {
  if (!gamefail) {
    frames++;
    let carposNew = carpos;

    //to reduce sensitivity of keys being presed
    if (frames - currFrame > 6) {
      //get key pressed and new position
      if (keyCode == LEFT_ARROW && carpos == RIGHT) {
        carposNew = CENTER;
        currFrame = frames;
      }
      if (keyCode == LEFT_ARROW && carpos == CENTER) {
        carposNew = LEFT;
        currFrame = frames;
      }
      if (keyCode == RIGHT_ARROW && carpos == CENTER) {
        carposNew = RIGHT;
        currFrame = frames;
      }
      if (keyCode == RIGHT_ARROW && carpos == LEFT) {
        carposNew = CENTER;
        currFrame = frames;
      }
    }

    //control speed
    if (keyCode == UP_ARROW) {
      speed = FAST;
    } else {
      speed = NORMAL;
    }

    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
      //set car in current position EMPTY and ser new RCAR
      setCar(grid, EMPTY, carpos, ROW - 5);
      setCar(grid, RCAR, carposNew, ROW - 5);
    }

    carpos = carposNew;

    drawCar(count);
    check(count);

    //move the map
    if (frameCount % speed == 0) {
      count++;
      calcscore(count);
    }

    //end game if map is complete
    if (count > map.height + 10) {
      endGame();
      // mainScreen();
    }
  } else {
    init();
    gamefail = 0;
  }
}

function check(count) {
  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      if (
        grid.get(i, j) + map.get(i, j + (map.height - grid.height - count)) ==
        3
      ) {
        endGame();
        break;
      }
    }
  }
}

function endGame() {
  gamefail = 1;
  // mainScreen();
}

function calcscore(count) {
  for (let i = 0; i < grid.width; i++) {
    if (map.get(i, map.height - grid.height - count) == 1) {
      carcrossed++;
      console.log(i + "--" + (map.height - grid.height - count));
    }
  }
}

function drawCar(count) {
  tw = width / grid.width;
  th = height / grid.height;

  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      switch (
        grid.get(i, j) + map.get(i, j + (map.height - grid.height - count))
      ) {
        case EMPTY:
          fill("#ffffff");
          rect(i * tw, j * th, tw, th);
          break;
        case CAR:
          fill("#660033");
          rect(i * tw, j * th, tw, th);
          break;
        case RCAR:
          fill("#D699AE");
          rect(i * tw, j * th, tw, th);
          break;
        case 3:
          fill("#000000");
          rect(i * tw, j * th, tw, th);
      }
    }
  }
  fill("#000");
  // ctx.font =  "12px Arial";
  text("CARS CROSSED : " + Math.floor(carcrossed / 8), 10, height - 10);
  currTime = new Date().getTime() / 1000;
  text("TIME : " + Math.floor(currTime - startTime), 150, height - 10);
}

function setvariables() {
  // to initialise game variables
  count = 0;
  frames = 0;
  currFrame = 0;
  speed = NORMAL;
  carpos = CENTER;
  carcrossed = 0;
  startTime = new Date().getTime() / 1000;
}

function init() {
  setvariables();
  grid.init(EMPTY, COL, ROW);
  setCar(grid, RCAR, carpos, ROW - 5);
  map.init(EMPTY);
}
