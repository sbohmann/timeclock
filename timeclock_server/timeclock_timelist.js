const contentType = require('../content_type.js')
const templateEngine = require('../template_engine/template_engine.js')
const localTime = require('./local_time.js')

const engine = templateEngine.TemplateEngine('templates/timelist.html')

exports.TimeList = (storage) => {
    return {
        handleRequest: (request, response) => {
            const entries = storage.entries()
            entries.reverse()
            let content = ''
            let first = true
            for (let entry of entries) {
                if (!first) {
                    content += '\n'
                }
                content += `<tr><td>${entry.eventType}</td><td>${localTime.isoString(entry.eventTime)}</td><td>${entry.projectId}</td></tr>`
                first = false
            }
            let result = engine.applySubstitutions({content: content})
            contentType.html(response)
            response.write(result)
            response.end()
        }
    }
}
