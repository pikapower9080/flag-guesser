import { Confirm, Report } from "notiflix"

export let reportOptions = {}
export let confirmOptions = {borderRadius: 10}

export const themes = {
    "dark-theme": {
        "bg": "#232323",
        "text-color": "#FFFFFF",
        "secondary-text-color": "#d1d1d1",
        "option-bg": "#434343",
        "option-hover-bg": "#303030",
        "option-border-color": "#8a8a8a",
        "progress-bar-color": "#1963bd",
        "progress-bar-bg": "#636363",
        "radio-bg": "#4D4D4D",
        "radio-selected-bg": "#76EA5D",
        "gray-btn-color": "#606060",
        "gray-btn-hover": "#545454",
        "card-border": "#626262",
        "fieldset-border": "#6d6d6d",
        "link-color": "#2BA7DE",
        "nx-global": {
            "messageColor": "#FFFFFF",
            "backgroundColor": "#353535",
            "success": {
                "titleColor": "#FFFFFF",
                "messageColor": "#FFFFFF",
            },
            "failure": {
                "titleColor": "#FFFFFF",
                "messageColor": "#FFFFFF",
            }
        }
    }
}

export function applyTheme(themeName) {
    if (themeName == "default-theme") return
    let theme = themes[themeName]
    if (!theme) {console.warn(`Theme "${themeName}" not found!`); return}
    for (let property in theme) {
        if (property.startsWith('nx-')) continue
        document.documentElement.style.setProperty(`--${property}`, theme[property])
    }
    let globalOptions = theme['nx-global']
    let newGlobalOptions = {}
    for (let property in globalOptions) {
        if (property == "all") continue
        newGlobalOptions[property] = globalOptions[property]
    }
    newGlobalOptions['plainText'] = false
    reportOptions = newGlobalOptions
    newGlobalOptions['borderRadius'] = 10
    confirmOptions = newGlobalOptions
    document.querySelector(`#s-${themeName}`).checked = true
}

export function resetTheme() {
    document.documentElement.setAttribute("style", "")
    confirmOptions = {plainText: false, borderRadius: 10}
    reportOptions = {plainText: false}
}