import { Report } from 'notiflix/build/notiflix-report-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { getDataUrl, getUserOptions } from './options';
import { incrementStat, updateStat, getStat } from './statistics';
import './tooltips'
import './options'
import strings from './strings'

Report.init({})

let started = false
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
const useFallback = ["AC","CP","DG","EA","IC","TA"] // Flags that need to use the simplified style
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

function hideAllScreens() {
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

function returnToHome() {
    started = false
    currentCountry = null
    previousCountry = null
    questionNum = 0
    progressBarPercent = 0
    score = 0
    streak = 0
    unsavedChanges = false
    hideAllScreens()
    document.getElementById("welcome").style.display = "unset"
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
    if (useFallback.includes(country.code)) {
        flagSvg.src = flagFallbackUrlStart + country.image
    } else {
        flagSvg.src = flagApiEndpoint + country.code + ".svg"
    }
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
            if (questionNum + 1 > questionCount && userOptions.mode == "questions") { // I have no idea why I had to put +2
                console.log("Time to end the game!")
                setTimeout(() => {
                    hideAllScreens()
                    if(((100 * score) / questionCount) > 50) {
                        Report.info("Game Complete!", strings.questionsFinish[Math.floor(Math.random() * strings.questionsFinish.length)].replace("%%", score).replace("%%", questionCount), "Finish", returnToHome)
                    } else {
                        Report.info("Game Complete!", strings.questionsFail[Math.floor(Math.random() * strings.questionsFail.length)].replace("%%", score).replace("%%", questionCount), "Finish", returnToHome)
                    }
                }, 370) // wait for the popup to animate out
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
                    score ++
                    moveOn()
                })
            } else { // YOU'RE WRONG XD GET TROLLED
                if (userOptions.mode == "streak") {
                    Report.failure("Streak lost!", `<b>Correct Answer: ${country.name} </b><br><br>` + strings.loseStreakMessages[Math.floor(Math.random() * strings.loseStreakMessages.length)].replaceAll("%%", streak), "Exit Game", () => {
                        if (!canContinue) return
                        processCanContinue()
                        incrementStat('totalQuestions')
                        incrementStat('totalIncorrect')
                        if (getStat('streak') < streak) {
                            updateStat('streak', streak)
                        }
                        return returnToHome()
                    }, {plainText: false})
                }
                Report.failure("Incorrect", strings.incorrectEndlessMessages[Math.floor(Math.random() * strings.incorrectEndlessMessages.length)].replaceAll("%%", '<b>' + country.name + '</b>'), "Next Question", () => {
                    if (!canContinue) return
                    processCanContinue()
                    incrementStat('totalIncorrect')
                    moveOn()
                    previousCountry = country
                }, {plainText: false})
            }
        })
    })
}

function start() {
    if (started) return
    started = true
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

document.getElementById("close-btn").addEventListener("click", () => {
    if (confirm("Are you sure? Current progress will be lost!")) {
        returnToHome()
    }
})
document.getElementById('play-btn').addEventListener("click", start)