const localTime = require('../local_time.js')
const DayReport = require('./day_report.js').DayReport

function Days() {
    let eventsForDay = new Map()
    return {
        consume: event => {
            let date = localTime.isoDateString(event.eventTime)
            let events = getOrCreateList(eventsForDay, date)
            events.push(event)
        },
        createReports: () => {
            let sortedDates = Array.from(eventsForDay.keys())
            sortedDates.sort()
            let dayReports = []
            sortedDates.forEach((date) => dayReports.push(
                DayReport(
                    date,
                    eventsForDay.get(date))))
            return dayReports
        }
    }
}

function getOrCreateList(map, key) {
    return getOrCreate(map, key, () => [])
}

function getOrCreate(map, key, create) {
    let result = map.get(key)
    if (!result) {
        result = create()
        map.set(key, result)
    }
    return result
}

exports.Days = Days
