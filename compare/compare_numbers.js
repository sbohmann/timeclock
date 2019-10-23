function compareNumbers(lhs, rhs) {
    if (lhs < rhs) {
        return -1
    } else if (lhs > rhs) {
        return 1
    }
    return 0
}

function sortByNumber(array, access) {
    array.sort((lhs, rhs) => {
        return compareNumbers(access(lhs), access(rhs))
    })
}

eports.compareNumbers = compareNumbers
eports.sortByNumber = sortByNumber
