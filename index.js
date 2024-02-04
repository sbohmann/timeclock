const http = require('http')
const fs = require('fs')
const path = require('path')
const Base64 = require('js-base64').Base64
const formidable = require('formidable')

const contentType = require('./content_type.js')
const timeclockStorage = require('./timeclock_server/timeclock_storage.js')
const timeclockApi = require('./timeclock_server/timeclock_api.js')
const timeclockTimeList = require('./timeclock_server/timeclock_timelist.js')
const timeclockReport = require('./timeclock_server/report/timeclock_report.js')
const storedCredentials = require('./stored_credentials.js')
const storedProjects = require('./stored_projects.js')

const CookieMaxAgeSeconds = 30 * 86400

const port = (() => {
    if (process.argv.length !== 3) {
        throw new RangeError('Syntax: node index.js <port>')
    }
    return process.argv[2]
})()

const credentials = storedCredentials.readFromFile()
const authorizationToken = credentials.user + ':' + credentials.password

const projects = storedProjects.readFromFile()

function readContent(filename) {
    return fs.readFileSync('content/' + filename)
}

const htmlFile = readContent('timeclock.html')
const scriptFile = readContent('timeclock.js')
const cssFile = readContent('timeclock.css')
const iconFile = readContent('favicon.ico')
const svgIconFile = readContent('icon.svg')
const pngIconFile = readContent('icon.png')
const manifestFile = readContent('manifest.json')

const storage = timeclockStorage.Storage()
const api = timeclockApi.TimeclockApi(projects, storage)
const timeList = timeclockTimeList.TimeList(storage)
const report = timeclockReport.Report(storage)

function handleRequest(request, response) {
    if (authorize(request, response)) {
        try {
            handleRequestThrowing(request, response)
        } catch (error) {
            console.log(error)
            response.statusCode = 500
            contentType.text(response)
            response.write('Internal server error.')
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
                    return true
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
                response.setHeader('Set-Cookie', 'authorization=' + authorizationToken + ';max-age=' + CookieMaxAgeSeconds)
                return true
            }
        }
    }
    triggerBasicAuth(response)
    response.end()
    return false
}

function triggerBasicAuth(response) {
    // console.log("Triggering authorization...")
    response.statusCode = 401
    response.setHeader('WWW-Authenticate', 'Basic realm="User Visible Realm", charset="UTF-8"')
}

function handleRequestThrowing(request, response) {
    switch (request.method) {
        case 'GET':
            handleGetRequest(request, response)
            break
        case 'POST':
            handlePostRequest(request, response)
            break
        default:
            response.statusCode = 405
            response.end()
    }
}

function handleGetRequest(request, response) {
    if (request.url.startsWith('/api/')) {
        api.handleRequest(request, response)
    } else if (request.url === '/list') {
        timeList.handleRequest(request, response)
    } else if (request.url.startsWith('/report/')) {
        report.handleRequest(request, response)
    } else if (request.url === '/raw_data.csv') {
        handleRawDataRequest(request, response)
    } else {
        handleFileRequest(request, response)
    }
    response.end()
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
        case '/icon.svg':
            contentType.svg(response)
            response.write(svgIconFile)
            break
        case '/icon.png':
            contentType.png(response)
            response.write(pngIconFile)
            break
        case '/manifest.json':
            contentType.manifest(response)
            response.write(manifestFile)
            break
        default:
            response.statusCode = 404
            contentType.text(response)
            response.write('Not found.')
    }
}

function handlePostRequest(request, response) {
    if (request.url.startsWith('/api/')) {
        api.handleRequest(request, response)
    } else if (request.url === '/upload') {
        handleUpload(request, response)
    } else {
        response.statusCode = 404
        contentType.text(response)
        response.write('Not found.')
    }
}

function handleUpload(request, response) {
    let uploads_directory = 'uploads'
    if (!fs.existsSync(uploads_directory)) {
        fs.mkdirSync(uploads_directory)
    }
    let form = new formidable.IncomingForm()
    form.parse(request, function (error, fields, files) {
        console.log('err:', error)
        console.log('fields:', fields)
        console.log('files:', files)
        if (error) {
            console.log("Upload parsing error")
            response.statusCode = 400
            contentType.text(response)
            response.write("Upload error: " + error)
            response.end()
            return
        }
        saveUploadFile(files.content, response)
    })
}

function saveUploadFile(content, response) {
    console.log(content.filepath)
    let newPath = path.join('./uploads/', content.originalFilename)
    if (fs.existsSync(newPath)) {
        console.log("File exists")
        response.statusCode = 409
        contentType.text(response)
        response.write("File exists [" + newPath + "]")
        response.end()
        return
    }
    fs.rename(content.filepath, newPath, function (error) {
        if (error) {
            console.log("Rename failed")
            response.statusCode = 500
            contentType.text(response)
            response.write("Failed to move file to [" + newPath + "]")
            response.end()
            return
        }
        console.log("Reporting success")
        response.statusCode = 200
        contentType.text(response)
        response.write("Successfully uploaded file [" + newPath + "]")
        response.end()
    })
}

function handleRawDataRequest(request, response) {
    contentType.csv(response)
    response.write(storage.readRawData())
}

const options = {
    // key: fs.readFileSync('certificate/timeclock.key'),
    // cert: fs.readFileSync('certificate/timeclock.pem')
}

api.onReady(() => {
    http.createServer(options, handleRequest).listen(port)
})

console.log('Server is listening on port ' + port + '...')
