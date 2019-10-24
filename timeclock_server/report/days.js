const localTime = require('../local_time.js')
const DayReport = require('./day_report.js').DayReport

function Days() {
    let eventsForDay = new Map()
    return {
        consume: event => {
            console.log(event.eventTime)
            let date = localTime.isoDateString(event.eventTime)
            console.log(date)
            let events = getOrCreateList(eventsForDay, date)
            events.push(event)
        },
        createReport: () => {
            console.log(eventsForDay)
            console.log(eventsForDay.keys())
            let sortedDates = Array.from(eventsForDay.keys())
            console.log(sortedDates)
            sortedDates.sort()
            console.log(sortedDates)
            let dayReports = []
            sortedDates.forEach((date) => dayReports.push(DayReport(date, eventsForDay[date])))
            return dayReports
        }
    }
}

function getOrCreateList(map, key) {
    return getOrCreate(map, key, () => [])
}

function getOrCreate(map, key, create) {
    console.log(key)
    let result = map.get(key)
    if (!result) {
        result = create()
        map[key] = result
        console.log('Created result')
    }
    console.log(result)
    return result
}

exports.Days = Days
