const formidable = require("formidable");
const contentType = require("../content_type");
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
            case 'activities':
                handleActivitiesRequest(request, response)
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

    function handleActivitiesRequest(request, response) {
        if (request.method !== 'POST') {
            throw new RangeError('Unsupported method for /api/activities: ' + request.method)
        }
        let form = new formidable.IncomingForm()
        form.parse(request, function (error, fields, files) {
            console.log('err:', error)
            console.log('fields:', fields)
            console.log('files:', files)
            if (error) {
                console.log("Activities parsing error")
                response.statusCode = 400
                contentType.text(response)
                response.write("Activities error: " + error)
                response.end()
                return
            }
            let activities = (fields.content || "")
                .trim()
                .replace(/;/g, '/')
                .replace(/[\n\r]/g, ',')
            if (activities.length === 0) {
                console.log("Activities empty")
                response.statusCode = 400
                contentType.text(response)
                response.write("Activities empty: " + error)
                response.end()
                return
            }
            storage.addEntry(timeclockEntry.forActivities(activities))
            response.writeHead(302, {'Location': '/'})
            response.end()
        })
    }

    return {
        handleRequest,
        onReady: handler => {
            onReadyHandler = handler
        }
    }
}
