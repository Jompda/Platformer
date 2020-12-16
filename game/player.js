
class Player extends require('./entity') {
    constructor({ id, name, x, y, w=.6, h=.6, c={raw:true, r:0, g:0, b:255}, hp=1 }) {
        super({ id, x, y, w, h, c, hp });
        this.name = name;
        this.speed = 0.1;
        this.jumpPower = 0.2;
    }

    tick() {
        const oldX = this.x, oldY = this.y;
        

        // Gravity. // TODO: wtf is this? gravity^2?????
        this.sy += world.gravity**2;

        this.x += this.sx;
        this.y += this.sy;

        
        // Intersection detection and handling.
        this.falling = true;
        this.handleIntersections();
        
        // Temp testing packets.
        if (oldX !== this.x || oldY !== this.y) packet.player = {
            id: this.id,
            x: this.x,
            y: this.y,
            sx: this.sx,
            sy: this.sy
        }
    }

    jump() {
        // Has to be on ground in order to perform a normal jump.
        if (this.falling) return; // double jump?
        this.sy = -this.jumpPower;
    }
}
module.exports = Player;