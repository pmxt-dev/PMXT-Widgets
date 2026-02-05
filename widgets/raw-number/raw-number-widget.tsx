'use client'

import React from 'react'

interface RawNumberProps {
    value: number
    label?: string
    width?: number | string
    height?: number | string
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

export function RawNumber({ value, label = "CHANCE", width = "100%", height = "100%" }: RawNumberProps) {
    return (
        <div
            style={{
                width,
                height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                border: '1px solid black',
                padding: '2rem',
                boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
            }}
        >
            <div
                style={{
                    fontFamily: MONO_FONT,
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    color: 'var(--terminal-dim-text)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontFamily: SERIF_FONT,
                    fontSize: '72px',
                    fontWeight: '400',
                    lineHeight: '1',
                    letterSpacing: '-0.02em'
                }}
            >
                {value}%
            </div>
        </div>
    )
}
