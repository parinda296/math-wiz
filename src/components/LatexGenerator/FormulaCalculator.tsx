import React, { useState, useEffect, ChangeEvent } from 'react';
import { evaluateExpression } from '../../utils/utils';
import { Variables } from '../../types/types';
import { variableRegex } from '../../utils/constants';
import Result from './Result';
import TextInput from '../UI/TextInput';
import LatexFormula from './LatexFormula';


const FormulaCalculator: React.FC = () => {
    const [formula, setFormula] = useState<string>('');
    const [variables, setVariables] = useState<Variables>({});
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const handleFormulaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setFormula(input);

        // Extract unique variables from the formula
        const detectedVariables = [...new Set(input.match(variableRegex))];
        const newVariables: Variables = {};

        detectedVariables.forEach((varName) => {
            newVariables[varName] = variables[varName] || 0;
        });
        setVariables(newVariables);
    };

    const handleVariableChange = (name: string, value: string) => {
        // do not allow non number values
        if (isNaN(Number(value))) return;
        setVariables((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const evaluateFormula = (expression: string) => {
        try {
            const result = evaluateExpression(expression, variables);
            setResult(result || 0);
            setError('');
        } catch (err: unknown) {
            if (err instanceof Error && err.message) {
                setError(err.message)
            } else {
                setError('Invalid formula or variable value.');

            }
        }
    }

    useEffect(() => {
        evaluateFormula(formula);
    }, [formula, variables]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Formula Calculator</h2>

            {/* Display LaTeX Formula */}
            <LatexFormula input={formula} />

            {/* Formula Input */}
            <TextInput
                value={formula}
                onChange={handleFormulaChange}
                placeholder="Enter formula, e.g., a + b * c^2"
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />

            {/* Variable Inputs */}
            {Object.keys(variables)?.length && <div>
                <p>Variables:</p>
                {Object.keys(variables).map((varName) => (
                    <div key={varName}>
                        <label>{varName}:</label>
                        <TextInput
                            value={variables[varName]}
                            onChange={(e) => handleVariableChange(varName, e.target.value)}
                            style={{ marginLeft: '8px', marginBottom: '10px', padding: '5px' }}
                        />
                    </div>
                ))}
            </div>}

            {/* Result */}
            <Result error={error} result={result} />
        </div>
    );
};

export default FormulaCalculator;
