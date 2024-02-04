const zoned_time = require('./zoned_time')

const EventType = {start: 'start', stop: 'stop', activities: 'activities'}

function TimeclockEntry(eventType, eventTime, content) {
    checkValidity(eventType, eventTime, content)
    const value = {
        eventType,
        eventTime,
        content
    }
    return {
        value: value,
        toJson: function () {
            return JSON.stringify(value)
        },
        toCsvLine: function () {
            return eventType + ';' + zoned_time.isoTimestamp(eventTime) + ';' + content;
        }
    }
}

function fromJson(source) {
    let rawValue = JSON.parse(source)
    return TimeclockEntry(rawValue.eventType, rawValue.eventTime, rawValue.projectId)
}

const csvLine = /^(start|stop|activities);(?:([+-]?\d+)|([^;]+));(.+)$/

function fromCsv(source) {
    let match = csvLine.exec(source)
    if (!match) {
        throw new RangeError('Invalid CSV entry: [' + source + ']')
    }
    let eventType = match[1]
    let eventTime = (match[2] ? parseInt(match[2]) : zoned_time.parseIsoTimestamp(match[3]))
    let projectId = match[4]
    return TimeclockEntry(eventType, eventTime, projectId)
}

function forActivities(activities) {
    return TimeclockEntry(EventType.activities, Math.floor(Date.now() / 1000), activities)
}

const validEventTypes = [EventType.start, EventType.stop, EventType.activities]

function checkValidity(eventType, eventTime, content) {
    if (validEventTypes.indexOf(eventType) < 0) {
        throw new RangeError('Invalid event type: [' + eventType + ']')
    }
    if (!Number.isInteger(eventTime)) {
        throw new RangeError('Invalid event time: [' + eventTime + ']')
    }
    if (typeof content !== 'string') {
        throw new RangeError('Invalid contentD: [' + content + ']')
    }
}

exports.EventType = EventType
exports.TimeclockEntry = TimeclockEntry
exports.fromJson = fromJson
exports.fromCsv = fromCsv
exports.forActivities = forActivities
