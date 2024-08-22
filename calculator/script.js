let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let arr = Array.from(buttons);
let string = "";
let openBracketCount = 0; // Track open parentheses count

let updateInput = (value) => {
  string = value;
  input.value = string;
};

arr.forEach(button => {
  button.addEventListener('click', (e) => {
    const buttonValue = e.target.innerHTML;

    switch (buttonValue) {
      case '=':
        updateInput(calculateWithBrackets(string)); // Use calculateWithBrackets for accurate evaluation
        break;
      case '(':
        if (openBracketCount < 0) {
          alert("Error: Unexpected closing bracket.");
        } else {
          updateInput(string + '(');
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
        updateInput(string.substring(0, string.length - 1));
        openBracketCount -= (string[string.length - 1] === '(') ? 1 : 0; // Adjust openBracketCount for backspace on '('
        break;
      default:
        updateInput(string + buttonValue);
    }
  });
});

function calculateWithBrackets(expression) {
  // Regular expression to identify nested parentheses
  const nestedParenRegex = /\([^()]+\)/g;

  // Function to recursively add brackets around nested expressions
  function addBrackets(expr) {
    return expr.replace(nestedParenRegex, (match) => `(${match})`);
  }

  // Apply the bracketing function recursively until no more nesting is found
  let modifiedExpr = expression;
  while (nestedParenRegex.test(modifiedExpr)) {
    modifiedExpr = addBrackets(modifiedExpr);
  }

  try {
    // Use eval with caution due to security risks, consider a safer alternative
    return eval(modifiedExpr);
  } catch (error) {
    alert("Error: Invalid expression.");
    return ""; // Reset input on error
  }
}
