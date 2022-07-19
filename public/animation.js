const text = document.getElementById("greetings-text")

let id = null

let fullText = "Hello, there!"
let minSymbols = 1
let maxSymbols = fullText.length
let currentSymbols = minSymbols
    
clearInterval(id)
id = setInterval(frame, 500)
 
function frame() {    

    if (currentSymbols === maxSymbols) {
        currentSymbols = minSymbols
    }
    
    let thisText = ""
    for (let i = 0; i < currentSymbols; i++) {
        thisText += fullText.at(i)
    }

    // console.log(`Text = ${thisText}`)
    text.innerText = thisText

    currentSymbols ++
}