
class Player extends Entity {
    constructor({ id, name, x, y, w=.6, h=.6, c=color(0,0,255), hp=1 }) {
        super({ id, x, y, w, h, c, hp });
        this.name = name;
        this.speed = 0.1;
        this.jumpPower = 0.2;

        // The functions must be wrapped in a function in order to reference the instance.
        listeners.keyPressed.push(() => this.keyPressed());
    }

    tick() {
        const oldX = this.x, oldY = this.y;

        // Apply player movement and physics.
        if (this.id === player.id) {
            const dir = this.calcDirection();
            // Movement along x-axis.
            const walkpower = dir.x*this.speed;
            this.sx += walkpower;
            if (Math.abs(this.sx) > Math.abs(walkpower)) this.sx = walkpower;
        }
        

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
            y: this.y
        }
    }

    ///// Movement
    calcDirection() {
        let x = 0, y = 0;
        if (keyIsDown(87)) --y; // W
        if (keyIsDown(65)) --x; // A
        if (keyIsDown(83)) ++y; // S
        if (keyIsDown(68)) ++x; // D
        return { x, y };
    }

    jump() {
        // Has to be on ground in order to perform a normal jump.
        if (this.falling) return; // double jump?
        this.sy = -this.jumpPower;
    }

    keyPressed() {
        // space
        // For some reason 'this' variable is undefined.
        if (keyCode === 32) this.jump();
    }
}
