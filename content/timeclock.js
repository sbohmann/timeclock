function run() {
    let buttonsElement = document.getElementById('buttons')

    function innitialize() {
        for (let projectId of ['C3']) {
            let p = document.createElement('p')
            for (let action in ['start', 'stop']) {
                let button = document.createElement('button')
                button.appendChild(document.createTextNode(projectId + ' ' + action))
                button.onclick = report(action, projectId)
                p.appendChild(button)
            }
        }
    }

    function report(action, projectId) {

    }

    initialize()
}

window.onload = run()
