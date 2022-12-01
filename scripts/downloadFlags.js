// Download flags from https://countryflagsapi.com
// Made to run on my machine, not yours lol

const fs = require('fs')
const childProcess = require('child_process')

const flagsFile = "data/expert.json"

const flagsString = fs.readFileSync(flagsFile)
const flagsData = JSON.parse(flagsString)

if (!fs.existsSync("flags")) {
    fs.mkdirSync("flags")  
}

flagsData.forEach((flag) => {
    console.log("Downloading " + flag.code)
    childProcess.execSync(`wget https://countryflagsapi.com/svg/${flag.code} -O flags/${flag.code}.svg --quiet --rejected-log=rejected.csv`)
})