exports.create = function()
{
    function handleRequest(request, response) {
        let path = getPath(request)
        switch (path) {
            case 'report':
                handleReport(request, response)
                break
            default:
                throw new RangeError("Illegal api path: [" + path + "]")
        }
    }

    function getPath(request) {
        const prefix = '/api/'
        if (request.url.startsWith(prefix)) {
            return request.url.substr(prefix.length)
        } else {
            throw new RangeError("Illegal api url: [" + request.url + "]")
        }
    }

    function handleReport(request, response) {

    }

    return {
        handleRequest: handleRequest
    }
}
