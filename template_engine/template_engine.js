fs = require('fs')

function TemplateEngine(template_path) {
	const template = fs.readFileSync(template_path).toString('utf8')
	
	function apply(substitute) {
		let regex = /@_\((\w+)\)/g
		let result = ''
		let index = 0
		while (true) {
			let match = regex.exec(template)
			if (match === null) {
				break;
			}
			let key = match[1]
			result += template.slice(index, match.index)
			result += substitute(key)
			index = regex.lastIndex
		}
		result += template.slice(index, template.length)
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
