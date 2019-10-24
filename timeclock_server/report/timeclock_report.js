const contentType = require('../../content_type.js')
const localTime = require('../local_time.js')
const Days = require('./days.js').Days

function Report(storage) {
    return {
        handleRequest: (request, response) => {
            const events = storage.entries().filter(entry => entry.projectId === 'C3')
            let content = ''
            let days = Days()
            for (let event of events) {
                console.log('Processing event [' + event + ']')
                days.consume(event)
            }
            contentType.html(response)
            response.write(result)
            response.end()
        }
    }
}

exports.Report = Report
