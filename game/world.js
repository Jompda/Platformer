
class World {
    constructor() {
        this.width = 20;
        this.height = 12;
        /**@type {Map<Number, Rect>}*/
        this.objects = new Map();
        /**@type {Array<Array<Rect>>}*/
        this.grid = [];
        for (let i = 0; i < this.width; i++)
            this.grid[i] = Array(/*this.height*/);
        this.gravity = 0.1;
        this.nextRectId = 0;
    }

    /**
     * 
     * @param {Rect} rect 
     * @returns {Boolean}
     */
    addGridRect(rect) {
        const temp = this.getRect(rect.x, rect.y);
        if (temp || temp === false) return false;
        rect.id = this.nextRectId++;
        this.objects.set(rect.id, rect);
        this.grid[Math.floor(rect.x)][Math.floor(rect.y)] = rect;
        return true;
    }

    /**
     * Swaps the Rects and their coords.
     * @param {Number} oldX 
     * @param {Number} oldY 
     * @param {Number} newX 
     * @param {Number} newY 
     * @return {Boolean} Operation succession.
     */
    swapRects(oldX, oldY, newX, newY) {
        if (!this.inBounds(oldX, oldY) || !this.inBounds(newX, newY)) return false;
        const oldRect = this.grid[oldX][oldY];
        this.grid[oldX][oldY] = this.grid[newX][newY];
        const newRect = this.grid[newX][newY];
        this.grid[newX][newY] = oldRect;
        if (oldRect) { oldRect.x = newX; oldRect.y = newY; }
        if (newRect) { newRect.x = oldX; newRect.y = oldY; }
        return true;
    }

    /**
     * Gets the rect from the grid at the specifieed coords.
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Rect|undefined|false} False if out of bounds.
     */
    getRect(x, y) {
        if (!this.inBounds(x, y)) return false;
        return this.grid[x][y];
    }

    inBounds(x, y) {
        return 0 <= x && x <= this.width-1 && 0 <= y && y <= this.height-1;
    }
}
module.exports = World;