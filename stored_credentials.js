const fs = require('fs')

const path = 'credentials.txt'

exports.readFromFile = function() {
    let user
    let password
    if (fs.existsSync(path)) {
        let fileContent = fs.readFileSync(path)
        let match = /^\s*(\w+)\s+(\w+)\s*$/.exec(fileContent)
        if (!match) {
            throw RangeError('Illegal credentials.txt file. Expected <user><newline><password>,' +
                ' a-z, A-Z, 0-9, and _ only')
        }
        user = match[1]
        password = match[2]
    } else {
        user = 'time'
        password = ''
        const a = 'a'.charCodeAt(0)
        for (let index = 0; index < 6; ++index) {
            password += String.fromCharCode(a + Math.floor(Math.random() * 26))
        }
        fs.writeFileSync(path, user + '\n' + password)
        console.log("Created credentials.txt")
        console.log("user: [" + user + ']')
        console.log("password: [" + password + ']')
    }
    return {
        user: user,
        password: password
    }
}
