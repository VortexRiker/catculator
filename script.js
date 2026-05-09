let leftOperand = "";
let rightOperand = "";
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
        return null;
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

    return result;
}

function processDigit(event)
{
    const content = event.target.textContent;
    if(!operator)
    {
        leftOperand += content;
    }
    else
    {
        rightOperand += content;
    }
}

function processCalculation()
{
    if (!rightOperand)
    {
        return;
    }
    leftOperand = operate(+leftOperand, operator, +rightOperand);
    operator = "";
    rightOperand = "";
}

function processOperator(event)
{
    const content = event.target.textContent;
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
    leftOperand = "";
    operator = "";
    rightOperand = "";
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

function initializeCommands()
{
    initializeClear();
    initializeEquals();
}

function processDisplay(event)
{
    const display = document.querySelector(".display");
    display.textContent = leftOperand + operator + rightOperand;
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