import { applyTheme, resetTheme } from "./themes"

const radios = Array.from(document.querySelectorAll("input[type='radio']"))
let userOptions = {}
let userSettings = {
    "theme": "default-theme",
    "popup-animation": "fade"
}

radios.forEach((input) => {
    if (input.id.startsWith('s-')) {
        // Setting handler
        input.addEventListener('input', () => {
            userSettings[input.name] = input.value
            console.debug(userSettings)
            saveSettings(userSettings)
            if (userSettings.theme != "default") {
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
            processSubSets()
        })
        if (!userOptions[input.name]) {
            userOptions[input.name] = document.querySelector(`input[name='${input.name}']:checked`).id
        }
    }
})

export function  getDataUrl() {
    if (userOptions.set == "us-states-by-map") return 'data/us-states-opt.json'
    return `data/${userOptions.set}-opt.json`
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

export function getSetting(settingName) {
    return userSettings[settingName]
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
            processSubSets()
        }
    }
    userSettings = loadedSettings
}
applyTheme(userSettings.theme)

function processSubSets() {
    document.querySelectorAll('fieldset.subset[data-requires]').forEach((subset) => {
        if (subset.dataset.requires) {
            if (document.getElementById(subset.dataset.requires) && document.getElementById(subset.dataset.requires).type == "radio") {
                if (document.getElementById(subset.dataset.requires).checked) {
                    subset.classList.remove("hidden")
                } else {
                    subset.classList.add("hidden")
                }
            }
        }
    })
}

processSubSets()