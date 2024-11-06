import { Variables } from "../types/types";
import { additionOrSubtractionRegex, exponentiationRegex, exponentiationWithDecimalsRegex, multiplicationOrDivisionRegex, parenthesisRegex } from "./constants";

// Function to evaluate an expression with support for `+`, `-`, `*`, `/`, and `^`
export const evaluateExpression = (formula: string, variables: Variables): number => {
    formula = formula.replace(/\s/g, "");
    // Normalize consecutive operators without parentheses

    validateFormula(formula);

    // add multiplication sign for consecutive numbers or variables
    let parsedFormula = formula.replace(/(\d)([a-zA-Z])/g, '$1*$2')      // number followed by variable
        .replace(/([a-zA-Z])(\d)/g, '$1*$2')      // variable followed by number
        .replace(/([a-zA-Z])([a-zA-Z]+)/g, (_match, p1, p2) => {
            return p1 + '*' + p2.split('').join('*');  // handles multiple consecutive variables
        })
        .replace(/([a-zA-Z])([a-zA-Z]+)/g, (_match, p1, p2) => {
            return p1 + '*' + p2.split('').join('*'); // handles "ab" -> "a*b"
        })
        .replace(/([a-zA-Z])\s*\(/g, '$1*(')        // variable followed by '('
        .replace(/(\d)\s*\(/g, '$1*(')             // number followed by '('
        .replace(/\)([a-zA-Z])/g, ')*$1')           // closing parenthesis followed by variable
        .replace(/(\))(\d)/g, '$1*$2');              // closing parenthesis followed by number

    // Replace variables in the formula with their values
    parsedFormula = parsedFormula.replace(/[a-zA-Z]/g, (match) => {
        const value = variables[match];
        if (value === undefined) throw new Error(`Variable ${match} is not defined.`);
        return value.toString();
    });

    parsedFormula = parsedFormula
        .replace(/\+\+/g, "+") // Replace `++` with `+`
        .replace(/--/g, "+") // Replace `--` with `+`
        .replace(/\+-/g, "-") // Replace `+-` with `-`
        .replace(/-\+/g, "-"); // Replace `-+` with `-`

    //Handle nested negatives by simplifying `-(-X)` to `X`
    while (/\(-\(-/.test(parsedFormula)) {
        parsedFormula = parsedFormula.replace(/\(-\(-([^\)]+)\)\)/g, "$1");
    }

    // Evaluate exponentiation first, then multiplication/division, then addition/subtraction
    const evaluateSimpleExpression = (exp: string): number => {
        // Evaluate the contents of parentheses first
        while (parenthesisRegex.test(exp)) {
            exp = exp.replace(parenthesisRegex, (_match, innerExp) => {
                return evaluateSimpleExpression(innerExp).toString(); // Evaluate inner expression
            });
        }

        // Exponentiation
        while (exponentiationRegex.test(exp)) {
            exp = exp.replace(exponentiationWithDecimalsRegex, (_, base, __, exponent) =>
                Math.pow(parseFloat(base), parseFloat(exponent)).toString()
            );
        }

        // Multiplication and division
        while (multiplicationOrDivisionRegex.test(exp)) {
            exp = exp.replace(multiplicationOrDivisionRegex, (_, left, __, operator, right) => {
                const a = parseFloat(left);
                const b = parseFloat(right);
                return operator === '*' ? (a * b).toString() : (a / b).toString();
            });
        }

        // Addition and subtraction
        while (additionOrSubtractionRegex.test(exp)) {
            exp = exp.replace(additionOrSubtractionRegex, (_, left, __, operator, right) => {
                const a = parseFloat(left);
                const b = parseFloat(right);
                return operator === '+' ? (a + b).toString() : (a - b).toString();
            });
        }
        return parseFloat(exp);
    };


    // Return the final calculated result
    return evaluateSimpleExpression(parsedFormula);
};

const validateFormula = (formula: string) => {
    // Define allowed characters regex
    const allowedCharactersRegex = /^[a-zA-Z0-9().+\-*/^ ]*$/;
    const consecutiveOperatorsRegex = /[+\-*/^]{2,}/;
    const operatorAtEndRegex = /[+\-*/^]$/; // Check if formula ends with an operator
    const operatorBeforeClosingBracketRegex = /[+\-*/^]\)/; // Check if operator precedes a closing parenthesis

    checkMatchingParentheses(formula);

    // 1. Check for invalid characters
    if (!allowedCharactersRegex.test(formula)) {
        throw new Error(`Invalid character(s) found in formula. Allowed characters are: a-z, A-Z, 0-9, ., (, ), +, -, *, /, ^.)`);
    }

    // 2. Check for consecutive invalid operators
    if (consecutiveOperatorsRegex.test(formula)) {
        throw new Error(
            'Invalid consecutive operators found in formula.'
        );
    }

    // 3. Check for operator at the end
    if (operatorAtEndRegex.test(formula)) {
        throw new Error(`Formula should not end with an operator in "${formula}".`);
    }

    // 4. Check for operator just before closing parenthesis
    if (operatorBeforeClosingBracketRegex.test(formula)) {
        throw new Error(`Invalid operator before closing parenthesis in "${formula}".`);
    }

    // Temporarily remove parentheses for operator validation
    const formulaWithoutParentheses = formula.replace(/[()]/g, '');

    // 5. Additional checks for invalid operator sequences (like *+ or */) where operators are mixed
    const invalidMixedOperatorPattern = /([*/^])([+\*/^])/;
    if (invalidMixedOperatorPattern.test(formulaWithoutParentheses)) {
        throw new Error('Invalid consecutive operators found in formula.');
    }
}

const checkMatchingParentheses = (formula: string) => {
    let balance = 0; // Counter for balancing parentheses
    for (let char of formula) {
        if (char === '(') {
            balance++; // Increment for opening parenthesis
        } else if (char === ')') {
            balance--; // Decrement for closing parenthesis
        }
        // If at any point the balance is negative, it means there's a closing parenthesis without a matching opening one
        if (balance < 0) {
            throw new Error('Mismatched parentheses in formula.');
        }
    }
    // After processing, if balance is not zero, there are unmatched opening parentheses
    if (balance !== 0) {
        throw new Error('Mismatched parentheses in formula.');
    }
};
