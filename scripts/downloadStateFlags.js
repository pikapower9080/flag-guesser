// Made to run on my machine, not yours lol

const fs = require('fs')
const childProcess = require('child_process')

const flagsFile = "data/us-states.json"

const flagsString = fs.readFileSync(flagsFile)
const flagsData = JSON.parse(flagsString)

if (!fs.existsSync("flags")) {
    fs.mkdirSync("flags")  
}
if (!fs.existsSync("flags/state")) {
    fs.mkdirSync("flags/state")
}
if (!fs.existsSync("flags/state/seals")) {
    fs.mkdirSync("flags/state/seals")
}

flagsData.forEach((flag) => {
    console.log("Downloading " + flag.slug)
    childProcess.execSync(`wget https://cdn.civil.services/us-states/seals/${flag.slug}-large.png -O flags/state/seals/${flag.slug}.png --quiet --rejected-log=rejected.csv`)
})