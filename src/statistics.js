let statistics = {
    streak: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalGames: 0,
    flagsSeen: []
}
const totalFlagCount = 254 // Total number of flags in all difficulties. Run scripts/getFlagCount.js to recalculate

export function saveStats(stats) {
    localStorage.setItem("flag-guesser-stats", JSON.stringify(stats))
    updateStatReading()
}

export function loadStats() {
    return JSON.parse(localStorage.getItem("flag-guesser-stats"))
}

export function getStat(statName) {
    return statistics[statName]
}

export function updateStat(statName, newValue) {
    statistics[statName] =  newValue
    saveStats(statistics)
}

export function incrementStat(statName) {
    updateStat(statName, statistics[statName] + 1)
}

export function updateStatReading() {
    for (let k in statistics) {
        if (document.getElementById(`s-${k}`)) {
            document.getElementById(`s-${k}`).querySelector('span.stat').innerText = getStat(k)
        }
    }
    let correctPercentage = Math.floor((getStat('totalCorrect') * 100) / getStat('totalQuestions'))
    if (isNaN(correctPercentage)) correctPercentage = 0
    document.getElementById('sp-winRate').querySelector('span.stat').innerText = correctPercentage
    let flagsSeenPercentage = Math.floor((getStat('flagsSeen').length * 100) / totalFlagCount)
    if (isNaN(flagsSeenPercentage)) flagsSeenPercentage = 0
    if (flagsSeenPercentage > 100) flagsSeenPercentage = 100 // Whoops somebody forgot to update the totalFlagCount variable!
    document.getElementById('sp-flagsPercent').querySelector('span.stat').innerText = flagsSeenPercentage
}

if (!loadStats()) {
    saveStats(statistics)
} else {
    let loadedStats = loadStats()
    for (let k in statistics) {
        if (typeof loadedStats[k] == 'undefined') {
            console.log("Adding stat " + k + ", this should only appear once.")
            loadedStats[k] = statistics[k]
            saveStats(loadedStats)
        }
    }
    statistics = loadedStats
}
updateStatReading()

document.getElementById("reset-stats").addEventListener("click", () => {
    if (confirm("Are you sure? This cannot be undone!")) {
        localStorage.removeItem("flag-guesser-stats")
        window.location.reload()
    }
})