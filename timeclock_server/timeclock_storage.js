const fs = require('fs')
const path = require('path')
const readline = require('readline')
const local_time = require('./local_time')

const timeclockEntry = require('./timeclock_entry.js')

const data_path = 'timeclock_data.csv'

exports.Storage = function () {
    let entries = []
    let ready = false
    let onReadyHandler = null

    function initialize() {
        if (fs.existsSync(data_path)) {
            backup()
            readData()
        } else {
            setTimeout(() => setReadyState(), 0)
        }
    }

    function backup() {
        let backup_directory = 'backup'
        if (!fs.existsSync(backup_directory)) {
            fs.mkdirSync(backup_directory)
        }
        let backup_file = path.join(backup_directory, backup_filename())
        fs.copyFileSync(data_path, backup_file)
    }

    function backup_filename() {
        let date = local_time.isoString(local_time.now())
        return 'timeclock_data_' + date + '.csv'
    }

    function readData() {
        let stream = createStream()
        readLines(stream)
    }

    function readLines(stream) {
        let lines = readline.createInterface({input: stream})
        lines.on('line', line => {
            try {
                let entry = timeclockEntry.fromCsv(line)
                entries.push(entry)
            } catch (error) {
                console.log(error)
                console.log('Unable to parse CSV line [' + line + ']')
            }
        })
        lines.on('close', () => {
            stream.close()
            setReadyState()
        })
    }

    function createStream() {
        let stream = fs.createReadStream(data_path)
        stream.on('error', error => {
            console.log(error)
        })
        return stream
    }

    function setReadyState() {
        if (!ready) {
            ready = true
            if (onReadyHandler) {
                onReadyHandler()
            }
        }
    }

    function checkIfReady() {
        if (!ready) {
            throw RangeError('Not ready')
        }
    }

    initialize()

    return {
        onReady: handler => {
            onReadyHandler = handler
        },
        addEntry: entry => {
            checkIfReady()
            fs.appendFileSync(data_path, entry.toCsvLine() + '\n')
            entries.push(entry)
        },
        entries: () => {
        	checkIfReady()
        	return entries.map(entry => Object.assign({}, entry.value))
        },
        readRawData: () => {
            return fs.readFileSync(data_path, 'utf8')
        }
    }
}
