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
                content += report.date + ';' +
                    rounded(report.sum / 3600) + ';' +
                    roundedToQuarterHours(report.sum / 3600) +
                    (roundedToQuarterHours(report.sum / 3600) / 24) + '\n'
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

function rounded(number) {
    number *= 100
    number = Math.round(number)
    number /= 100
    return number.toFixed(2)
}

function roundedToQuarterHours(number) {
    number *= 4
    number = Math.round(number)
    number /= 4
    return number.toFixed(2)
}

exports.Report = Report
