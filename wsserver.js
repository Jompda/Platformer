const { timestamp } = require('./util.js');
const { Server } = require('http');
const WebSocketServer = require('websocket').server;
const Session = require('./game/session.js');
const { timeStamp } = require('console');

/**
 * @param {Server} server The HTTP server to upgrade connections from.
 * @param {Map<String, Session>} sessions The sessions
 * @returns {WebSocketServer} The created WebSocketServer.
 */
module.exports = function startWSServer(server, sessions) {
    const ws = new WebSocketServer({ httpServer: server });

    ws.on('request', function handleRequest(request) {
        // TODO: Parse the sessionid in a more refined way.
        const session = sessions.get(decodeURIComponent(request.resourceURL.search).replace('?sessionid=', ''));
        if (!session) return request.reject(404, 'Invalid session ID!');
        const connection = request.accept(null, request.origin);
        
        // Init message.
        // TODO: player name
        const name = 'player'+session.clients.size;
        session.addClient(name, connection);

        // Map to array.
        const entries = Object.fromEntries(session.world.objects);
        const objects = [];
        Object.getOwnPropertyNames(entries).forEach(entry => objects.push(entries[entry]));

        connection.send(JSON.stringify({
            type: 'init', packet: {name, world: {
                width: session.world.width,
                height: session.world.height,
                objects
            }}
        }));
        console.log(timestamp(), name, 'connected to session', session.id, 'with', session.clients.size, 'clients');

        connection.on('message', function onmessage(msg) {
            try {
                const data = JSON.parse(msg.utf8Data);
                //console.log('Update packet:', data.packet);
                // Delegate the packet handling to the corresponding session.
                if (data.type === 'update' && data.packet) return session.handlePacket(name, connection, data.packet);
                console.log(timeStamp(), 'Unknown msg:', data);
            } catch (err) {
                if (msg.utf8Data === 'ping') return connection.send('pong');
                console.log(err);
            }
        });

        connection.on('close', function close() {
            console.log(timestamp(), name, 'disconnected from session', session.id);
            session.removeClient(name, sessions);
        });

    });

    return ws;
}
