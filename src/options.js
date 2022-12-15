import { applyTheme, resetTheme } from "./themes"

const radios = Array.from(document.querySelectorAll("input[type='radio']"))
let userOptions = {}
let userSettings = {
    "theme": "default-theme"
}

radios.forEach((input) => {
    if (input.id.startsWith('s-')) {
        // Setting handler
        input.addEventListener('input', () => {
            userSettings[input.name] = input.id.split("s-")[1]
            console.debug(userSettings)
            saveSettings(userSettings)
            if (userSettings.theme != "default-theme") {
                applyTheme(userSettings.theme)
            } else {
                resetTheme()
            }
        })
    } else {
        // Option handler
        input.addEventListener('input', () => {
            userOptions[input.name] = input.id
            console.debug(userOptions)
            document.getElementById("questions-set").classList.toggle("hidden", !document.getElementById("questions").checked)
        })
        if (!userOptions[input.name]) {
            userOptions[input.name] = document.querySelector(`input[name='${input.name}']:checked`).id
        }
    }
})

export function  getDataUrl() {
    return `data/${userOptions.difficulty}-opt.json`
}

export function getUserOptions() {
    return userOptions
}

function loadSettings() {
    return JSON.parse(localStorage.getItem("flag-guesser-settings"))
}

function saveSettings(settings) {
    localStorage.setItem("flag-guesser-settings", JSON.stringify(settings))
}

if (!loadSettings()) {
    saveSettings(userSettings)
} else {
    let loadedSettings = loadSettings()
    for (let k in userSettings) {
        if (typeof loadedSettings[k] == 'undefined') {
            console.log("Adding newly added setting " + k + ", this should only appear once.")
            loadedSettings[k] = userSettings[k]
            saveSettings(loadedSettings)
        }
    }
    userSettings = loadedSettings
}
applyTheme(userSettings.theme)

document.getElementById("questions-set").classList.toggle("hidden", !document.getElementById("questions").checked)