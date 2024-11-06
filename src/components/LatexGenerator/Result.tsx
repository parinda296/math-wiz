import React from 'react'

interface Props {
    result: number | null;
}
export default function Result({ result }: Props) {
    if (!result) return '';
    return (
        <h3 className='text-xl font-bold pt-4'>Result: {result}</h3>
    )
}
