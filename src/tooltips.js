import tippy from 'tippy.js'

const tooltipsById = {
    "easy-label": "Mostly well known countries and flags",
    "normal-label": "Many smaller and lesser known countries are included, but there aren't any tiny island nations",
    "expert-label": "Almost every country and territory is included, only for geography super nerds",
    "endless-label": "Keep going forever and ever, no consequences",
    "questions-label": "Ask an arbitrary number of questions before the game is over and you get a score",
    "streak-label": "Keep playing and growing your streak until you get a question wrong"
}

for (let elementId in tooltipsById) {
    console.debug("adding tooltip for: " + elementId)
    tippy(document.getElementById(elementId), {
        content: tooltipsById[elementId],
        placement: 'top',
        animation: 'shift-away-subtle'
    })
}