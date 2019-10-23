let sortByNumber = require('../../compare/compare_strings.js').sortByNumber

function DayReport (date, events) {
    let sortedEvents = new Array(events)
    sortByNumber(sortedEvents, event => event.eventTime)

}

exports.DayReport = DayReport
