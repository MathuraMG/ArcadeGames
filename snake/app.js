/******************************** letIABLE DEFINITIONS *********************/
//Constants
let row = 26, col =26;
let EMPTY = 0, SNAKE = 1, FOOD = 2, NUMNUM = 3;

//Directions
let UP = 0, DOWN = 1, LEFT = 2, RIGHT = 3;

//Key states
let KEY_LEFT = 37 , KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

//Game objects
let canvas, ctx,keystate, frames, score;

// All let for numnum
let startTime, currTime, numx = 0, numy = 0;

//Food pictures
let cherry, grapes;

function preload() {
	cherry = loadImage('cherries.png');
	grapes = loadImage('grapes.jpeg')
}


//Main variables
class Grid{
	constructor() {
		this.width= null;
		this.height= null;
		this._grid= null;
	}
	
	init(d,c,r){
		this.width = col;
		this.height = row;

		this._grid =[];

		for (let i = 0; i < col; i++) {
			this._grid.push([]);
			for (let j = 0; j < row; j++) {
				this._grid[i].push(d);
				};			
			};
	}
	
	set( val, x, y ){
		this._grid[x][y] = val;
	}

	get( x,y ) {
		return this._grid[x][y];
	}
}

let grid = new Grid();

class Snake{

	constructor() {
		this.direction= null;
		this.last= null;
		this._queue= null;
	}
	

	init(d,x,y){
		this.direction = d;
		this._queue = [];
		this.insert(x,y);

	}

	insert(x, y ){
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];

	}

	remove(){
		return this._queue.pop();
	}

}

let snake = new Snake();

/****************** FUNCTION DEFINITIONS **********************/


function setFood( type ) {
let empty = [];
	for (let i = 0; i < grid.width; i++) {
		for (let j = 0; j < grid.height; j++) {
			if( grid.get(i,j) == EMPTY ){
				empty.push({x:i, y:j});
			}
		}	

	}
	let randpos = empty[Math.floor(Math.random()*empty.length)];
	grid.set( type, randpos.x, randpos.y);
	return randpos;
}

function getKey()
{
	keystate = [];
	document.addEventListener( "keydown" , function( evt ) {
		keystate[evt.keyCode] = true;
	} );
	document.addEventListener( "keyup" , function( evt ) {
		delete keystate[evt.keyCode];
	} );
}

function moveSnake() {
	let tail;
	
	// frames++ ;
	
	if(keyIsPressed) {
	//change direction of the snake
		if (keyCode == LEFT_ARROW && snake.direction != RIGHT) { snake.direction = LEFT; }
		if (keyCode == RIGHT_ARROW && snake.direction != LEFT ) { snake.direction = RIGHT; }
		if (keyCode == DOWN_ARROW && snake.direction != UP) { snake.direction = DOWN; }
		if (keyCode == UP_ARROW && snake.direction != DOWN) { snake.direction = UP; }
	}
	//automatically move the snake
	if( frameCount%3 == 0){
		let nx = snake.last.x;
		let ny = snake.last.y;
		switch( snake.direction ){
			case LEFT:
				if(nx<=0) {nx = (col - nx -1 )%col;}
				else { nx = (nx - 1 )%col;}
				break;
			case RIGHT:
				nx = (nx+1)%col;
				break;
			case UP:
				if(ny<=0) {ny = (row - ny -1 )%row;}
				else { ny = (ny - 1 )%row;}
				break;
			case DOWN:
				ny = (ny + 1 )%row;			
				break;
		}

		
	//Move snake based on food/snake/empty

		//if FOOD/NUMNUM
		if( (grid.get(nx,ny) == FOOD) ||( grid.get(nx,ny) == NUMNUM ) )
		{
			tail = {x:nx, y:ny};

			if(grid.get(nx,ny) == NUMNUM) { score = score +2 ;}
			else{ score++; }

			if( score%5 == 0) {
				foodPos = setFood( NUMNUM ); 

				startTime = new Date().getTime() / 1000;

				numx = foodPos.x;
				numy = foodPos.y;

				}
			else{ setFood( FOOD ); }
		}

		// if snake has suicidal tendencies - kill the snake
		else if( grid.get(nx,ny) == SNAKE )
		{
			init();
			tail = snake.remove();
		}

		// if nothing, just move on
		else
		{
			tail = snake.remove();
			grid.set( EMPTY, tail.x, tail.y);
			tail.x = nx;
			tail.y = ny;
		}

	//Remove numnum if > 3s and set normal food item
		currTime = new Date().getTime() / 1000;

		if( grid.get(numx,numy) == NUMNUM )
		{
			if ( currTime - startTime >2 ){

				grid.set( EMPTY, numx, numy );
				setFood( FOOD );
			}
		}

	//finally set the SNAKE and GRID
		grid.set( SNAKE, tail.x, tail.y );
		snake.insert(tail.x, tail.y);
	}

}

function drawSnake() {

	console.log(width);
	let tw = width/grid.width;
	let th = height/grid.height;
	
	for (let i = 0; i < grid.width; i++) {
		for (let j = 0; j < grid.height; j++) {
			switch( grid.get(i,j)){

			case EMPTY:
				fill("#fff");
				rect(i*tw, j*th , tw,th);	
				break;
			case SNAKE:
				fill("#00F210");
				rect(i*tw, j*th , tw,th);
				break;
			case FOOD:
				image(cherry,i*tw, j*th , tw,th );
  				break;
			case NUMNUM:
				image(grapes,i*tw, j*th , tw,th );
				break;
			}
			
		}	
	}	
	fill("#000");
	// ctx.font =  "12px Arial";
	text( ( "SCORE : " + score ) , 10 , ( height - 10 ) );
}

/************************ MAIN p5 FUNCTIONS **********************/

function setup() {
	createCanvas(col*20, row*20);
	background(200,123,65);
	grid.init( EMPTY, col, row);
	score = 0;
	let sp = { x:Math.floor(col/2), y:row -1}; 
	snake.init( LEFT, sp.x, sp.y);
	grid.set( SNAKE, sp.x, sp.y );
	setFood( FOOD );
}

function draw() {

	moveSnake();
	drawSnake();

	// window.requestAnimationFrame( loop, canvas );
}