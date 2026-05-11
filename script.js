function Operand(value = "")
{
    this.value = value;
    this.hasSeparator = false;
    this.isAnswer = false;
    this.getValue = function ()
    {
        return +this.value;
    }
}

let leftOperand = new Operand();
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
        return "Only Cats can access infinity.";
    }

    return lhs/rhs;
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

    return Number.isNaN(+result) ? result : +result.toFixed(5);
}

function processOperand(operand, content)
{
    if(content === "." && !operand.isAnswer && !operand.hasSeparator)
    {
        operand.value += content;
        operand.hasSeparator = true;
    }
    else if(operand.isAnswer || (operand.getValue() === 0 && !operand.hasSeparator))
    {
        operand.value = content;
        operand.isAnswer = false;
    }
    else
    {
        operand.value += content;
    }

    return operand;
}

function processDigit(event)
{
    const content = event.target.textContent;

    if(!operator)
    {
        processOperand(leftOperand, content)
    }
    else
    {
        processOperand(rightOperand, content);
    }
}

function processCalculation()
{
    if (!rightOperand.value)
    {
        return;
    }

    leftOperand.value = operate(leftOperand.getValue(), operator, rightOperand.getValue());;
    leftOperand.isAnswer = true;
    operator = "";
    rightOperand.value = "";
}

function processOperator(event)
{
    const content = event.target.textContent;

    if(Number.isNaN(leftOperand.getValue()))
    {
        return;
    }
    if(rightOperand)
    {
        processCalculation();
    }

    operator = content;
}

function initializeDigits()
{
    const digits = document.querySelectorAll(".digit");
    digits.forEach(element => element.addEventListener("click", processDigit));
}

function initializeOperators()
{
    const operators = document.querySelectorAll(".operation");
    operators.forEach(element => element.addEventListener("click", processOperator));
}

function processClear()
{
    leftOperand.value = "0";
    operator = "";
    rightOperand.value = "";
}

function initializeClear()
{
    const clear = document.querySelector(".clear");
    clear.addEventListener("click", processClear);
}

function initializeEquals()
{
    const equals = document.querySelector(".equals");
    equals.addEventListener("click", processCalculation);
}

function processSeparator()
{
    if(!operator)
    {
       processOperand(leftOperand, "."); 
    }
    else
    {
        processOperand(rightOperand, ".");
    }
}

function initializeSeparator()
{
    const separator = document.querySelector(".separator");
    separator.addEventListener("click", processSeparator);
}

function initializeCommands()
{
    initializeClear();
    initializeEquals();
    initializeSeparator();
}

function processDisplay(event)
{
    const display = document.querySelector(".display");
    if (!rightOperand.value)
    {
        display.textContent = leftOperand.value;
    }
    else
    {
        display.textContent = rightOperand.value;
    }
}

function initializeDisplay()
{
    const calculator = document.querySelector(".calculator");
    calculator.addEventListener("click", processDisplay);
}

function initializeCalculator()
{
    initializeDigits();
    initializeOperators();
    initializeCommands();
    initializeDisplay();
}

initializeCalculator();