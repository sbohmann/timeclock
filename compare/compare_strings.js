function compareStrings(lhs, rhs) {
    let minLength = Math.min(lhs.length, rhs.length)
    for (let index = 0; index < minLength; ++index) {
        let lhsChar = lhs[index]
        let rhsChar = rhs[index]
        if (lhsChar < rhsChar) {
            return -1
        } else if (lhsChar > rhsChar) {
            return 1
        }
    }
    if (lhs.length < rhs.length) {
        return -1
    } else if (lhs.length > rhs.length) {
        return 1
    }
    return 0
}

function sortByString(array, access) {
    array.sort((lhs, rhs) => {
        return compareStrings(access(lhs), access(rhs))
    })
}

exports.compareStrings = compareStrings
exports.sortByString = sortByString
