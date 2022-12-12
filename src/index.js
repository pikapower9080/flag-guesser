import { Report } from 'notiflix/build/notiflix-report-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { getDataUrl, getUserOptions } from './options';
import { incrementStat, updateStat, getStat, incrementGameStat, showEndScreen, updateGameStat } from './statistics';
import './tooltips'
import './options'
import {showAbout} from './about'
import './styles/index.less'
import strings from './strings'
import Popup from 'super-simple-popup';

const version = '1.3.3'
document.getElementById("version").innerText = "Version: " + version

Report.init({})
Confirm.init({borderRadius: '10px'})

let optionCount = 4
let data = {}
let currentCountry; // grr no cheating
let previousCountry;
let questionNum = 0
let questionCount = 10
let score = 0
let canContinue = true
const flagApiEndpoint = "flags/" // ignore the variable name XD
const flagFallbackUrlStart = "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/"
// Note: Update the useFallback variable in gallery.html also
const useFallback = ["AC","CP","DG","EA","IC","TA"] // Flags that need to use the simplified style from openmoji
let progressBarPercent = 0
let userOptions = {}
let streak = 0
let unsavedChanges = false

const progressBar = document.getElementById("progress-fill")
const streakNum = document.getElementById("streak-num")
const streakContainer = document.getElementById("streak-container")

function showUserError(errorM) {
    Loading.remove()
    console.error(errorM)
    Report.failure("Error", errorM.toString() || "An unknown error occurred.")
}

function randomCountry() {
    return data[Math.floor(Math.random() * data.length)]
}

export function hideAllScreens() {
    const screens = Array.from(document.getElementsByClassName("screen"))
    screens.forEach((screen) => {
        screen.style.display = "none"
    })
}

function clearOptions() {
    const options = Array.from(document.getElementsByClassName("option"))
    options.forEach((option) => {
        option.remove()
    })
}

function reset() {
    currentCountry = null
    previousCountry = null
    questionNum = 0
    progressBarPercent = 0
    score = 0
    streak = 0
    unsavedChanges = false
}

function returnToHome() {
    reset()
    hideAllScreens()
    document.getElementById("welcome").style.display = "unset"
}

function getFlagUrl(country) {
    if (useFallback.includes(country.code)) {
        return flagFallbackUrlStart + country.image
    } else {
        return flagApiEndpoint + country.code + ".svg"
    }
}

const guessScreen = document.getElementById("guess")
const flagSvg = document.getElementById("flag-svg")
const optionsDiv = document.getElementById("options")

function guessFor(country) {
    let options = []
    currentCountry = country
    if (currentCountry == previousCountry) {
        guessFor(randomCountry())
        return
    }
    flagSvg.src = getFlagUrl(country)
    clearOptions()
    function pick() {
        const rCountry = randomCountry()
        if (options.includes(rCountry.name) || rCountry.name == country.name) { // No duplicates!
            console.debug("Duplicate detected: " + rCountry.name)
            pick()
            return
        }
        options.push(rCountry.name)
    }
    for (let i = 0; i < optionCount - 1; i++) {
        pick()
    }
    try {
        if (!getStat('flagsSeen').includes(country.code)) {
            let newStat = getStat('flagsSeen')
            newStat.push(country.code)
            updateStat('flagsSeen', newStat)
        }
    } catch(errorM) {
        console.error("Failed to update statistics!")
        console.error(errorM)
    }
    if (!getStat('flagsSeen').includes(country.code)) {
        updateStat('flagsSeen', getStat('flagsSeen').push(country.code))
    }
    // Add correct option randomly
    options.splice(Math.floor(Math.random() * options.length), 0, country.name)
    options.forEach((option) => {
        let btn = document.createElement("button")
        btn.className = "option"
        btn.innerText = option
        optionsDiv.appendChild(btn)
        function moveOn() {
            questionNum ++
            progressBarPercent = (100 * questionNum) / questionCount
            progressBar.style.width = progressBarPercent + "%"
            previousCountry = country
            incrementStat('totalQuestions')
            incrementGameStat('totalQuestions')
            if (questionNum + 1 > questionCount && userOptions.mode == "questions") {
                unsavedChanges = false; return showEndScreen(userOptions.mode, streak, score, userOptions.questions)
            } else {
                guessFor(randomCountry())
            }
        }
        function processCanContinue() {
            canContinue = false
            setTimeout(() => {
                canContinue = true
            }, 370)
        }
        btn.addEventListener("click", () => {
            if (option == country.name) { // YAY IT'S CORRECT!!!! LET'S GO!!!
                streak ++
                streakNum.innerText = streak
                Report.success("Correct!", userOptions.mode == "streak" ? strings.streakCorrectMessages[Math.floor(Math.random() * strings.streakCorrectMessages.length)].replaceAll("%%", streak) : "", "Next Question", () => {
                    if (!canContinue) return
                    processCanContinue()
                    incrementStat('totalCorrect')
                    incrementGameStat('totalCorrect')
                    score ++
                    moveOn()
                })
            } else { // YOU'RE WRONG XD GET TROLLED
                if (userOptions.mode == "streak") {
                    if (!canContinue) return
                    processCanContinue()
                    incrementStat('totalQuestions')
                    incrementGameStat('totalQuestions')
                    incrementStat('totalIncorrect')
                    incrementGameStat('totalIncorrect')
                    if (getStat('streak') < streak) {
                        updateStat('streak', streak)
                    }
                    unsavedChanges = false; return showEndScreen(userOptions.mode, streak, score, userOptions.questions, country.name)
                }
                Report.failure("Incorrect", strings.incorrectEndlessMessages[Math.floor(Math.random() * strings.incorrectEndlessMessages.length)].replaceAll("%%", '<b>' + country.name + '</b>'), "Next Question", () => {
                    if (!canContinue) return
                    processCanContinue()
                    incrementStat('totalIncorrect')
                    incrementGameStat('totalIncorrect')
                    moveOn()
                    previousCountry = country
                }, {plainText: false})
            }
        })
    })
}

function start() {
    userOptions = getUserOptions()
    optionCount = userOptions.options.split("opt-")[1]
    questionCount = userOptions.questions.split("q-")[1]
    console.log("Data url: " + getDataUrl())
    console.log("Option count: " + optionCount)
    incrementStat('totalGames')
    unsavedChanges = true
    if (userOptions.mode !== "questions") {
        progressBar.parentElement.style.display = "none"
    } else {
        progressBar.parentElement.setAttribute("style", '')
    }
    if (userOptions.mode !== "streak") {
        streakContainer.style.display = "none"
    } else {
        streakContainer.style.display = "block"
    }
    updateGameStat('difficulty', userOptions.difficulty)
    updateGameStat('questions', userOptions.questions.split("q-")[1])
    document.querySelector("#info-difficulty > span").innerText = userOptions.difficulty
    streakNum.innerText = streak
    Loading.circle('Fetching data...')
    fetch(getDataUrl()).then((res) => {
        Loading.change('Parsing data...')
        res.json().then((fetchedData) => {
            data = fetchedData
            Loading.remove()
            hideAllScreens()
            guessScreen.style.display = "unset"
            progressBar.style.width = progressBarPercent + "%"
            guessFor(randomCountry())
        }).catch(showUserError)
    }).catch(showUserError)
}

window.addEventListener("keydown", (e) => {
    if (e.key == "Enter" || e.key == " " || e.key == "Escape") {
        if (document.getElementById("NXReportButton")) {
            document.getElementById("NXReportButton").click()
        }
    }
})

// Show the unsaved changes prompt
window.addEventListener('beforeunload', event => {
    if (unsavedChanges) {
        event.returnValue = true
    }
})

// Tick playtime stat
setInterval(() => {
    if (unsavedChanges) {
        incrementGameStat('playtime')
    }
}, 1000)

document.getElementById("close-btn").addEventListener("click", () => {
    Confirm.show("Are you sure?", "Your statistics are already saved, but any current game progress will be lost.", "Leave", "Stay", returnToHome)
})
document.getElementById('replay-btn').addEventListener("click", () => {
    hideAllScreens()
    reset()
    start()
})
document.getElementById('view-flag-btn').addEventListener("click", () => {
    new Popup({
        title: `Flag of ${currentCountry.name}`,
        content: `<img src="${getFlagUrl(currentCountry)}" class="view-flag-img">`,
        plainText: false
    })
})
document.getElementById('home-btn').addEventListener("click", returnToHome)
document.getElementById('play-btn').addEventListener("click", start)
document.getElementById('about-btn').addEventListener("click", showAbout)