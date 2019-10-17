exports.js = function(response) {
    utf8(response, 'application/javascript')
}

exports.css = function(response) {
    utf8(response, 'application/css')
}

exports.html = function(response) {
    utf8(response, 'text/html')
}

exports.text = function(response) {
	utf8(response, 'text/plain')
}

exports.icon = function(response) {
    raw(response, 'image/ico')
}

function utf8(response, contentType) {
    raw(response, contentType + '; charset=utf-8')
}

function raw(response, contentType) {
    response.setHeader('Content-type', contentType)
}

exports.utf8 = utf8;
exports.raw = raw;
