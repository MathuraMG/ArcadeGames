/******************************** VARIABLE DEFINITIONS *********************/
//Constants
const row = 20,
  col = 20;
const EMPTY = 0,
  SNAKE = 1,
  FOOD = 2,
  NUMNUM = 3;

const IMG_OFFSET = 3;

const LEFT = 0,
  UP = 1,
  RIGHT = 2,
  DOWN = 3;

const GRID_SIZE = window.innerHeight / 30;

//Game objects
let score, sp;

// All let for numnum
let startTime,
  currTime,
  numx = 0,
  numy = 0;

//Food pictures
let cherry, grape, grass;

function preload() {
  cherry = loadImage("./assets/cherry.png");
  grape = loadImage("./assets/grape.png");
  grass = loadImage("./assets/back.png");
  body1 = loadImage("./assets/body1.png");
  body2 = loadImage("./assets/body2.png");
  body3 = loadImage("./assets/body3.png");

  headonlyLeft = loadImage("./assets/headonlyLeft.png");
  headonlyRight = loadImage("./assets/headonlyRight.png");
  headonlyUp = loadImage("./assets/headonlyUp.png");
  headonlyDown = loadImage("./assets/headonlyDown.png");
  
  headLeft = loadImage("./assets/headLeft.png");
  headRight = loadImage("./assets/headRight.png");
  headUp = loadImage("./assets/headUp.png");
  headDown = loadImage("./assets/headDown.png");
  bodies = [body1, body2, body3];
}

//Main variables

let grid = new Grid();
let snake = new Snake();

/****************** FUNCTION DEFINITIONS **********************/

function setFood(type) {
  let empty = [];
  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      if (grid.get(i, j) == EMPTY) {
        empty.push({ x: i, y: j, bodyType: floor(random(0,3)) });
      }
    }
  }
  let randpos = empty[Math.floor(Math.random() * empty.length)];
  grid.set(type, randpos.x, randpos.y);
  return randpos;
}

function moveSnake() {
  let tail;

  if (keyIsPressed) {
    //change direction of the snake
    if (keyCode == LEFT_ARROW && snake.direction != RIGHT) {
      snake.direction = LEFT;
    }
    if (keyCode == RIGHT_ARROW && snake.direction != LEFT) {
      snake.direction = RIGHT;
    }
    if (keyCode == DOWN_ARROW && snake.direction != UP) {
      snake.direction = DOWN;
    }
    if (keyCode == UP_ARROW && snake.direction != DOWN) {
      snake.direction = UP;
    }
  }
  //automatically move the snake
  if (frameCount % 3 == 0) {
    let nx = snake.last.x;
    let ny = snake.last.y;
    switch (snake.direction) {
      case LEFT:
        if (nx <= 0) {
          nx = (col - nx - 1) % col;
        } else {
          nx = (nx - 1) % col;
        }
        break;
      case RIGHT:
        nx = (nx + 1) % col;
        break;
      case UP:
        if (ny <= 0) {
          ny = (row - ny - 1) % row;
        } else {
          ny = (ny - 1) % row;
        }
        break;
      case DOWN:
        ny = (ny + 1) % row;
        break;
    }

    //Move snake based on food/snake/empty

    //if FOOD/NUMNUM
    if (grid.get(nx, ny) == FOOD || grid.get(nx, ny) == NUMNUM) {
      tail = { x: nx, y: ny };

      if (grid.get(nx, ny) == NUMNUM) {
        score = score + 2;
      } else {
        score++;
      }

      if (score % 5 == 0) {
        foodPos = setFood(NUMNUM);

        startTime = new Date().getTime() / 1000;

        numx = foodPos.x;
        numy = foodPos.y;
      } else {
        setFood(FOOD);
      }
    }

    // if snake has suicidal tendencies - kill the snake
    else if (grid.get(nx, ny) == SNAKE) {
      init();
      tail = snake.remove();
    }

    // if nothing, just move on
    else {
      tail = snake.remove();
      grid.set(EMPTY, tail.x, tail.y);
      tail.x = nx;
      tail.y = ny;
    }

    //Remove numnum if > 3s and set normal food item
    currTime = new Date().getTime() / 1000;

    if (grid.get(numx, numy) == NUMNUM) {
      if (currTime - startTime > 2) {
        grid.set(EMPTY, numx, numy);
        setFood(FOOD);
      }
    }

    //finally set the SNAKE and GRID
    grid.set(SNAKE, tail.x, tail.y);
    snake.insert(tail.x, tail.y);
  }
}

function drawSnake() {
  let tw = width / grid.width;
  let th = height / grid.height;

  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      noStroke();
      switch (grid.get(i, j)) {
        case EMPTY:

          break;
          case SNAKE:
          // console.log(snake._queue[0].x,i);
          if(snake._queue.length == 1) {
            let imgTemp;
            switch(snake.direction) {
              case RIGHT:
                imgTemp = headonlyRight;
                image(imgTemp,i*tw,j*th, 2*tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
                break;
              case LEFT:
                imgTemp = headonlyLeft;
                image(imgTemp,i*tw-tw,j*th, 2*tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
                break;
              case UP:
                imgTemp = headonlyUp;
                image(imgTemp,i*tw,j*th-th, tw+IMG_OFFSET*2, 2*th+IMG_OFFSET*2);
                break;
              case DOWN:
                imgTemp = headonlyDown;
                image(imgTemp,i*tw,j*th, tw+IMG_OFFSET*2, 2*th+IMG_OFFSET*2);
                break;  
              default:
                break;  
            }
          } else {
            if (i == snake._queue[0].x && j == snake._queue[0].y) {
              switch(snake.direction) {
                case RIGHT:
                  imgTemp = headRight;
                  image(imgTemp,i*tw,j*th, 2*tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
                  break;
                case LEFT:
                  imgTemp = headLeft;
                  image(imgTemp,i*tw-tw,j*th, 2*tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
                  break;
                case UP:
                  imgTemp = headUp;
                  image(imgTemp,i*tw,j*th-th, tw+IMG_OFFSET*2, 2*th+IMG_OFFSET*2);
                  break;
                case DOWN:
                  imgTemp = headDown;
                  image(imgTemp,i*tw,j*th, tw+IMG_OFFSET*2, 2*th+IMG_OFFSET*2);
                  break;  
                default:
                  break;  
              }
            } else {
                image(body1,i * tw-IMG_OFFSET, j * th-IMG_OFFSET, tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
            }
          }
          
          break;
        case FOOD:
          image(cherry, i * tw, j * th, tw, th);
          break;
        case NUMNUM:
          image(grape, i * tw-IMG_OFFSET, j * th-IMG_OFFSET, tw+IMG_OFFSET*2, th+IMG_OFFSET*2);
          break;
      }
    }
  }
  fill("#000");
  // ctx.font =  "12px Arial";
  text("SCORE : " + score, 10, height - 10);
}

function init() {
  grid.init(EMPTY, col, row);
  score = 0;
  sp = { x: Math.floor(col / 2), y: row - 1 };
  snake.init(LEFT, sp.x, sp.y);
  grid.set(SNAKE, sp.x, sp.y);
  setFood(FOOD);
}
/************************ MAIN p5 FUNCTIONS **********************/

function setup() {
  createCanvas(col * GRID_SIZE, row * GRID_SIZE);
  background(200, 123, 65);
  init();
}

function draw() {
  image(grass,0,0,width/2,height/2);
  image(grass,width/2,0,width/2,height/2);
  image(grass,width/2,height/2,width/2,height/2);
  image(grass,0,height/2,width/2,height/2);
  moveSnake();
  drawSnake();
}
