// Register type effect
window.onload = function() {
    Array.from(document.getElementsByClassName("typed")).forEach(typeEffect);
}

function typeEffect(typebox) {
    text = typebox.innerText;
    typebox.innerText = "";
    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            typebox.innerText += text[i];
        }, 30 * i);
    }
}