class Snake {
  constructor() {
    this.direction = null;
    this.last = null;
    this._queue = null;
  }

  init(d, x, y) {
    this.direction = d;
    this._queue = [];
    this.insert(x, y);
  }

  insert(x, y) {
    this._queue.unshift({ x: x, y: y });
    this.last = this._queue[0];
  }

  remove() {
    return this._queue.pop();
  }
}
