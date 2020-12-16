
class World {
    constructor({ width = 20, height = 12, gravity = 0.1, objects }) {
        // Spelunky 2 height 11
        this.width = width;
        this.height = height;
        /**@type {Map<Number, Rect>}*/
        this.objects = new Map();
        /**@type {Array<Array<Rect>>}*/
        this.grid = [];
        for (let i = 0; i < this.width; i++)
            this.grid[i] = Array(/*this.height*/);
        this.gravity = gravity;
        if (objects) this.loadObjects(objects);
    }

    loadObjects(/**@type {Array<Rect>}*/objects) {
        objects.forEach(objData => {
            // TODO: A function that figures out the type and uses the correct class that extends Rect.
            // If object type is Entity, don't add to the grid, only push to the objects.
            console.log('Loaded object! type:', objData.type, 'id:', objData.id);
            if (objData.name === name) {
                player = new Player(objData);
                this.objects.set(player.id, player);
                return;
            }
            this.addGridRect(new Rect(objData));
        });
    }

    /**
     * 
     * @param {Rect} rect 
     * @returns {Boolean}
     */
    addGridRect(rect) {
        const temp = this.getRect(rect.x, rect.y);
        if (temp || temp === false) return false;
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

    sortRects() {
        // Move the Players to the end of the array.
        /*this.objects.sort((a,b) => {
            const ap = a instanceof Player;
            const bp = b instanceof Player;
            if (ap && bp) return 0;
            return ap ? 1 : -1;
        });*/

        // TEMP: Move the Player to the end of the array.
        // Only works with one player.
        /*this.objects.splice(this.objects.indexOf(player), 1);
        this.objects.push(player);*/
    }

    inBounds(x, y) {
        return 0 <= x && x <= this.width-1 && 0 <= y && y <= this.height-1;
    }
}
