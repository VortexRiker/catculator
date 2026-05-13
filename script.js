function Operand(value = "")
{
    this.value = value;
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

    return Number.isNaN(+result) ? result : String(+result.toFixed(5));
}

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

function addContent(operand, content)
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

function processOperand(operand, content)
{
    if (content === ".")
    {
        tryAddSeparator(operand, content);
    }
    else
    {
        addContent(operand, content);
    }
}

function getCurrentOperand()
{
    return operator ? rightOperand : leftOperand;
}

function processDigit(event)
{
    const content = event.target.textContent;
    const operand = getCurrentOperand();
    
    processOperand(operand, content)
}

function resetOperand(operand, value = "")
{
    operand.value = value;
    operand.isAnswer = value ? true : false;
}

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

function processOperator(event)
{
    const content = event.target.textContent;

    if(Number.isNaN(leftOperand.getValue()))
    {
        return;
    }
    if(rightOperand.value)
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
    leftOperand.isAnswer = false;
    operator = "";
    rightOperand.value = "";
}

function initializeClear()
{
    const clear = document.querySelector(".clear");
    clear.addEventListener("click", processClear);
}

function removeLastSymbol(operand)
{
    if (operand.value === "0" || operand.isAnswer)
    {
        return;
    }
    operand.value = operand.value.slice(0,operand.value.length - 1);
}

function processDelete()
{
    const operand = getCurrentOperand();

    removeLastSymbol(operand);
}

function initializeDelete()
{
    const del = document.querySelector(".delete");
    del.addEventListener("click", processDelete);
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
    initializeDelete();
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