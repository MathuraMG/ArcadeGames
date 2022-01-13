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

let carImageR, carImage1, carImage2, carImage3;
let roadImage, lineImage;
let carImages = [];

//Key states
let ESC = 27;

//speed variables
let FAST = 1,
  NORMAL = 8;

//Game variables
let score, frames, currFrame, speed;
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
    this.cars = [];
  }

  init(d) {
    this.width = COL;
    this.height = ROW * 20;
    this._grid = [];
    this.cars = [];

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
      this.cars.push({x: posx[randx], y:posyprev + ydiff[randy], carNo: floor(random(0,3))});
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
function setCar(place, type, x, y) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (!((i == 0 || i == 2) && (j == 0 || j == 2))) {
        place.set(type, x + i, y + j);
      }
    }
  }
}

function drawImageCar(place, type, x, y, carNo) {
  let carImageTemp;
  tw = width / grid.width;
  th = height / grid.height;
  if (type == 1) {
    carImageTemp = carImages[carNo];  
  } else if(type==2) {
    carImageTemp = carImageR; 
  }
  image(carImageTemp, x * tw -1*tw, y * th, 3.5 * tw, 4.2 * th);
}

function preload() {
  carImage1 = loadImage("./assets/car1.png");
  carImage2 = loadImage("./assets/car2.png");
  carImage3 = loadImage("./assets/car3.png");
  carImages = [carImage1, carImage2, carImage3];
  carImageR = loadImage("./assets/raceCar.png");
  roadImage = loadImage("./assets/background.png");
  lineImage = loadImage("./assets/lines.png");
}
let lineY;
function setup() {
  //initialise the game
  
  init();

  //map + cars
  createCanvas(COL * 20, ROW * 20);
  update();
}

function draw() {
  image(roadImage,0,0,width, height);
  
  if(frameCount % speed==0) {
    lineY+=grid.height;
  }
  image(lineImage,0,lineY%(height),width, height);
  image(lineImage,0,lineY%(height)-height,width, height);
  update();
}

function update() {
  if (!gamefail) {
    frames++;
    let carposNew = carpos;
    speed = NORMAL;
    if (keyIsPressed) {
      //to reduce sensitivity of keys being presed
      if (frames - currFrame > 10) {
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

      if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
        //set car in current position EMPTY and ser new RCAR
        setCar(grid, EMPTY, carpos, ROW - 5);
        setCar(grid, RCAR, carposNew, ROW - 5);
      }

      // control speed TBD
      if (keyCode == UP_ARROW) {
        speed = FAST;
      } else {
        speed = NORMAL;
      }
    }

    check(count);

    for(let i=0;i<map.cars.length;i++) {
      
      drawImageCar(grid, CAR, map.cars[i].x,  grid.height-map.height+map.cars[i].y+count, map.cars[i].carNo);
    }
    console.log(ROW);
    drawImageCar(grid, RCAR, carposNew, ROW - 5,0);
    
    carpos = carposNew;

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
  console.log(count);
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
    }
  }
}

function showScore(count) {
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
  lineY = 0;
  setvariables();
  grid.init(EMPTY, COL, ROW);
  setCar(grid, RCAR, carpos, ROW - 5);
  // drawImageCar(grid, RCAR, carpos, ROW - 5);
  map.init(EMPTY);
}
