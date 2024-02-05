const contentType = require('../../content_type.js')
const {EventType} = require("../timeclock_entry");
const Days = require('./days.js').Days

function Report(storage) {
    return {
        handleRequest: (request, response) => {
            const project = getProject(request)
            const events = storage
                .entries()
                .filter(entry =>
                    entry.content === project ||
                    entry.eventType === EventType.activities)
            let content = ''
            let days = Days()
            for (let event of events) {
                days.consume(event)
            }
            let dayReports = days.createReports()
            let errorsReported = false
            for (let report of dayReports) {
                if (report.errors) {
                    for (let error of report.errors) {
                        content += error + '\n'
                    }
                    errorsReported = true
                }
            }
            if (errorsReported) {
                content += '\n'
            }
            let relevantDayReports = dayReports.filter(
                dayReport => dayReport.sum !== 0 ||
                dayReport.timeSpans.length > 0);
            for (let report of relevantDayReports) {
                content += report.date + ';' +
                    rounded(report.sum / 3600) + ';' +
                    roundedToQuarterHours(report.sum / 3600) + ';' +
                    (roundedToQuarterHours(report.sum / 3600) / 24)
                if (report.activities.length > 0) {
                    content += ';' + report.activities.join(', ')
                }
                content += '\n'
            }
            content += '\n'
            for (let report of relevantDayReports) {
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

function getProject(request) {
    const prefix = '/report/'
    if (request.url.startsWith(prefix)) {
        return request.url.substring(prefix.length)
    } else {
        throw new RangeError('Illegal api url: [' + request.url + ']')
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
