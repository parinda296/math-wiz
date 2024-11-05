import { Variables } from "../types/types";
import { additionOrSubtractionRegex, additionSubtractionRegexWithSpacesRegex, exponentiationRegex, exponentiationWithDecimalsRegex, multiplicationOrDivisionRegex, multiplicationOrDivisionWithSpacesRegex, parenthesisRegex } from "./constants";

// Function to evaluate an expression with support for `+`, `-`, `*`, `/`, and `^`
export const evaluateExpression = (formula: string, variables: Variables): number => {
    checkMatchingParentheses(formula);
    formula = formula.replace(/\s/g, "");
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
            exp = exp.replace(multiplicationOrDivisionWithSpacesRegex, (_, left, __, operator, right) => {
                const a = parseFloat(left);
                const b = parseFloat(right);
                return operator === '*' ? (a * b).toString() : (a / b).toString();
            });
        }

        // Addition and subtraction
        while (additionOrSubtractionRegex.test(exp)) {
            exp = exp.replace(additionSubtractionRegexWithSpacesRegex, (_, left, __, operator, right) => {
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
            throw new Error('Mismatched parentheses in formula');
        }
    }
    // After processing, if balance is not zero, there are unmatched opening parentheses
    if (balance !== 0) {
        throw new Error('Mismatched parentheses in formula');
    }
};
