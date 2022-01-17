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
