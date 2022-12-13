const fs = require('fs')
const path = require('path')

let directories = ['icons', 'data', 'css', 'dist', 'flags']
let list = ['/', 'gallery.html', 'manifest.json', 'https://fonts.googleapis.com/css2?family=Alexandria:wght@500&family=Open+Sans&display=swap', 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2', 'https://kit.fontawesome.com/9d23c8a337.js']

directories.forEach((directory) => {
    fs.readdirSync(path.resolve('.', directory)).forEach((file) => {
        if (directory == "data" && !file.includes("-opt")) return // remove non optimized data
        list.push(`${directory}/${file}`)
    })
})

module.exports = [list]