const { requestHandled, timestamp, fileExists, getMimeType } = require('./util.js');
const http = require('http'), url = require('url'), fs = require('fs'), websocket = require('websocket');
const Session = require('./game/session');
const { hostname, port, root, scripts, endings } = require('./config.json');
const hostnameRegExp = new RegExp(`^${hostname}(:\\d+)?$`);
endings.unshift('');


const server = {
    /**@type {Map<String, Session>}*/
    sessions: new Map(),
    /**@type {Number}*/
    requests: 0,
    /**@type {http.Server}*/
    http: undefined,
    /**@type {websocket.server}*/
    ws: undefined,
}

// Keep in mind the security risks related to the path url etc..
server.http = http.createServer(function (request, response) {
    server.requests++;

    if (!hostnameRegExp.test(request.headers.host)) {
        response.writeHead(418, {'Content-Type': 'text/plain'});
        response.write("I'm a Teapot and I refuse the attempt to brew coffee with a teapot.");
        return response.end();
    }

    switch (request.method) {
        case 'GET':
            handleGet(request, response);
            break;
        case 'HEAD':
            handleGet(request, response);
            break;
        case 'POST':
            handlePost(request, response);
            break;
        default:
            // Not implemented
            response.writeHead(501);
            response.end();
            requestHandled(request, response, 'Not implemented');
            break;
    }
});

server.http.listen(port);
console.log(timestamp(), `Serving http on (${hostname} | ${server.http.address().address}) port ${port} ..`);

//start the WebSocket server
server.ws = require('./wsserver.js')(server.http, server.sessions);

// Stop the server.
process.on('SIGINT', () => {
    console.log(timestamp(), 'Keyboard interrupt received, exiting.');
    if (server.ws.connections.length > 0) console.log(timestamp(), 'Closed', server.ws.connections.length, 'WebSocket connections.');
    if (server.sessions.size > 0) console.log(timestamp(), 'Closed', server.sessions.size, 'sessions.');
    server.sessions.forEach(session => session.close(server.sessions));
    server.ws.closeAllConnections();
    server.http.close();
    process.exit();
});




// HTTP things..

function handleGet(request, response) {
    const requestURL = url.parse(request.url);
    const pathname = root+requestURL.pathname;

    // Use recursion to make a loop that can contain callback functions.
    let i = 0;
    autoComplete();
    function autoComplete() {
        if (i >= endings.length) return fileNotFound(response).then(
            result => requestHandled(request, response, result)
        );
        let tempPathname = pathname+endings[i++], exists = false;
        fileExists(tempPathname).then(result => {
            if (!result) return;
            exists = true;
            sendFile(tempPathname, response).then(
                result => requestHandled(request, response, result)
            );
        }).catch(console.error).finally(() => {
            if (exists) return;
            autoComplete();
        });
    }
}

/**
 * @param {Request} request 
 * @param {Response} response 
 */
function handlePost(request, response) {
    const filepath = scripts + url.parse(request.url).pathname + '.js';
    fileExists(filepath).then(result => {
        if (result) {
            const script = require(filepath);
            if (script.type === 'POST') return script.func(request, response, server);
        }
        badRequest(response).then(res => requestHandled(request, response, res));
    }).catch(console.log);
}

function fileNotFound(response) {
    return new Promise((resolve, reject) => {
        try {
            response.writeHead(404);
            response.end();
            resolve('-');
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

function badRequest(response) {
    return new Promise((resolve, reject) => {
        try {
            response.writeHead(400);
            response.end();
            resolve('-');
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

/**
 * @param {String} pathname 
 * @param {http.ServerResponse} response 
 * @returns {Promise}
 */
function sendFile(pathname, response) {
    return new Promise((resolve, reject) => {
        try {
            response.writeHead(200, {'Content-Type': getMimeType(pathname)});
            fs.readFile(pathname, (err, content) => {
                if (err) {
                    console.error(err);
                    // Internal server error.
                    response.writeHead(500);
                    response.end();
                    return reject();
                }
                response.write(content);
                response.end();
                resolve(pathname);
            });
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}
