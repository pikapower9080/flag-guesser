const fs = require('fs')
const path = require('path')

let directories = ['icons', 'data', 'css', 'dist', 'flags', 'flags/state', 'flags/state/maps']
let list = ['/', 'gallery.html', 'manifest.json', 'https://fonts.googleapis.com/css2?family=Alexandria:wght@500&family=Open+Sans&display=swap', 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2', 'fontawesome/css/fontawesome.min.css', 'fontawesome/css/solid.css', 'fontawesome/webfonts/fa-solid-900.woff2', 'fontawesome/webfonts/fa-solid-900.ttf']

directories.forEach((directory) => {
    fs.readdirSync(path.resolve('.', directory)).forEach((file) => {
        if (directory == "data" && !file.includes("-opt")) return // remove non optimized data
        list.push(`${directory}/${file}`)
    })
})

module.exports = [list]