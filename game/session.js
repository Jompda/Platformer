const World = require('./world.js');
const { connection } = require('websocket');
const { timestamp } = require('../util.js');
const Rect = require('./rect.js');
const Player = require('./player.js');
class Session {
    constructor(id) {
        this.id = id;
        this.lastTickTime = Date.now();
        /**@type {Map<String, connection>}*/
        this.clients = new Map();
        console.log(timestamp(), `Started new session: ${this.id}`);
        // Update 60 times a second. Difference 16.666... ms.
        this.tickRate = 20;
        this.interval = setInterval(() => this.tick(), 1000/this.tickRate);
        /**@type {Map<String, Object>}*/
        this.updateBuffer = new Map();

        // Init world
        this.world = new World();
        this.world.addGridRect(new Rect({ x:0, y:0, w:1, h:1, c:{ raw: true, r:255, g:0, b:0 } }));
        this.world.addGridRect(new Rect({ x:this.world.width-1, y:this.world.height-1, w:1, h:1, c:{ raw: true, r:255, g:255, b:0 } }));
    }

    addClient(name, connection) {
        const player = new Player({ id:this.world.nextRectId++, name, x:1, y:1 });
        this.world.objects.set(player.id, player);
        this.clients.set(name, connection);
    }
    removeClient(name, sessions) {
        this.clients.delete(name);
        if (this.clients.size === 0) this.close(sessions);
    }

    close(sessions) {
        clearInterval(this.interval);
        sessions.delete(this.id);
        console.log(timestamp(), 'Closed session:', this.id);
    }

    tick() {
        const now = Date.now();
        //console.log(this.id, 'diff:', now - this.lastTickTime);
        this.lastTickTime = now;

        // Send the buffer content to the clients and clear it.
        const buffer = Object.fromEntries(this.updateBuffer);
        if (this.updateBuffer.size <= 0) return;
        
        //console.log(timestamp(), 'session', this.id, 'buffer:', buffer);
        this.clients.forEach(connection => {
            try {
                connection.send(JSON.stringify({
                    type: 'update',
                    packet: buffer
                }));
            } catch (err) {console.log(err)}
        });
        this.updateBuffer.clear();
    }

    /**
     * @param {String} name
     * @param {connection} connection 
     * @param {Object} packet 
     */
    handlePacket(name, connection, packet) {
        // This just writes over any old data so the latest info is delivered.
        Object.getOwnPropertyNames(packet).forEach(propertyName => {
            // Temporary way of separating the players from each other.
            let convertedPropertyName = propertyName;
            if (propertyName === 'player') convertedPropertyName = name;
            this.updateBuffer.set(convertedPropertyName, packet[propertyName]);
        });
        
    }
}
module.exports = Session;