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
	return date.toLocaleString()
}

/* function str(value, numberOfDigits) {
	let rawResult = 
} */
