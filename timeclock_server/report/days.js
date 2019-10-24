const localTime = require('../local_time.js')
const DayReport = require('./day_report.js').DayReport

function Days() {
    let eventsForDay = new Map()
    return {
        consume: event => {
            let date = localTime.isoString(event.eventTime)
            let events = getOrCreateSet(eventsForDay, date)
            events.add(event)
        },
        createReport: () => {
            console.log(eventsForDay)
            let sortedDates = new Array(eventsForDay.keys())
            sortedDates.sort()
            let dayReports = []
            sortedDates.forEach((date) => dayReports.push(DayReport(date, eventsForDay[date])))
            return dayReports
        }
    }
}

function getOrCreateSet(map, key) {
    return getOrCreate(map, key, () => new Set())
}

function getOrCreate(map, key, create) {
    console.log(key)
    let result = map.get(key)
    if (!result) {
        result = create()
        map[key] = result
    }
    console.log(result)
    return result
}

exports.Days = Days
