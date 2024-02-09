const activatedClass = 'activated'
const successClass = 'success'
const failedClass = 'failed'

function run() {
    let reportList = document.getElementById('reports')
    let buttonList = document.getElementById('buttons')

    function initialize() {
        requestProjectList(projects => {
            for (let projectId of projects) {
                let h2 = document.createElement('h2')
                h2.classList.add('centered')
                let a = document.createElement('a')
                a.href = './report/' + projectId
                a.textContent = "Report " + projectId
                h2.appendChild(a)
                reportList.appendChild(h2)
            }
            for (let projectId of projects) {
                let p = document.createElement('p')
                p.classList.add('buttonRow')
                for (let action of ['start', 'stop']) {
                    let button = document.createElement('span')
                    button.classList.add('eventButton')
                    button.classList.add(action)
                    button.appendChild(document.createTextNode(projectId + ' ' + action))
                    let buttonDisabled = false
                    button.onclick = () => {
                        if (buttonDisabled) {
                            return
                        }

                        function postProcess(success) {
                            buttonDisabled = false
                            button.classList.remove(activatedClass)
                            button.classList.add(success ? successClass : failedClass)
                            setTimeout(() => {
                                button.classList.remove(successClass, failedClass)
                            }, 2000)
                        }

                        report(action,
                            projectId,
                            postProcess)
                        buttonDisabled = true
                        button.classList.add(activatedClass)
                    }
                    p.appendChild(button)
                }
                buttonList.appendChild(p)
            }
        })
    }

    function requestProjectList(handler) {
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    try {
                        let projects = JSON.parse(request.response)
                        handler(projects)
                    } catch (error) {
                        alert(error)
                    }
                } else {
                    alert('Project list request failed. status code: ' + request.status)
                }
            }
        }
        request.open('GET', '/api/projects')
        request.send()
    }

    function report(action, projectId, postProcess) {
        let eventTime = Math.floor(Date.now() / 1000)
        let entry = {eventType: action, eventTime: eventTime, projectId: projectId}
        sendEntry(projectId, action, entry, postProcess)
    }

    function sendEntry(projectId, action, entry, postProcess) {
        let request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    postProcess(true)
                } else {
                    postProcess(false)
                    console.log(projectId + ' ' + action + ' failed. status code: ' + request.status)
                }
            }
        }

        request.open('POST', '/api/report')
        request.send(JSON.stringify(entry))
    }

    initialize()
}

window.onload = run
