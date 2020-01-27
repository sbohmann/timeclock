str = require('./str.js').str

exports.struct = (timestamp) => {
    return applyLocalDate(timestamp, createDateTimeStruct)
}

exports.isoString = (timestamp) => {
    return applyLocalDate(timestamp, createIsoString)
}

exports.getDate = (timestamp) => {
    return applyLocalDate(timestamp, createDateStruct)
}

exports.isoDateString = (timestamp) => {
    return applyLocalDate(timestamp, createIsoDateString)
}

exports.fileIsoString = (timestamp) => {
    return applyLocalDate(timestamp, createIsoString)
}

function applyLocalDate(timestamp, handler) {
    let date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return handler(year, month, day, hour, minute, second)
}

function createDateTimeStruct(year, month, day, hour, minute, second) {
    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second
    }
}

function createDateStruct(year, month, day) {
    return {
        year: year,
        month: month,
        day: day
    }
}

function createIsoString(year, month, day, hour, minute, second) {
    return str(year, 4) + '-' +
        str(month, 2) + '-' +
        str(day, 2) + 'T' +
        str(hour, 2) + ':' +
        str(minute, 2) + ':' +
        str(second, 2)
}

function createIsoDateString(year, month, day) {
    return str(year, 4) + '-' +
        str(month, 2) + '-' +
        str(day, 2)
}
