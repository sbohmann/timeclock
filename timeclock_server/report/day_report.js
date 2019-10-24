let sortByNumber = require('../../compare/compare_numbers.js').sortByNumber
let localTime = require('../local_time.js')

function DayReport (date, events) {
    let sortedEvents = new Array(events)
    sortByNumber(sortedEvents, event => event.eventTime)

    let errors = []
    function error(message) {
        errors.push(message)
        console.log(message)
    }

    let active = false
    let sum = 0
    let timeSpans = []
    let lastEventTime = null
    sortedEvents.forEach(event => {
        if (event.eventType === 'start') {
            if (active) {
                error('Double start at ' + localTime.isoString(event.eventTime))
            }
            let deltaT = event.eventTime - lastEventTime
            if (deltaT > 0) {
                sum += deltaT
                timeSpans.push(localTime.isoString(lastEventTime) + ' - ' + localTime.isoString(event.eventTime))
            } else {
                error('zero or negative deltaT at ' + localTime.isoString(event.eventTime))
            }
            active = true
        } else if (event.eventType === 'stop') {
            if (!active) {
                error('Unexpected stop at ' + localTime.isoString(event.eventTime))
            }
            active = false
        } else {
            // console.log('Ignoring event of type [' + event.eventType + ']')
            // console.log(event)
        }
        lastEventTime = event.eventTime
    })
    if (active) {
        error('Missing stop after ' + localTime.isoString(lastEventTime))
    }

    return {
        date: date,
        sum: sum,
        timeSpans: timeSpans,
        errors: errors
    }
}

exports.DayReport = DayReport
