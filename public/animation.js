const text = document.getElementById("greetings-text")

let id = null

let fullText = "Hello, there!"
let currentSymbols = 0
let maxSymbols = fullText.length
    
clearInterval(id)
id = setInterval(frame, 10)
 
function frame() {    

    if (currentSymbols === maxSymbols) {
        currentSymbols = 0;
    }
    
    let thisText = ""
    for (let i = 0; i < currentSymbols; i++) {
        thisText += fullText[i]
    }

    console.log(`Text = ${thisText}`)
    text.innerText = thisText
}