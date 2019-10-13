function run() {
    let buttonList = document.getElementById('buttons')

    function initialize() {
        for (let projectId of ['C3']) {
            let p = document.createElement('p')
            p.classList.add('buttonRow')
            for (let action of ['start', 'stop']) {
                let button = document.createElement('span')
                button.classList.add('eventButton')
                button.appendChild(document.createTextNode(projectId + ' ' + action))
                button.onclick = () => report(action, projectId)
                p.appendChild(button)
            }
            buttonList.appendChild(p)
        }
    }

    function report(action, projectId) {
        let eventTime = Math.floor(Date.now() / 1000)
        let entry = { eventType: action, eventTime: eventTime, projectId: projectId}
        sendEntry(projectId, action, entry)
    }

    function sendEntry(projectId, action, entry) {
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    alert(projectId + ' ' + action)
                } else {
                    alert(projectId + ' ' + action + ' failed. status code: ' + request.status)
                }
            }
        }
        request.open('POST', '/api/report')
        request.send(JSON.stringify(entry))
    }

    initialize()
}

window.onload = run
