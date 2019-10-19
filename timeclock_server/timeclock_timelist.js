const contentType = require('../content_type.js')
const templateEngine = require('../template_engine/template_engine.js')

const engine = templateEngine.TemplateEngine('templates/timelist.html')

exports.TimeList = (storage) => {
    return {
        handleRequest: (request, response) => {
            const entries = storage.entries()
            entries.reverse()
            let content = ''
			let first = true;
            for (let entry of entries) {
                let value = entry
				if (! first) {
					content += '\n'
				}
                content += `<tr><td>${value.eventType}</td><td>${localTime(value.eventTime)}</td><td>${value.projectId}</td></tr>`
				first = false;
            }
            let result = engine.applySubstitutions({content: content})
            contentType.html(response)
            response.write(result)
            response.end()
        }
    }
}

function localTime(timestamp) {
    let date = new Date(timestamp * 1000)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return localIsoDate(Y, M, D, h, m, s)
}

function localIsoDate(Y, M, D, h, m, s) {
    return str(Y, 4) + '-' + str(M, 2) + '-' + str(D, 2) + 'T' + str(h, 2) + ':' + str(m, 2) + ':' + str(s, 2)
}

function str(value, minimumNumberOfDigits) {
    let result = value.toString()
    for (let missingDigits = minimumNumberOfDigits - result.length; missingDigits > 0; --missingDigits) {
        result = '0' + result
    }
    return result
}
