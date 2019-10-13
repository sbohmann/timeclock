const http = require('http')
const fs = require('fs')
const contentType = require('./content_type.js')
const timeclock_api = require('./timeclock_server/timeclock_api.js')

const port = 8080

function readContent(filename) {
    return fs.readFileSync('content/' + filename)
}

const htmlFile = readContent('timeclock.html')
const scriptFile = readContent('timeclock.js')
const cssFile = readContent('timeclock.css')
const iconFile = readContent('favicon.ico')

const api = timeclock_api.TimeclockApi()

function handleRequest(request, response) {
    try {
        handleRequestThrowing(request, response)
    } catch (error) {
        console.log(error)
        response.statusCode = 500
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
