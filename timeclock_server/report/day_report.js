let sortByNumber = require('../../compare/compare_numbers.js').sortByNumber
let localTime = require('../local_time.js')
const {EventType} = require("../timeclock_entry");

function DayReport(date, events) {
    let sortedEvents = Array.from(events)
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
    let activities = []

    sortedEvents.forEach(event => {
        if (event.eventType === EventType.activities) {
            let newActivities = event.content
                .split(',')
                .map(activity => activity.trim())
                .filter(activity => activity.length > 0)
            activities.push(... newActivities)
        }
        lastEventTime = event.eventTime
    })

    sortedEvents.forEach(event => {
        if (event.eventType === EventType.start) {
            if (active) {
                error('Double start at ' + localTime.isoString(event.eventTime))
                addTimeSpan(event)
            }
            active = true
        } else if (event.eventType === EventType.stop) {
            if (!active) {
                error('Unexpected stop at ' + localTime.isoString(event.eventTime))
            }
            addTimeSpan(event)
            active = false
        } else if (!event.eventType === EventType.activities) {
            console.log('Ignoring event of type [' + event.eventType + ']')
            console.log(event)
        }
        lastEventTime = event.eventTime
    })
    if (active) {
        error('Missing stop after ' + localTime.isoString(lastEventTime))
    }

    function addTimeSpan(event) {
        let deltaT = event.eventTime - lastEventTime
        if (deltaT > 0) {
            sum += deltaT
            timeSpans.push(localTime.isoString(lastEventTime) + ' - ' + localTime.isoString(event.eventTime))
        } else {
            error('zero or negative deltaT at ' + localTime.isoString(event.eventTime))
        }
    }

    return {
        date: date,
        sum: sum,
        timeSpans: timeSpans,
        activities,
        errors: errors
    }
}

exports.DayReport = DayReport
