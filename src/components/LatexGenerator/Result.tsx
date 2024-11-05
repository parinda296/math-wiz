import React from 'react'

interface Props {
    error: string;
    result: number | null;
}
export default function Result({ error, result }: Props) {
    if(!result && !error) return '';
    return (
        <div>
            <h3>Result:</h3>
            {error ? <p style={{ color: 'red' }}>{error}</p> : <p>{result}</p>}
        </div>
    )
}
