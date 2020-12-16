const fs = require('fs');

function requestHandled(request, response, result) {
    const statusColor = getStatusColor(response.statusCode);
    console.log(timestamp() + ' ' +
        request.connection.remoteAddress + ' -- ' +
        request.method + ' ' +
        request.url + ' ' +
        'HTTP/' + request.httpVersion + ' - ' +
        statusColor +
        response.statusCode + ' ' +
        response.statusMessage + cmdColors.Reset + ' - ' +
        result);
}

function fileExists(pathname) {
    return new Promise((resolve, reject) => {
        try {
            fs.stat(pathname, (err, stat) => {
                if (err || stat.isDirectory()) return resolve(false);
                resolve(stat);
            });
        } catch (err) {
            reject();
        }
    });
}

const mimetypes = require('./mimetypes.json');
function getMimeType(/**@type {String}*/pathname) {
    const extension = pathname.substring(pathname.lastIndexOf('.')+1);
    for (let i = 0; i < mimetypes.length; i++)
        if (mimetypes[i][0] === extension) return mimetypes[i][1];
    return 'text/plain';
}

const cmdColors = require('./cmdcolors.js');
const ranges = [
    [100, cmdColors.Yellow], // Informational
    [200, cmdColors.Green], // Successful
    [300, cmdColors.Blue], // Redirect
    [400, cmdColors.Red], // Error
];
function getStatusColor(code) {
    for (let i = ranges.length-1; i >= 0; i--)
        if (code >= ranges[i][0]) return ranges[i][1];
}

function timestamp(a = '[', b = ':', c = ']') {
    const d = new Date(),
        pad = (n) => String(n).padStart(2, '0');
    return '\x1b[33m' + a + pad(d.getHours()) + b + pad(d.getMinutes()) + b + pad(d.getSeconds()) + c + '\x1b[0m';
}

module.exports = {
    requestHandled,
    timestamp,
    fileExists,
    getMimeType,
    getStatusColor
}