const fs = require('fs')

const path = 'projects.txt'

exports.readFromFile = function() {
    let projects = []
    if (fs.existsSync(path)) {
        let fileContent = fs.readFileSync(path, 'utf8')
        let separator = /\s+/
        fileContent.split(separator).forEach(rawProject => {
            let candidate = rawProject.trim()
            if (candidate.length > 0) {
                projects.push(candidate)
            }
        })
    } else {
        let example = 'example'
        fs.writeFileSync(path, example + '\n')
        projects.push(example)
        console.log("Created projects.txt with example project [" + example + "]")
    }
    return projects
}
