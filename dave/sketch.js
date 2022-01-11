//31. https://digitalsynopsis.com/design/beautiful-color-gradient-palettes/
let grid = new Grid();
let player = new Player(30,30);
function setup() {
  createCanvas(500, 500);
	grid.initGrid();
	player.initPlayer(grid);
	// frameRate(7);
}
function draw() {
  background(255);
	grid.drawGrid();
	player.movePlayer(grid);
	player.drawPlayer();
}
