const contentType = require('../content_type.js')

exports.TimeList = (storage) => {
	return {
		handleRequest: (request, response) => {
			const entries = storage.entries()
			entries.reverse()
			let result = '<html><head><title>Time List</title><body><table>'
			for (let entry of entries) {
				let value = entry
				result += `<tr><td>${value.eventType}</td><td>${localTime(value.eventTime)}</td><td>${value.projectId}</td></tr>`
			}
			result += '</table></body></html>'
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
