const http = require('http')
const fs = require('fs')
const contentType = require('./content_type')
const timeclock_api = require('./timeclock_api')

const port = 8080

function readContent(filename) {
    return fs.readFileSync('content/' + filename)
}

const htmlFile = readContent('timeclock.html')
const scriptFile = readContent('timeclock.js')
const cssFile = readContent('timeclock.css')
const iconFile = readContent('favicon.ico')

const api = timeclock_api.create()

function handleRequest(request, response) {
    try {
        handleRequestThrowing(request, response)
    } catch (error) {
        console.log(error)
    } finally {
        response.end()
    }
}

function handleRequestThrowing(request, response) {
    if (request.url.startsWith('/api/')) {
        api.handleRequest(request, response)
    } else {
        handleFileRequest(request, response)
    }
}

function handleFileRequest(request, response) {
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
    }
}

http.createServer(handleRequest).listen(port)

console.log('Server is listening on port ' + port + '...')
