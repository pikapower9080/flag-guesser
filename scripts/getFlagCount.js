const fs = require('fs')
const data = fs.readFileSync('data/expert-opt.json').toString()
console.log(JSON.parse(data).length)