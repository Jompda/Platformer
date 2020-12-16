
class Entity extends require('./rect.js') {
    constructor({ id, x, y, w, h, c, hp }) {
        super({ id, x, y, w, h, c, hp });
        this.sx = 0;
        this.sy = 0;
        this.falling = true;
    }

    handleIntersections() {
        const intersections = this.getIntersections();
        if (intersections.length > 0) {
            intersections.forEach(rect => this.resolveIntersection(rect));
        }
        // Also resolving a collision can lead to another collision happening.
        this.boundaries();
    }

    getIntersections() {
        const self = this;
        const coords = this.getFlooredCoords();
        const intersections = [];

        add(coords.x, coords.y);
        add(coords.x+1, coords.y);
        add(coords.x, coords.y+1);
        add(coords.x+1, coords.y+1);
        // TODO: Check larger area if entity size is greater than 1*1.

        // Check also collisions with other entities.
        return intersections;

        function add(x, y) {
            const other = world.getRect(x, y);
            if (!other) return;
            if (self.intersectsAABB(other)) intersections.push(other);
        }
    }

    resolveIntersection(rect) {
        // TODO: Handle the intersection.
        console.log(`There's an intersection happening..`);
        // temp
        this.falling = false;
    }

    boundaries() {
        if (this.x < 0) {
            this.x = 0;
            this.sx = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.sy = 0;
        }
        if (this.x+this.w > world.width) {
            this.x = world.width - this.w;
            this.sx = 0;
        }
        if (this.y+this.h > world.height) {
            this.y = world.height - this.h;
            this.sy = 0;
            this.falling = false;
        }
    }

    getFlooredCoords() {
        return { x: Math.floor(this.x), y: Math.floor(this.y) };
    }
}
module.exports = Entity;
