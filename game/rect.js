
class Rect {
    constructor({ id, x, y, w, h, c, hp = 1 }) {
        this.id = id;
        this.type = this.constructor.name;
        this.x = x; this.y = y;
        this.w = w; this.h = h;
        this.c = c;
        this.hp = hp;
    }

    /**
     * Checks for AABB collision.
     * @param {Rect} rect The other rectangle.
     * @returns {Boolean} Collision.
     */
    intersectsAABB(rect) {
        return this.x < rect.x + rect.w &&
            this.x + this.w > rect.x &&
            this.y < rect.y + rect.h &&
            this.y + this.h > rect.y;
    }
}
module.exports = Rect;
