class Grid {
  constructor() {
    this.width = null;
    this.height = null;
    this._grid = null;
  }

  init(d, c, r) {
    this.width = col;
    this.height = row;

    this._grid = [];

    for (let i = 0; i < col; i++) {
      this._grid.push([]);
      for (let j = 0; j < row; j++) {
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
