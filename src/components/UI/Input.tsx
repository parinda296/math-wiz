import React from 'react'

interface Props {
    value: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: React.CSSProperties;
    type?: "text" | "number";
    className?: string;
}
export default function Input({ value, onChange, placeholder, style, type="text", className }: Props) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || ''}
            style={style}
            className={className + ' border-[1px] border-gray-400 rounded'}
        />
    )
}
