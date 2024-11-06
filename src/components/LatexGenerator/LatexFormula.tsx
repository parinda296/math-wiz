import React, { memo, useMemo } from 'react'
import { divisionRegex, divisionWithExponentsRegex, exponentRegex } from '../../utils/constants';

const LatexFormula = memo(
    function LatexFormula({ input }: { input: string }) {

        const latexFormula = useMemo(() => {
            try {
                // Replace `*` with LaTeX center dot symbol for multiplication
                let latexFormula: string = input.replace(/\*/g, " &sdot; ");
                
                // Handle fractions with parentheses
                latexFormula = latexFormula.replace(divisionRegex, (_match, p1, p2) => {
                    return `<span class="fraction"><span class="numerator">${p1}</span><span class="denominator">${p2}</span></span>`;
                });

                // Handle fractions with exponants
                latexFormula = latexFormula.replace(divisionWithExponentsRegex, (_match, p1, p2) => {
                    return `<span class="fraction"><span class="numerator">${p1}</span><span class="denominator">${p2}</span></span>`;
                });

                // Replace matches with superscript HTML tags
                latexFormula = latexFormula.replace(exponentRegex, (_, superscript) => `<sup>${superscript}</sup>`);

                return latexFormula;
            } catch (error) {
                console.log('latex generateion error', error);
                return '';
            }
        }, [input])

        return (
            <div className='p-4'>
                <p className='pb-2'>Formula (LaTeX Render):</p>
                <p dangerouslySetInnerHTML={{ __html: latexFormula }}></p>
            </div>
        )
    }
);

export default LatexFormula;