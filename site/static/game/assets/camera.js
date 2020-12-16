
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = width/gridSize;
        this.h = height/gridSize;
        this.exceedLimit = 2;
        this.translateX = 0;
        this.translateY = 0;
    }

    tick() {
        // TODO: Camera trailing the player.
        this.x = player.x+player.w/2;
        this.y = player.y+player.h/2;
        this.boundaries();
        this.focusCamera(this.x, this.y);
    }

    /**
     * Prevents the camera from over exceeding the boundaries of the map.
     */
    boundaries() {
        if (this.x - this.w/2 < -this.exceedLimit) this.x = this.w/2 - this.exceedLimit;
        if (this.x + this.w/2 > world.width+this.exceedLimit) this.x = world.width+this.exceedLimit - this.w/2;
        if (this.y - this.h/2 < -this.exceedLimit) this.y = this.h/2 - this.exceedLimit;
        if (this.y + this.h/2 > world.height+this.exceedLimit) this.y = world.height+this.exceedLimit - this.h/2;
    }

    focusCamera(x, y) {
        this.translateX = this.getScreenX(this.x)-width/2;
        this.translateY = this.getScreenY(this.y)-height/2;
        translate(-this.translateX, -this.translateY);
    }
    getScreenX(x) {
        return x*gridSize;
    }
    getScreenY(y) {
        return y*gridSize;
    }

    getMouseX() {
        return (mouseX + this.translateX) / gridSize;
    }
    getMouseY() {
        return (mouseY + this.translateY) / gridSize;
    }
    getMouseCoords() {
        return { x: this.getMouseX(), y: this.getMouseY() };
    }

}
