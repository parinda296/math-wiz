import React from 'react'

interface Props {
    value: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}
export default function TextInput({ value, onChange, placeholder, style }: Props) {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder || ''}
            style={style}
        />
    )
}
