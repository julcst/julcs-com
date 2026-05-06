// Register type effect
Array.from(document.getElementsByClassName("typed")).forEach(typeEffect);
function typeEffect(node) {
    startTypeEffect(0, 10, node);
}

// Start type effect for every text childNode of the node
function startTypeEffect(t, typeSpeed, node) {
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        // Skip nodes that are just whitespace between tags
        if (text.trim().length === 0) return t;
        
        node.textContent = "";
        for (let i = 0; i < text.length; i++) {
            setTimeout(textSetter(node, text.slice(0, i + 1)), t + typeSpeed * i);
        }
        return t + typeSpeed * text.length;
    } else {
        let endT = t;
        for (const child of node.childNodes) {
            endT = startTypeEffect(endT, typeSpeed, child);
        }
        return endT;
    }
}

function textSetter(textNode, text) {
    return () => textNode.textContent = text;
}