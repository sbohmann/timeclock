timeclockEntry = require('./timeclock_entry.js')

exports.TimeclockApi = function (projects, storage) {
    let onReadyHandler = null

    storage.onReady(() => {
        if (onReadyHandler) {
            onReadyHandler()
        }
    })

    function handleRequest(request, response) {
        let path = getPath(request)
        switch (path) {
            case 'report':
                handleReport(request, response)
                break
            case 'projects':
                handleProjectsRequest(request, response)
                break
            default:
                throw new RangeError('Illegal api path: [' + path + ']')
        }
    }

    function getPath(request) {
        const prefix = '/api/'
        if (request.url.startsWith(prefix)) {
            return request.url.substr(prefix.length)
        } else {
            throw new RangeError('Illegal api url: [' + request.url + ']')
        }
    }

    function handleReport(request, response) {
        if (request.method !== 'POST') {
            throw new RangeError('Unsupported method for /api/report: ' + request.method)
        }
        let body = ''
        request.on('data', data => {
            body += data.toString()
        })
        request.on('end', () => {
            processReport(body)
            response.end()
        })
    }

    function processReport(body) {
        console.log(body)
        let entry = timeclockEntry.fromJson(body)
        storage.addEntry(entry)
    }

    function handleProjectsRequest(request, response) {
        if (request.method !== 'GET') {
            throw new RangeError('Unsupported method for /api/projects: ' + request.method)
        }
        response.write(JSON.stringify(projects))
        response.end()
    }

    return {
        handleRequest: handleRequest,
        onReady: handler => {
            onReadyHandler = handler
        }
    }
}
