const fs = require('fs')
const path = require('path')
const copyFiles = JSON.parse(fs.readFileSync('copy.json').toString())
const list = require('./generateCacheList.js')

if (!fs.existsSync('build')) {
    fs.mkdirSync("build")
} else {
    fs.rmSync("build", {recursive: true})
    fs.mkdirSync("build")
}
console.log("Copying files...")
copyFiles.forEach((file) => {
    if (fs.existsSync(file)) {
        fs.cpSync(file, path.resolve('build', file), {recursive: true})
    } else {
        console.warn("File or directory does not exist: " + file)
    }
})
let version = 'Version Unknown'
console.log("Getting version...")
let packageJSON = JSON.parse(fs.readFileSync('package.json').toString())
if (packageJSON) {
    version = packageJSON.version
    console.log("Version: " + version)
} else {
    console.error("Failed to load or parse package.json")
}
console.log("Processing service worker script")

try {
    let scriptContent = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js')).toString()
    scriptContent = scriptContent.replaceAll("%ver%", version)
    scriptContent = scriptContent.replaceAll("%list%", list.join(','))
    fs.writeFileSync(path.resolve("build", "sw.js"), scriptContent)
} catch(errorM) {
    console.error("Failed to copy / replace service worker script")
    console.error(errorM)
}
console.log("Updating version bundle")
try {
    let bundleContent = fs.readFileSync(path.resolve('build', 'dist', 'main.js')).toString()
    bundleContent = bundleContent.replaceAll("%ver%", version)
    fs.writeFileSync(path.resolve('build', 'dist', 'main.js'), bundleContent)
} catch(errorM) {
    console.error("Failed to replace bundle version number")
}

console.log("Build completed!")