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