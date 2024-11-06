export const variableRegex = /[a-zA-Z]/g;

// Regular expression to match a division expression with optional exponents (e.g., "a^b / c^d")
// ([\w]+(?:\^[\w]+)?)   → Matches a term (variable or number) with an optional exponent as the numerator
// \s*\/\s*              → Matches the division symbol `/`, allowing whitespace around it
// ([\w]+(?:\^[\w]+)?)   → Matches a term (variable or number) with an optional exponent as the denominator

export const divisionWithExponentsRegex = /([\w]+(?:\^[\w]+)?)\s*\/\s*([\w]+(?:\^[\w]+)?)/g;


// Regex to match exponent expressions where a caret `^` is followed by alphanumeric characters
// \^             → Matches the caret symbol `^` indicating the start of an exponent
// ([a-zA-Z0-9]+) → Matches and captures one or more letters or digits (the exponent value)
// g              → Global flag to match all exponent instances in a string

export const exponentRegex = /\^([a-zA-Z]|\d+)/g;

// Regex to match division expressions with optional parentheses and exponents
// (\((?:[^()]+|(?:))*\) | [a-zA-Z0-9]+(?:\^[a-zA-Z0-9]+)?) → Matches the numerator or denominator:
//      \((?:[^()]+|(?:))*\)         → Matches expressions enclosed in parentheses, handling simple nesting.
//      [a-zA-Z0-9]+(?:\^[a-zA-Z0-9]+)? → Matches a variable or number, with an optional exponent.
// \s*\/\s*                           → Matches a division sign `/` with optional whitespace around it.
// g                                   → Global flag to match multiple occurrences.

export const divisionRegex = /(\((?:[^()]+|(?:))*\)|[a-zA-Z0-9]+(?:\^[a-zA-Z0-9]+)?)\s*\/\s*(\((?:[^()]+|(?:))*\)|[a-zA-Z0-9]+(?:\^[a-zA-Z0-9]+)?)/g;

// This regex is designed to match a pair of parentheses and capture the content inside them.
// For the input string "(1 + 2) * (3 - 4)", it would match "(1 + 2)" and "(3 - 4)" 
export const parenthesisRegex = /\(([^()]+)\)/;

// Regex to match numbers raised to an exponent (integer or decimal).
export const exponentiationRegex = /\d+(\.\d+)?\^\d+(\.\d+)?/;

// Regex to match a number raised to an exponent, allowing for decimal numbers.
// i.e. 2^3, 10^5
export const exponentiationWithDecimalsRegex = /(-?\d+(\.\d+)?)\^(-?\d+(\.\d+)?)/;

// Regex to match a multiplication or division operation between two numbers, allowing for decimal numbers.
export const multiplicationOrDivisionRegex = /(-?\d+(\.\d+)?)([*/])(-?\d+(\.\d+)?)/;

// Regex to match a simple arithmetic expression involving addition or subtraction of two numbers.
export const additionOrSubtractionRegex = /(-?\d+(\.\d+)?)([+-])(-?\d+(\.\d+)?)/;

//Regex to check for invalid operator sequences (like *+ or */) where operators are mixed
export const invalidMixedOperatorPattern = /([*/^])([+\*/^])/