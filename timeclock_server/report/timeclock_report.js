const contentType = require('../../content_type.js')
const Days = require('./days.js').Days

function Report(storage) {
    return {
        handleRequest: (request, response) => {
            const events = storage.entries().filter(entry => entry.projectId === 'C3')
            let content = ''
            let days = Days()
            for (let event of events) {
                days.consume(event)
            }
            contentType.html(response)
            response.write(content)
            response.end()
        }
    }
}

exports.Report = Report
