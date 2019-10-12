const fs = require('fs')

const window = require('svgdom')
const svg = require('svg.js')(window)
const document = window.document

const backgroundColor = '#000'
const color = '#6c3'
const imageWidth = 200
const imageHeight = 200
const margin = 20
const rimWidth = 10
const handWidth = 6
const handOverhang = 9

const centerX = imageWidth / 2
const centerY = imageHeight / 2
const circleSize = Math.min(imageWidth, imageHeight) - 2 * margin
const circleX = (imageWidth - circleSize) / 2
const circleY = (imageHeight - circleSize) / 2

let image

function createImage() {
    image = svg(document.documentElement)
        .size(imageWidth, imageHeight)
    image.rect('100%', '100%')
        .fill(backgroundColor)
    image.circle(160)
        .move(circleX, circleY)
        .fill('none')
        .stroke({width: rimWidth, color: color})

    time(2, 52)

    fs.writeFileSync('icon.svg', image.svg())
}

function time(hours, minutes) {
    let minuteDegrees = minutes * 6
    let hourDegrees = hours * 30 + minutes / 2
    hand(minuteDegrees, 67)
    hand(hourDegrees, 47)
}

function hand(degrees, length) {
    let angle = angleFromDegrees(degrees)
    let directionX = Math.sin(angle)
    let directionY = - Math.cos(angle)
    let startX = centerX - handOverhang * directionX
    let startY = centerY - handOverhang * directionY
    let endX = centerX + length * directionX
    let endY = centerY + length * directionY
    image.line(startX, startY, endX, endY)
        .stroke({width: handWidth, color: color})
}

function angleFromDegrees(degrees) {
    return degrees * Math.PI / 180
}

createImage()


