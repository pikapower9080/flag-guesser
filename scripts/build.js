const fs = require('fs')
const path = require('path')
const copyFiles = JSON.parse(fs.readFileSync('copy.json').toString())

if (!fs.existsSync('build')) {
    fs.mkdirSync("build")
} else {
    fs.rmSync("build", {recursive: true})
    fs.mkdirSync("build")
}
copyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
        fs.cpSync(file, path.resolve('build', file), {recursive: true})
    } else {
        console.warn("File or directory does not exist: " + file)
    }
})