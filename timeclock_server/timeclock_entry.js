const EventType = {start: 'start', stop: 'stop'}

function TimeclockEntry(eventType, eventTime, projectId) {
    checkValidity(eventType, eventTime, projectId)
    const value = {
        eventType: eventType,
        eventTime: eventTime,
        projectId: projectId
    }
    return {
    	value: value,
        toJson: function () {
            return JSON.stringify(value)
        },
        toCsvLine: function () {
            return eventType + ';' + eventTime + ';' + projectId;
        }
    }
}

function fromJson(source) {
    let rawValue = JSON.parse(source)
    return TimeclockEntry(rawValue.eventType, rawValue.eventTime, rawValue.projectId)
}

const csvLine = /^(start|stop);([+-]?\d+);((?:\w|-)+)$/

function fromCsv(source) {
    let match = csvLine.exec(source)
    if (!match) {
        throw new RangeError('Invalid CSV entry: [' + source + ']')
    }
    let eventType = match[1]
    let eventTime = parseInt(match[2])
    let projectId = match[3]
    return TimeclockEntry(eventType, eventTime, projectId)
}

const validEventTypes = [EventType.start, EventType.stop]

function checkValidity(eventType, eventTime, projectId) {
    if (validEventTypes.indexOf(eventType) < 0) {
        throw new RangeError('Invalid event type: [' + eventType + ']')
    }
    if (!Number.isInteger(eventTime)) {
        throw new RangeError('Invalid event time: [' + eventTime + ']')
    }
    if (typeof projectId !== 'string') {
        throw new RangeError('Invalid project ID: [' + projectId + ']')
    }
}

exports.EventType = EventType
exports.TimeclockEntry = TimeclockEntry
exports.fromJson = fromJson
exports.fromCsv = fromCsv
