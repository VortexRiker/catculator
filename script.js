// A constructor for the operand objects
function Operand(value = "")
{
    this.value = String(value);
    this.isAnswer = false;
    this.getValue = function ()
    {
        return +this.value;
    }
}

let leftOperand = new Operand(0);
let rightOperand = new Operand();
let operator = "";

// Add two numbers and return the result
function add(lhs, rhs)
{
    return lhs + rhs;
}

// Subtract two numbers and return the result
function subtract(lhs, rhs)
{
    return lhs - rhs;
}

// Multiply two numbers and return the result
function multiply(lhs, rhs)
{
    return lhs * rhs;
}

// Divide two numbers and return the result
// Check divisor(right-hand-side) for zero equality
// TODO: Add margin check for the divisor when floating point numbers will be added
function divide(lhs, rhs)
{
    if (rhs === 0)
    {
        return "Sorry! Only Cats can access the Infinity.";
    }

    return lhs/rhs;
}

// Remove trailing zeroes from the passed value
function trimTrailingZeroes(valueString)
{
    // Try to split on "e" symbol. If value does not contain "e"
    // Then resulting array will have just one element
    const valueArray = valueString.split("e");

    // If value ends with zero AND contains a "." 
    // OR if the value ends with "." which would happen when all zeroes are removed 
    while((valueArray[0].at(-1) === "0" && valueArray[0].includes(".")) || valueArray[0].at(-1) === ".")
    {
        // Remove the last character of the value String
        valueArray[0] = valueArray[0].slice(0, -1);
    }
    // Re-attach the exponent part of the value if there were one
    return valueArray[1] ? valueArray.join("e") : valueArray[0];
}

// Format numeric answer so it can fit the calculator display
function processNumericAnswer(value)
{
    const THRESHOLD = 1e7;
    const PRECISION = 3;

    if (Math.abs(value) > THRESHOLD)
    {
        value = value.toExponential(PRECISION);
    }
    else
    {
        value = value.toFixed(PRECISION);
    }

    return trimTrailingZeroes(String(value));
}

// Format calculated value, so it can be presented on calculator display
function processAnswer(initialValueString)
{
    let value = +initialValueString;

    if (Number.isNaN(value))
    {
        return initialValueString;
    }

    return processNumericAnswer(value);
}

// Calculate the result of specified operation, using provided numbers as operands
function operate(lhs, operator, rhs)
{
    let result = "";
    switch(operator)
    {
        case "+":
        {
            result = add(lhs, rhs);
            break;
        }
        case "-":
        {
            result = subtract(lhs, rhs);
            break;
        }
        case "*":
        {
            result = multiply(lhs, rhs);
            break;
        }
        case "/":
        {
            result = divide(lhs, rhs);
            break;
        }
        default:
        {
            break;
        }
    }

    return processAnswer(result);
}

// Attach "." to the operand if it does not have one and is not an answer
function tryAddSeparator(operand, content)
{

    if (!operand.value.includes(".")|| operand.isAnswer)
    {
        if(operand.isAnswer)
        {
            operand.value = "0";
            operand.isAnswer = false;
        }
        operand.value += content;
    }
}

// Add digit to an operand
function addDigit(operand, content)
{
    if(operand.isAnswer || (operand.getValue() === 0 && !operand.value.includes(".")))
    {
        operand.value = content;
        operand.isAnswer = false;
    }
    else
    {
        operand.value += content;
    }
}
// Add specified content to an operand
function processOperand(operand, content)
{
    if (content === ".")
    {
        tryAddSeparator(operand, content);
    }
    else
    {
        addDigit(operand, content);
    }
}

// Return currently processed operand
function getCurrentOperand()
{
    return operator ? rightOperand : leftOperand;
}

// Return the content of the pressed button
// In case of keyboard press return key code
// In case of mouse press return defined in HTML data-value, 
// which is eqiualent of the key code.
function getEventContent(event)
{
    if (event.type == "keydown")
    {
        return event.key;
    }
    else
    {
        return event.target.dataset.value;
    }
}

// Process a "Digit" button press, which includes "." separator button
function processDigit(event)
{
    const content = getEventContent(event);
    const operand = getCurrentOperand();
    
    processOperand(operand, content)
}

// Set operand back to either initial state or to a specified value
function resetOperand(operand, value = "")
{
    operand.value = value;
    operand.isAnswer = value ? true : false;
}

// Calculate the result of user provided expression and store it in lhs operand
function processCalculation()
{
    if (!rightOperand.value)
    {
        return;
    }

    resetOperand(leftOperand, operate(leftOperand.getValue(), operator, rightOperand.getValue()));
    operator = "";
    resetOperand(rightOperand);
}

// Process a "Operator" button press 
function processOperator(event)
{
    if(Number.isNaN(leftOperand.getValue()))
    {
        return;
    }

    if(rightOperand.value)
    {
        processCalculation();
    }

    operator = getEventContent(event);
}

// Add event listeners to "Digit" buttons
function initializeDigits()
{
    const digits = document.querySelectorAll(".digit");
    digits.forEach(element => element.addEventListener("click", processDigit));
}

// Add event listeners to "Operator" buttons
function initializeOperators()
{
    const operators = document.querySelectorAll(".operation");
    operators.forEach(element => element.addEventListener("click", processOperator));
}

// Process a press of a "Clear" button
function processClear()
{
    leftOperand.value = "0";
    leftOperand.isAnswer = false;
    operator = "";
    rightOperand.value = "";
}

// Add event listeners to a "Clear" button
function initializeClear()
{
    const clear = document.querySelector(".clear");
    clear.addEventListener("click", processClear);
}

// Remove the last character of a specified operand
function removeLastSymbol(operand)
{
    if (operand.isAnswer)
    {
        processClear();
        return;
    }
    if (operand.value.length <= 1)
    {
        operand.value = "0";
        return;
    }
    operand.value = operand.value.slice(0,operand.value.length - 1);
}

// Process a press of a "Delete" button
function processDelete()
{
    const operand = getCurrentOperand();

    removeLastSymbol(operand);
}

// Add event listeners to a "Delete" button
function initializeDelete()
{
    const del = document.querySelector(".delete");
    del.addEventListener("click", processDelete);
}

// Add event listener to a "Equals" button
function initializeEquals()
{
    const equals = document.querySelector(".equals");
    equals.addEventListener("click", processCalculation);
}

// Process a press of a "Separator" button
function processSeparator()
{
    const operand = getCurrentOperand();
    processOperand(operand, "."); 
}

// Add event listener to a "Separator" button
function initializeSeparator()
{
    const separator = document.querySelector(".separator");
    separator.addEventListener("click", processSeparator);
}

// Add visual cues to a digital buttons when a keyboard key is pressed.
// For example: User presses a keyboard key "1"
// and corresponding "Digit" button "1" changes color as if it is pressed
function tryAddVisuals(event)
{
    const key = event.key === "=" ? "Enter" : event.key;
    const element = document.querySelector(`[data-value="${key}"]`);
    if (element)
    {
        element.classList.add("active");
    }
}

// Remove visual cues on digital buttons after a keyboard key is released.
// Look at example for tryAddVisuals
function tryRemoveVisuals(event)
{
    const key = event.key === "=" ? "Enter" : event.key;
    const element = document.querySelector(`[data-value="${key}"]`);
    if (element)
    {
        element.classList.remove("active");
    }
}

// Process a keyboard presses of the user
function processKeyboard(event)
{
    tryAddVisuals(event);

    if (event.key >= "0" && event.key <= "9" || event.key === ".")
    {
        processDigit(event);
    }
    else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/")
    {
        processOperator(event);
    }
    else if (event.key === "=" || event.key === "Enter")
    {
        processCalculation();
    }
    else if (event.key === "Backspace")
    {
        processDelete();
    }
}
// Add event listeners to the keyboard
function initializeKeyboard()
{
    document.addEventListener("keydown", processKeyboard);
    document.addEventListener("keyup", tryRemoveVisuals);
}

// Process a "Pi" button press
function processPi()
{
    const operand = getCurrentOperand();

    operand.value = Math.PI.toFixed(5);
}

// Add event listeners to a "Pi" button
function initializePi()
{
    const pi = document.querySelector(".pi");
    pi.addEventListener("click", processPi);
}

// Process a "Negate" button press
function processNegation()
{
    const operand = getCurrentOperand();

    if(operand.isAnswer)
    {
        return;
    }
    
    let initialValue = +operand.value;
    operand.value = String((-1) * initialValue);
}

// Add event listeners to a "Negate" button
function initializeNegation()
{
    const negation = document.querySelector(".negation");
    negation.addEventListener("click", processNegation);
}

// Add event listeners to operators that require special handling
function initializeCustomOperators()
{
    initializeClear();
    initializeDelete();
    initializeEquals();
    initializeSeparator();
    initializePi();
    initializeNegation();
}

// Process a calculator display update
function processDisplay(event)
{
    const display = document.querySelector(".display");
    if (!rightOperand.value)
    {
        if (Number.isNaN(+leftOperand.value))
        {
            display.classList.add("displayText");
        }
        else
        {
            display.classList.remove("displayText");
        }
        display.textContent = leftOperand.value;
    }
    else
    {
        display.textContent = rightOperand.value;
    }
}

// Add event listeners that a responsible for Calculator's display update
function initializeDisplay()
{
    document.addEventListener("click", processDisplay);
    document.addEventListener("keydown", processDisplay);
}

function initializeDragHandling()
{
    document.addEventListener("dragstart", event => event.preventDefault());
}

// Add event listener that prevents button focus-select after mouse interactions.
// Without this, if user would press a button with a mouse and then would try to navigate 
// with a keyboard, then the last pressed by mouse button would have a focus selection
// which adds a visual noise and partially breaks "Enter" and "Spacebar" keyboard key presses.
function initializeFocusHandling()
{
    document.addEventListener("pointerup", () => document.activeElement.blur())
}

function initializeGlobalSettings()
{
    initializeDragHandling();
    initializeFocusHandling();
}

// Initialize calculator's event-handling routine
function initializeCalculator()
{
    initializeGlobalSettings();
    initializeDigits();
    initializeKeyboard();
    initializeOperators();
    initializeCustomOperators();
    initializeDisplay();
}

initializeCalculator();