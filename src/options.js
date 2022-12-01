const radios = Array.from(document.querySelectorAll("input[type='radio']"))
let userOptions = {}

radios.forEach((input) => {
    input.addEventListener('input', () => {
        userOptions[input.name] = input.id
        console.debug(userOptions)
        document.getElementById("questions-set").classList.toggle("hidden", !document.getElementById("questions").checked)
    })
    if (!userOptions[input.name]) {
        userOptions[input.name] = document.querySelector(`input[name='${input.name}']:checked`).id
    }
})

export function  getDataUrl() {
    return `data/${userOptions.difficulty}-opt.json`
}

export function getUserOptions() {
    return userOptions
}

document.getElementById("questions-set").classList.toggle("hidden", !document.getElementById("questions").checked)