const contentType = require('../../content_type.js')
const Days = require('./days.js').Days

function Report(storage) {
    return {
        handleRequest: (request, response) => {
            const events = storage.entries().filter(entry => entry.projectId === 'C3')
            let content = ''
            let days = Days()
            for (let event of events) {
                days
                    .consume(event)
            }
            let dayReports = days.createReport()
            for (let report of dayReports) {
                content += report.date + ';' + report.sum + '\n'
            }
            content += '\n'
            for (let report of dayReports) {
                content += report.date + ':\n'
                for (let timeSpan of report.timeSpans) {
                    content += timeSpan + '\n'
                }
            }
            contentType.text(response)
            response.write(content)
            response.end()
        }
    }
}

exports.Report = Report
