const fs = require('fs')
const path = require('path')
const copyFiles = fs.readdirSync("public")

if (!fs.existsSync('build')) {
    console.log("Creating build folder...")
    fs.mkdirSync("build")
} else {
    console.log("Clearing build folder...")
    fs.rmSync("build", {recursive: true})
    fs.mkdirSync("build")
}

console.log("Copying public files...")
copyFiles.forEach((file) => {
    if (fs.existsSync(path.resolve('public', file))) {
        fs.cpSync(path.resolve('public', file), path.resolve('build', file), {recursive: true})
    } else {
        console.warn("File or directory does not exist: " + file)
    }
})
console.log("Copying dist...")
fs.cpSync('dist', path.resolve('build', 'dist'), {recursive: true})
console.log("Done")