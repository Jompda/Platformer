const Session = require('../../../game/session.js');
const { requestHandled } = require('../../../util.js');

/**
 * @param {Request} request 
 * @param {Response} response 
 * @param {*} server 
 */
function createSession(request, response, server) {
    let payload = '';
    request.on('data', chunk => {
        payload += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        // Create a new session if a session by the name doesn't already exist.
        // TODO: Parse the sessionid in a more refined way.
        const sessionid = decodeURIComponent(payload).replace('sessionid=', '');
        if (!server.sessions.has(sessionid)) server.sessions.set(sessionid, new Session(sessionid));

        // Redirect into the game session.
        response.writeHead(303, {Location: '/game/?sessionid='+sessionid});
        response.end();
        requestHandled(request, response, 'payload: ' + payload);
    });
}
module.exports = {
    type: 'POST',
    func: createSession
};