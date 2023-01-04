// Node.js script to remove unnecessary data from flag data json files

const fs = require('fs')

const filePath = "data/expert.json"

const fileData = fs.readFileSync(filePath)
const data = JSON.parse(fileData)
let newData = []

data.forEach((country) => {
    newData.push({
        name: country.name,
        code: country.code,
        image: country.image.split('/')[7],
        alt: country.alt
    })
})

fs.writeFileSync(filePath.split("/")[0] + "/" + filePath.split("/")[1].split(".")[0] + "-opt.json", JSON.stringify(newData))