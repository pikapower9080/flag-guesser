import { getSetting } from './options'

export let reportOptions = {}
export let confirmOptions = {borderRadius: 10}

export const themes = {
    "dark": {
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
    },
    "dim": {
        "bg": "#38393D",
        "text-color": "#F0F0F0",
        "secondary-text-color": "#D0D3D4",
        "option-bg": "#515A5A",
        "option-hover-bg": "#424949",
        "option-border-color": "#8a8a8a",
        "progress-bar-color": "#3498DB",
        "progress-bar-bg": "#636363",
        "radio-bg": "#4d4d4d",
        "radio-selected-bg": "#76EA5D",
        "gray-btn-color": "#606060",
        "gray-btn-hover": "#545454",
        "card-border": "#626262",
        "fieldset-border": "#808B96",
        "link-color": "#2874A6",
        "nx-global": {
            "messageColor": "#F0F0F0",
            "backgroundColor": "#38393D",
            "success": {
                "titleColor": "#f0f0f0",
                "messageColor": "#f0f0f0"
            },
            "failure": {
                "titleColor": "#f0f0f0",
                "messageColor": "#f0f0f0"
            }
        }
    },
    "usa": {
        "bg": "#ededed",
        "text-color": "#000000",
        "secondary-text-color": "#725be1",
        "option-bg": "#D6EAF8",
        "option-hover-bg": "#AED6F1",
        "option-border-color": "#2980B9",
        "progress-bar-color": "#cc0f0f",
        "progress-bar-bg": "#bfbfbf",
        "radio-bg": "#e9dddd",
        "radio-selected-bg": "#c44040",
        "radio-selected-color": "#ffffff",
        "radio-selected-border": "#ff3d3d",
        "gray-btn-color": "#d6d6d6",
        "gray-btn-hover": "#c2c2c2",
        "card-border": "#b0b0b0",
        "fieldset-border": "#a3a3a3",
        "link-color": "#2b88b1",
        "nx-global": {
            "cancelButtonBackground": "#cc0f0f",
            "okButtonBackground": "#725be1",
            "titleColor": "#725be1",
            "success": {
                "messageColor": "#000000",
                "buttonBackground": "#E74C3C"
            },
            "failure": {
                "titleColor": "#cc0f0f",
                "messageColor": "#000000",
                "buttonBackground": "#E74C3C"
            }
        }
    },
    "ireland": {
        "bg": "#ededed",
        "text-color": "#000000",
        "secondary-text-color": "#ff8438",
        "option-bg": "#f0b27a",
        "option-hover-bg": "#dda169",
        "option-border-color": "#b87d00",
        "progress-bar-color": "#ff7b38",
        "progress-bar-bg": "#c9c9c9",
        "radio-bg": "#d4d4d4",
        "radio-selected-bg": "#1fc765",
        "radio-selected-color": "#000000",
        "radio-selected-border": "#146114",
        "gray-btn-color": "#d1d1d1",
        "gray-btn-hover": "#c7c7c7",
        "card-border": "#bababa",
        "fieldset-border": "#b1d2b8",
        "link-color": "#2ba7de",
        "nx-global": {
            "okButtonBackground": "#ff7b38",
            "success": {
                "buttonBackground": "#ff7b38"
            },
            "failure": {
                "buttonBackground": "#ff7b38"
            }
        }
    }
}

export function applyTheme(themeName) {
    if (themeName == "default-theme" || themeName == "default") return
    resetTheme(true)
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
    newGlobalOptions['cssAnimationStyle'] = getSetting('popup-animation')
    reportOptions = newGlobalOptions
    newGlobalOptions['borderRadius'] = 10
    confirmOptions = newGlobalOptions
    try {
        document.querySelector(`#s-popup-${getSetting('popup-animation')}`).checked = true
        document.querySelector(`#s-${themeName}`).checked = true
    } catch(e) {alert(e)}    
    document.querySelector("meta[name='theme-color']").content = theme.bg
}
export function resetTheme(noThemeColor) {
    document.documentElement.setAttribute("style", "")
    confirmOptions = {plainText: false, borderRadius: 10, cssAnimationStyle: getSetting('popup-animation')}
    reportOptions = {plainText: false, cssAnimationStyle: getSetting('popup-animation')}
    if (!noThemeColor) {
        document.querySelector("meta[name='theme-color']").content = "#ededed"
    }
}