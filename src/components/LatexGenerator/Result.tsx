import React from 'react'

interface Props {
    error: string;
    result: number | null;
}
export default function Result({ error, result }: Props) {
    if (!result && !error) return '';
    if (error) {
        return <p className='text-red'>{error}</p>;
    }
    return (
        <h3 className='text-xl font-bold pt-4'>Result: {result}</h3>
    )
}
