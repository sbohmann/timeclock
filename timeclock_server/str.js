exports.str = (value, minimumNumberOfDigits) => {
    let result = value.toString()
    for (let missingDigits = minimumNumberOfDigits - result.length; missingDigits > 0; --missingDigits) {
        result = '0' + result
    }
    return result
}
