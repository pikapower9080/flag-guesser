import { hideAllScreens } from "./index"
import { Confirm } from 'notiflix/build/notiflix-confirm-aio'
import { confirmOptions, reportOptions } from "./themes"
import { Report } from "notiflix"
import { getSetting } from "./options"

let statistics = {
    streak: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalGames: 0,
    flagsSeen: []
}
let gameStatistics = {
    totalQuestions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    playtime: 0,
    difficulty: 0
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
    if (getSetting('practice') === "practice-on") return
    statistics[statName] =  newValue
    saveStats(statistics)
}

export function incrementStat(statName) {
    updateStat(statName, statistics[statName] + 1)
}

export function updateGameStat(statName, newValue) {
    gameStatistics[statName] = newValue
}

export function incrementGameStat(statName) {
    updateGameStat(statName, gameStatistics[statName] + 1)
}

function formatSeconds(seconds) {
    var h = Math.floor(seconds / 3600)
    var m = Math.floor(seconds % 3600 / 60)
    var s = Math.floor(seconds % 3600 % 60)
    return `${h > 0 ? h + ' hours,' : ''} ${m > 0 ? m + ' minutes,' : ''} ${s} seconds`
}

export function showEndScreen(gameMode, streak = 0, score = 0, maxScore = 0, correctAnswer = '') {
    hideAllScreens()
    const endScreen = document.getElementById("end")
    endScreen.style.display = "unset"
    for (let statId in gameStatistics) {
        let statElement = document.getElementById('tg-' + statId)
        if (statElement) {
            statElement.querySelector(".stat").innerText = gameStatistics[statId].toString().replaceAll("-", " ")
        }
    }
    document.getElementById("tsg-playtime").querySelector(".stat").innerText = formatSeconds(gameStatistics.playtime)
    let subStreak = document.getElementById("sub-streak")
    let subQuizScore = document.getElementById("sub-quiz-score")
    if (gameMode == "questions") {
        subQuizScore.style.display = "block"
        subStreak.style.display = "none"
    } else if (gameMode == "streak") {
        subQuizScore.style.display = "none"
        subStreak.style.display = "block"
    }
    subStreak.querySelector(".stat").innerText = streak
    document.getElementById("score-value").innerText = score
    document.getElementById("score-max").innerText = maxScore.split("q-")[1]
    if (gameMode == "questions") {
        document.getElementById("end-title").innerText = "Game Complete!"
    } else {
        document.getElementById("end-title").innerText = "Game Over!"
    }
    let correctPercentage = Math.floor((gameStatistics.totalCorrect * 100) / gameStatistics.totalQuestions)
    let endCorrectAnswer = document.getElementById('end-correct-answer')
    let questionCountStat = document.getElementById('tg-questions')
    document.getElementById('tsp-winRate').querySelector('span.stat').innerText = correctPercentage
    if (correctAnswer == '') {
        endCorrectAnswer.style.display = "none"
    } else {
        endCorrectAnswer.style.display = "block"
        endCorrectAnswer.querySelector('.stat').innerText = correctAnswer
    }
    if (gameMode == "questions") {
        questionCountStat.style.display = "unset"
    } else {
        questionCountStat.style.display = "none"
    }
    Array.from(document.querySelectorAll(".no-streak")).forEach((element) => {
        if (!element) return
        if (gameMode == "streak") {
            element.style.display = "none"
        } else {
            element.style.display = "block"
        }
    })
    clearGameStats()
}

export function clearGameStats() {
    for (let stat in gameStatistics) {
        gameStatistics[stat] = 0
    }
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
    Confirm.show("Are you sure?", "This cannot be undone!", 'Clear Stats', 'Cancel', () => {
        localStorage.removeItem("flag-guesser-stats")
        window.location.reload()
    }, undefined, confirmOptions)
})
function generateCopyText() {
    let lines = []
    Array.from(document.querySelectorAll("#stats-container > ul > li")).forEach((listItem) => {
        if (listItem.getAttribute("icon")) {
            lines.push(`${listItem.getAttribute("icon")}${listItem.innerText}`)
        }
    })
    return lines.join("\n")
}
document.getElementById("copy-stats").addEventListener("click", () => {
    try {
        const textElement = document.createElement("textarea")
        textElement.value = generateCopyText()
        document.body.appendChild(textElement)
        textElement.select()
        document.execCommand("copy")
        textElement.remove()
        Report.success("Copied!", "Successfully copied to clipboard.", "Ok", reportOptions)
    } catch(errorM) {
        console.error(errorM)
        Report.failure("Error", "Failed to copy text, sorry about that :(", "Ok", reportOptions)
    }
})