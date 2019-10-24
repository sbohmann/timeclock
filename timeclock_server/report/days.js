const localDate = require('../local_date.js')
const DayReport = require('./day_report.js').DayReport

function Days() {
    let eventsForDay = new Map()
    return {
        consume: event => {
            console.log(event)
            console.log(event.eventTime)
            let date = localDate.isoString(event.eventTime)
            let events = getOrCreateSet(eventsForDay, date)
            events.add(event)
        },
        createReport: () => {
            let sortedDates = new Array(eventsForDay.keys())
            sortedDates.sort()
            let dayReports = []
            sortedDates.forEach((date) => dayReports.push(DayReport(date, eventsForDay[date])))
        }
    }
}

function getOrCreateSet(map, key) {
    return getOrCreate(map, key, () => new Set())
}

function getOrCreate(map, key, create) {
    let result = map.get(key)
    if (!result) {
        result = create()
        map[key] = result
    }
    return result
}

exports.Days = Days
