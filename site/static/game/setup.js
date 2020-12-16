const p5canvascontainer = document.getElementById('p5-canvas-container');
var canvas, canvasWidth = 640, canvasHeight = 360, gridSize = 32;

/**@type {Player}*/
var player;
/**@type {Camera}*/
var kamera;
var initialised = false;
/**@type {World}*/
var world;

/**@type {Entity}*/
var highlight;

var ping;
var connection, packet = {}, name;
// open the websocket connection
function connect() {
    try {
        connection = new WebSocket(window.location.href.replace('http', 'ws'));
        connection.onopen = function() {
            console.log('websocket connection is now open!');
        }
        connection.onerror = function(err) {
            console.log('websocket error:', err);
        }
        connection.onclose = function() {
            console.log('websocket connection closed!');
        }
    
        connection.onmessage = function(msg) {
            //console.log(msg.data);
            try {
                const parsed = JSON.parse(msg.data);
                switch (parsed.type) {
                    case 'update':
                        // TODO
                        //console.log('update:', /*Object.getOwnPropertyNames(*/parsed.packet/*)*/);
                        /*Object.getOwnPropertyNames(parsed.packet).forEach(property => {
                            const tempProperty = parsed.packet[property];
                            world.objects.forEach(object => {
                                if (tempProperty.id === object.id) {
                                    // Filter self.
                                    if (tempProperty.id === player.id) return;
                                    // Update the object.
                                    if (tempProperty.x) object.x = tempProperty.x;
                                    if (tempProperty.y) object.y = tempProperty.y;
                                }
                            });
                        });*/
                        break;
                    case 'init':
                        console.log('init:', parsed.packet);
                        name = parsed.packet.name;
                        world = new World(parsed.packet.world);
                        console.log('world:', world);
                        initialised = true;
                        break;
                    default:
                        break;
                }
            } catch (err) {
                if (msg.data === 'pong') return console.log('ping:', ping = Date.now()-ping);
                console.log(err);
            }
        }
    } catch (err) {console.log(err)}
}



function setup() {
    connect();
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(p5canvascontainer);
    kamera = new Camera();

    highlight = new Entity({ x:0, y:0, w:1, h:1, c:color(200, 200, 200, 255/4) });

    // Send a ping request to the server.
    if (connection.readyState === 1) try {
        ping = Date.now();
        connection.send('ping');
    } catch (err) {console.log(err);}
}

let timer = 0;

function draw() {
    if (!initialised) return;
    // Update the objects.
    world.objects.forEach(rect => {
        rect.tick();
    });

    // Send the updates to the server and clear the packet.
    if (connection.readyState === 1) try {
        connection.send(JSON.stringify({
            type: 'update',
            packet
        }));
        packet = {};
    } catch (err) {console.log(err);}

    // Swap test.
    timer++;
    if (timer >= 60) {
        world.swapRects(0, 0, 2, 0);
        timer = 0;
    }

    // Render the frame
    background(200);
    push();
    kamera.tick();
    //rectMode(CENTER);
    strokeWeight(0);

    // Draw the background layer.
    /*const testRect1 = new Rect(world.gridSize, 0, world.gridSize, world.gridSize, color(255/2, 0, 0));
    //tint(255/2, 255/2, 255/2);
    testRect1.draw();>*/

    
    // Draw the center layer.
    world.objects.forEach(rect => {
        push(); rect.draw(); pop();
    });

    /*const testRect2 = new Rect(0, 0, world.gridSize, world.gridSize);
    fill(255, 0, 0);
    testRect2.draw();*/

    
    {   // Mouse grid highlighter.
        highlight.x = Math.floor(kamera.getMouseX());
        highlight.y = Math.floor(kamera.getMouseY());
        //console.log(highlight.x, highlight.y, world.getRect(highlight.x, highlight.y));
        push();
        strokeWeight(2);
        stroke(255);
        highlight.draw();
        pop();
    }

    // Draw the front layer.
    pop();

    // Draw HUD.

}
