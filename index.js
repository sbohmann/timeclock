const http = require('http')
const fs = require('fs')
const Base64 = require('js-base64').Base64;

const contentType = require('./content_type.js')
const timeclock_api = require('./timeclock_server/timeclock_api.js')
const storedCredentials = require('./stored_credentials.js')

const port = 8080

const credentials = storedCredentials.readFromFile()
const authorizationToken = credentials.user + ':' + credentials.password

function readContent(filename) {
    return fs.readFileSync('content/' + filename)
}

const htmlFile = readContent('timeclock.html')
const scriptFile = readContent('timeclock.js')
const cssFile = readContent('timeclock.css')
const iconFile = readContent('favicon.ico')

const api = timeclock_api.TimeclockApi()

function handleRequest(request, response) {
    if (authorize(request, response)) {
        try {
            handleRequestThrowing(request, response)
        } catch (error) {
            console.log(error)
            response.statusCode = 500
            response.end()
        }
    }
}

function authorize(request, response) {
    let cookieList = request.headers['cookie']
    if (cookieList) {
        for (let cookie of cookieList.split(';')) {
            let parts = cookie.split('=')
            if (parts.length === 2) {
                let name = parts[0].trim()
                let value = parts[1].trim()
                if (name === 'authorization' && value === authorizationToken) {
                    return true;
                }
            } else {
                console.log('Received invalid cookie [' + cookie + ']')
            }
        }
    }
    let authorization = request.headers['authorization']
    if (authorization) {
        let match = /^Basic ([A-Za-z0-9+\/]*=*)$/.exec(authorization)
        if (match) {
            let value = Base64.decode(match[1])
            if (value === authorizationToken) {
                response.setHeader('Set-Cookie', 'authorization=' + authorizationToken)
                return true;
            }
        }
    }
    triggerBasicAuth(response)
    return false
}

function triggerBasicAuth(response) {
    response.statusCode = 401
    response.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm", charset="UTF-8"')
    response.end()
}

function handleRequestThrowing(request, response) {
    if (request.url.startsWith('/api/')) {
        api.handleRequest(request, response)
    } else {
        handleFileRequest(request, response)
    }
}

function handleFileRequest(request, response) {
    if (request.method === 'GET') {
        handleFileGetRequest(request, response)
    } else {
        response.statusCode = 405
    }
    response.end()
}

function handleFileGetRequest(request, response) {
    switch (request.url) {
        case '/timeclock.js':
            contentType.js(response)
            response.write(scriptFile)
            break
        case '/timeclock.css':
            contentType.css(response)
            response.write(cssFile)
            break
        case '/':
            contentType.html(response)
            response.write(htmlFile)
            break
        case '/favicon.ico':
            contentType.icon(response)
            response.write(iconFile)
            break
        default:
            response.statusCode = 404
            contentType.text(response)
            response.write('Not found.')
    }
}

api.onReady(() => {
    http.createServer(handleRequest).listen(port)
})

console.log('Server is listening on port ' + port + '...')
