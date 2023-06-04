// Register type effect
Array.from(document.getElementsByClassName("typed")).forEach(typeEffect);

function typeEffect(typebox) {
    target = typebox.innerText;
    text = "";
    typebox.innerText = text;
    for (let i = 0; i < target.length; i++) {
        setTimeout(() => {
            text += target[i];
            typebox.innerText = text;
        }, 30 * i);
    }
}