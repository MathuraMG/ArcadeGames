class Grid {
	constructor() {
		this._grid = [];
		this.r = 20;
		this.c = 20;
		this.size = 25;
	}
	initGrid() {
		for(let i =0;i<this.r;i++) {
			for(let j = 0;j<this.c;j++) {
				this._grid[i*this.c + j] = parseInt(GRID1[i*this.c + j]);
			}
		}
	}
	updateGrid(x,y,val) {
		this._grid[y*this.c+x] = val;
	}
	getGridValue(x,y) {
		// console.log("getting grid value for: ", floor(x),floor(y), floor(y*this.c+x));
		return(this._grid[floor(y)*this.c+floor(x)]);
	}
	drawGrid() {
		for(let i =0;i<this.r;i++) {
			for(let j = 0;j<this.c;j++) {
				stroke(255);
				strokeWeight(2);
				switch(this._grid[i*this.c + j]) {
					case 0: //plain wall
						fill("#f5cec7");
						break;
					case 1: //wall
						fill("#e79796");
						break;
					case 2: //player
						fill("#c6c096");
						break;
					default:
						break;
				}
				rect(j*this.size,i*this.size, this.size,this.size,5);
			}
		}
	}
}
class Player {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.vel = 3;
		this.playerSize = 30;
		this.isPlayerFalling = true;
	}
	getGridValue(grid,x,y) {
		let xGrid = x/grid.size;
		let yGrid = y/grid.size;
		return(grid.getGridValue(xGrid, yGrid));
	}
	initPlayer(grid) {
		rect(this.x, this.y, this.playerSize, this.playerSize);
	}
	movePlayer(grid) {
		let isWallBelow = this.getGridValue(grid,this.x, this.y+this.playerSize)==1 || this.getGridValue(grid,this.x+this.playerSize, this.y+this.playerSize)==1
		if(!isWallBelow) {
			this.y += this.vel;
		}
		if(keyIsPressed)
		{
			switch(keyCode) {
				case UP_ARROW:
					this.isPlayerFalling = true;
					let isWallOnTop = this.getGridValue(grid,this.x, this.y-1)==1;
					if(this.y>0 && !isWallOnTop)
						this.y -= 2*this.vel;
					break;
				case LEFT_ARROW:
					if(this.x>0)
						this.x -= this.vel;
					break;
				case RIGHT_ARROW:
					if(this.x < width-this.playerSize) 
						this.x += this.vel;
					break;
				default:
					break;
			}
		}
		// grid.updateGrid(this.x, this.y, 2);
	}
	drawPlayer() {
		rect(this.x, this.y, 30, 30);
	}
}
