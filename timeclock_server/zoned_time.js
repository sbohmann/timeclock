const str = require('./str.js').str

exports.isoString = (timestamp) => {
    return applyZonedDate(timestamp, createIsoString)
}

function applyZonedDate(timestamp, handler) {
    let date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const offset = date.getTimezoneOffset()
    const offsetPositive = (offset >= 0)
    const absolute_offset = Math.abs(offset)
    const offsetHours = Math.floor(absolute_offset / 60)
    const offsetMinutes = absolute_offset % 60
    return handler(year, month, day, hour, minute, second, offsetPositive, offsetHours, offsetMinutes)
}

function createIsoString(year, month, day, hour, minute, second, offsetPositive, offsetHours, offsetMinutes) {
    return str(year, 4) + '-' +
        str(month, 2) + '-' +
        str(day, 2) + 'T' +
        str(hour, 2) + ':' +
        str(minute, 2) + ':' +
        str(second, 2) +
        (offsetPositive ? '+' : '-') +
        str(offsetHours, 2) +
        (offsetMinutes !== 0
            ? ':' + str(offsetMinutes, 2)
            : '')
}
