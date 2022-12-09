const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum harum quibusdam quod odit doloribus rem quis, voluptatibus quae quisquam impedit voluptates repellendus. Unde repudiandae officia molestias quisquam maxime nostrum magni?"

function setContent(element, content, options) {
    if (options.plainText) {
        element.innerText = content
    } else {
        element.innerHTML = content
    }
}

class Modal {
    constructor(options) {
        if (!('content' in options)) {
            options.content = lorem
        }
        if (!('title' in options)) options.title = ""
        if (!('plainText' in options)) options.plainText = true
        if (!('clickBackdropToClose' in options)) options.clickBackdropToClose = true
        if (!('closeKeys' in options)) options.closeKeys = ['Escape']
        const backdrop = document.createElement("div")
        backdrop.className = "modal-backdrop"
        document.body.appendChild(backdrop)
        const modalElement = document.createElement("div")
        modalElement.className = "modal-container"
        document.body.appendChild(modalElement)
        const headerContainer = document.createElement("header")
        headerContainer.className = "modal-header"
        modalElement.appendChild(headerContainer)
        const titleElement = document.createElement("span")
        titleElement.className = "modal-title"
        setContent(titleElement, options.title, options)
        headerContainer.appendChild(titleElement)
        const xButton = document.createElement("button")
        xButton.innerHTML = "X"
        xButton.className = 'modal-close'
        headerContainer.appendChild(xButton)
        const mainContent = document.createElement("div")
        mainContent.className = 'modal-content'
        setContent(mainContent, options.content, options)
        modalElement.appendChild(mainContent)
        this.close = function() {
            if (!options.callbackReplaceDefault) {
                modalElement.remove()
                backdrop.remove()
            }
            if ('onClose' in options) {
                options.onClose()
            }
            document.removeEventListener("keydown", processKeyDown)
        }
        function processKeyDown(event) {
            if (options.closeKeys.includes(event.key) || options.closeKeys.includes(event.keyCode)) {
                xButton.click() // 'this' changes and stuff
            }
        }
        document.addEventListener("keydown", processKeyDown)
        xButton.addEventListener("click", this.close)
        if (options.clickBackdropToClose) {
            backdrop.addEventListener("click", this.close)
        }
    }
}

export default Modal