fs = reuqire('fs')

exports.TemplateEngine = (template_path) => {
	const template = fs.readFileSync(template_path)
	
	function apply(substitute) {
		/@_\(\w+\)/.exec(template).forEach(match => {
			
		})
	}
	
	return {
		applySubstitutions: (subsitutions) => {
			
		}
	}
}
