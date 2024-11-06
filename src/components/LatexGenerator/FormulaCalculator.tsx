import React, {
    useState, useEffect, ChangeEvent,
    useDeferredValue, Suspense
} from 'react';
import { evaluateExpression } from '../../utils/utils';
import { Variables } from '../../types/types';
import { variableRegex } from '../../utils/constants';
import Result from './Result';
import LatexFormula from './LatexFormula';
import Input from '../UI/Input';


const FormulaCalculator: React.FC = () => {
    const [formula, setFormula] = useState<string>('');
    const deferredFormula = useDeferredValue(formula);
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
            newVariables[varName] = variables[varName] || '0';
        });
        setVariables(newVariables);
    };

    const handleVariableChange = (name: string, value: string) => {
        setVariables((prev) => ({ ...prev, [name]: value }));
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
        <div className='max-w-[350px] mx-auto'>
            <h2 className="text-2xl font-bold">Formula Calculator</h2>

            {/* Display LaTeX Formula */}
            <Suspense fallback={<h2>Loading...</h2>}>
                <LatexFormula input={deferredFormula} />
            </Suspense>

            {/* Formula Input */}
            <Input
                value={formula}
                onChange={handleFormulaChange}
                placeholder="Enter formula, e.g., a + b * c^2"
                className='w-full p-2 mb-2.5 max-w-[350px]' />

            {/* Variable Inputs */}
            {Object.keys(variables)?.length ? <div>
                <p className='p-2 font-bold'>Variables:</p>
                <div className={`grid grid-cols-3`}>
                    {Object.keys(variables).map((varName) => (
                        <div key={varName}>
                            <label>{varName}:</label>
                            <Input
                                type='number'
                                value={variables[varName]}
                                onChange={(e) => handleVariableChange(varName, e.target.value)}
                                className='w-[70px] ml-2 mb-2.5 p-[5px]'
                            />
                        </div>
                    ))}
                </div>
            </div> : ''}

            {/* Result */}
            <Result error={error} result={result} />
        </div>
    );
};

export default FormulaCalculator;
