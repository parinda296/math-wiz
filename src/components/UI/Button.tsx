import React from 'react'

interface Props {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    title: string;
    disabled?: boolean
}

export default function Button({onClick, title, disabled=false, className=''}: Props) {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>{title}</button>
  )
}
