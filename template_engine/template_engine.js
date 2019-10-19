fs = require('fs')

function TemplateEngine(template_path) {
	const template = fs.readFileSync(template_path).toString().split(/\r?\n/)
	
	function apply(substitute) {
		let regex = /((?<=^)\s+)?@_\((\w+)\)/g
		let firstLineOfTemplate = true
		let result = ''
		for (let templateLine of template) {
			console.log(templateLine)
			if (!firstLineOfTemplate) {
				result += '\n'
			}
			let index = 0
			while (true) {
				let match = regex.exec(templateLine)
				if (match === null) {
					break
				}
				indentation = match[1]
				let key = match[2]
				result += templateLine.slice(index, match.index)
				let value = substitute(key).split(/\r?\n/)
				let firstLineOfValue = true
				for (let valueLine of value) {
					if (!firstLineOfValue) {
						result += '\n'
					}
					if (indentation) {
						result += indentation
					}
					result += valueLine
					firstLineOfValue = false
				}
				index = regex.lastIndex
			}
			result += templateLine.slice(index, templateLine.length)
			firstLineOfTemplate = false
		}
		return result
	}
	
	return {
		applySubstitutions: (substitutions) => {
			return apply((name) => {
				let value = substitutions[name]
				if (value !== undefined) {
					return value
				} else {
					throw RangeError('No value configured for name [' + name + ']')
				}
			})
		}
	}
}

exports.TemplateEngine = TemplateEngine
