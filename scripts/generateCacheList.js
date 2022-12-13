const fs = require('fs')
const path = require('path')

let directories = ['icons', 'data', 'css', 'dist', 'flags']
let list = ['/', 'gallery.html', 'manifest.json']

directories.forEach((directory) => {
    fs.readdirSync(path.resolve('.', directory)).forEach((file) => {
        if (directory == "data" && !file.includes("-opt")) return // remove non optimized data
        list.push(`${directory}/${file}`)
    })
})

module.exports = [list]