const contentType = require('../../content_type.js')
const localTime = require('../local_time.js')
const Days = require('./days.js').Days

function Report(storage) {
    return {
        handleRequest: (request, response) => {
            const entries = storage.entries().filter(entry => entry.projectId === 'C3')
            let content = ''
            let days = Days()
            for (let entry of entries) {

                addTime(date, localTime)
            }
            contentType.html(response)
            response.write(result)
            response.end()
        }
    }
}

exports.Report = Report
