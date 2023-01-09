// Node.js script to remove unnecessary data from flag data json files

const fs = require('fs')

const filePath = "data/us-states.json"

const fileData = fs.readFileSync(filePath)
const data = JSON.parse(fileData)
let newData = []

data.forEach((state) => {
    newData.push({
        name: state.state,
        code: state.slug
    })
})

fs.writeFileSync(filePath.split("/")[0] + "/" + filePath.split("/")[1].split(".")[0] + "-opt.json", JSON.stringify(newData))