import { Report } from 'notiflix/build/notiflix-report-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

Report.init({})

let started = false
let optionCount = 4
let data = {}
let nextCountryReady = true
let currentCountry; // grr no cheating
let dataUrl = "data/expert-opt.json"
const flagApiEndpoint = "https://countryflagsapi.com/svg/"
const flagFallbackUrlStart = "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/"

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

const guessScreen = document.getElementById("guess")
const flagSvg = document.getElementById("flag-svg")
const optionsDiv = document.getElementById("options")

flagSvg.addEventListener("error", () => {
    flagSvg.src = flagFallbackUrlStart + currentCountry.image
})

function guessFor(country) {
    let options = []
    currentCountry = country
    flagSvg.src = flagApiEndpoint + country.code
    clearOptions()
    function pick() {
        const rCountry = randomCountry()
        if (options.includes(rCountry.name)) { // No duplicates!
            return pick()
        }
        options.push(rCountry.name)
    }
    for (let i = 0; i < optionCount - 1; i++) {
        pick()
    }
    // Add correct option randomly
    options.splice(Math.floor(Math.random() * options.length + 1), 0, country.name)
    options.forEach((option) => {
        let btn = document.createElement("button")
        btn.className = "option"
        btn.innerText = option
        optionsDiv.appendChild(btn)
        btn.addEventListener("click", () => {
            if (option == country.name) { // YAY IT'S CORRECT!!!! LET'S GO!!!
                Report.success("Correct!", "", "Next Question", () => {
                    guessFor(randomCountry())
                })
            } else { // YOU'RE WRONG XD GET TROLLED
                Report.failure("Incorrect", "The correct answer was " + country.name + ".", "Next Question", () => {
                    guessFor(randomCountry())
                })
            }
        })
    })
}

function start() {
    if (started) return
    started = true
    Loading.circle('Fetching data...')
    fetch(dataUrl).then((res) => {
        Loading.change('Parsing data...')
        res.json().then((fetchedData) => {
            data = fetchedData
            Loading.remove()
            hideAllScreens()
            guessScreen.style.display = "unset"
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

document.getElementById('play-btn').addEventListener("click", start)