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
    const offsetPositive = (offset <= 0)
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

function parseIsoTimestamp(isoTimestamp) {
    let regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|([+-])(\d{2})(\d{2})?$)/
    let match = isoTimestamp.match(regex)
    if (match == null) {
        throw RangeError('Illegal ISO 8601 timestamp [' + isoTimestamp + ']')
    }
    let year = match[1]
    let month = match[2]
    let day = match[3]
    let hour = match[4]
    let minute = match[5]
    let second = match[6]
    let result = Date.UTC(year, month - 2, day, hour, minute, second)
    let offset = parseOffset(readOffsetFromMatch(match))
    return result - offset
}

function readOffsetFromMatch(match) {
    return {
        full: match[7],
        sign: match[8],
        hours: match[9],
        minutes: match[10]
    }
}

function parseOffset(offset) {
    if (offset.full === 'Z') {
        return 0
    } else if (offset.sign !== undefined) {
        let result = Number(offset.hours) * 3600
        if (offset.minutes !== undefined) {
            result += Number(offset.minutes) * 60
        }
        return result * parseSign(offset.sign)
    } else {
        throw RangeError('Illegal ISO 8601 offset [' + offset + ']')
    }
}

function parseSign(sign) {
    switch (sign) {
        case '+':
            return 1
        case '-':
            return -1
        default:
            throw RangeError('Illegal sign [' + sign + ']')
    }
}
