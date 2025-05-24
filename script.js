let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let arr = Array.from(buttons);
let string = "";
let openBracketCount = 0; // Track open parentheses count

let updateInput = (value) => {
    string = value;
    input.value = string;
    
    // Progressive font size adjustment based on length for better visibility
    input.classList.remove('small-text', 'smaller-text', 'tiny-text');
    
    if (string.length > 30) {
        input.classList.add('tiny-text');
    } else if (string.length > 20) {
        input.classList.add('smaller-text');
    } else if (string.length > 15) {
        input.classList.add('small-text');
    }
    
    // Scroll to end to show the latest input
    input.scrollLeft = input.scrollWidth;
    
    // Check if expression is too long
    if (string.length > 80) {
        alert("Error: Expression too long. Please clear and start over.");
        return;
    }
};

arr.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonValue = e.target.innerHTML;
        
        switch (buttonValue) {
            case '=':
                if (openBracketCount > 0) {
                    alert("Error: Unclosed parentheses.");
                    return;
                }
                updateInput(calculateWithBrackets(string)); // Use calculateWithBrackets for accurate evaluation
                break;
            case '(':
                if (openBracketCount < 0) {
                    alert("Error: Unexpected closing bracket.");
                } else {
                    // Add multiplication before ( if previous char is number or )
                    if (string.length > 0 && /[\d)]$/.test(string)) {
                        updateInput(string + '*(');
                    } else {
                        updateInput(string + '(');
                    }
                    openBracketCount++;
                }
                break;
            case ')':
                if (openBracketCount <= 0) {
                    alert("Error: Missing opening bracket.");
                } else {
                    updateInput(string + ')');
                    openBracketCount--;
                }
                break;
            case 'AC':
                updateInput("");
                openBracketCount = 0;
                break;
            case '⌫':
                if (string.length > 0) {
                    const lastChar = string[string.length - 1];
                    updateInput(string.substring(0, string.length - 1));
                    if (lastChar === '(') {
                        openBracketCount--;
                    } else if (lastChar === ')') {
                        openBracketCount++;
                    }
                }
                break;
            case '×':
                if (string.length > 0 && !/[+\-*/]$/.test(string)) {
                    updateInput(string + '*');
                }
                break;
            case '÷':
                if (string.length > 0 && !/[+\-*/]$/.test(string)) {
                    updateInput(string + '/');
                }
                break;
            case '+':
            case '-':
                if (string.length > 0 && !/[+\-*/]$/.test(string)) {
                    updateInput(string + buttonValue);
                }
                break;
            case '%':
                if (string.length > 0 && /\d$/.test(string)) {
                    updateInput(string + '/100');
                }
                break;
            default:
                // For numbers and other characters
                if (/^\d$/.test(buttonValue)) {
                    // Add multiplication before number if previous char is )
                    if (string.length > 0 && /\)$/.test(string)) {
                        updateInput(string + '*' + buttonValue);
                    } else {
                        updateInput(string + buttonValue);
                    }
                } else {
                    updateInput(string + buttonValue);
                }
        }
    });
});

function calculateWithBrackets(expression) {
    // Replace display symbols with JavaScript operators
    let processedExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    // Regular expression to identify nested parentheses
    const nestedParenRegex = /\([^()]+\)/g;

    // Function to recursively add brackets around nested expressions
    function addBrackets(expr) {
        return expr.replace(nestedParenRegex, (match) => `(${match})`);
    }

    // Apply the bracketing function recursively until no more nesting is found
    let modifiedExpr = processedExpr;
    while (nestedParenRegex.test(modifiedExpr)) {
        modifiedExpr = addBrackets(modifiedExpr);
    }

    try {
        // Use Function constructor for safer evaluation (follows BODMAS automatically)
        const result = Function('"use strict"; return (' + modifiedExpr + ')')();
        
        // Handle division by zero and invalid operations
        if (!isFinite(result)) {
            alert("Error: Division by zero or invalid operation.");
            return "";
        }
        
        // Round to avoid floating point precision issues
        const roundedResult = Math.round(result * 1000000000) / 1000000000;
        return roundedResult.toString();
    } catch (error) {
        alert("Error: Invalid expression.");
        return ""; // Reset input on error
    }
}

// Add keyboard support for better user experience
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const button = Array.from(buttons).find(btn => 
        btn.innerHTML === key || 
        (key === 'Enter' && btn.innerHTML === '=') ||
        (key === 'Escape' && btn.innerHTML === 'AC') ||
        (key === 'Backspace' && btn.innerHTML === '⌫') ||
        (key === '*' && btn.innerHTML === '×') ||
        (key === '/' && btn.innerHTML === '÷')
    );
    
    if (button) {
        e.preventDefault();
        button.click();
        // Visual feedback for keyboard press
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = '', 100);
    }
});