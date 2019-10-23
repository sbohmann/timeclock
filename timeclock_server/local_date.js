str = require('./str.js').str

exports.isoString = (year, month, day) => {
    return str(year, 4) + '-' +
        str(month, 2) + '-' +
        str(day, 2)
}
