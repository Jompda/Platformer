
const listeners = {
    keyPressed: [],
    keyReleased: []
}

function keyPressed() {
    listeners.keyPressed.forEach(func => func());
    if (key === 'k') console.log('world:', JSON.stringify(world.objects, undefined, 4));
}

function keyReleased() {
    listeners.keyReleased.forEach(func => func());
}

function mousePressed() {
    // Temp: Generate random id which doesn't exist already.
    let id; do { id = Math.random(); } while (world.objects.has(id));
    world.addGridRect(new Rect({ id, x: highlight.x, y: highlight.y, w: 1, h: 1, c: color(255, 0, 0) }));
    world.sortRects(); // For render layers.
}
