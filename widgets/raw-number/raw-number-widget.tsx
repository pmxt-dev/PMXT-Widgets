'use client'

import React from 'react'
import { WidgetTheme } from '@/lib/widget-types'

interface RawNumberProps {
    value: number
    label?: string
    width?: number | string
    height?: number | string
    theme?: WidgetTheme
    showShadow?: boolean
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

export function RawNumber({
    value,
    label = "CHANCE",
    width = "100%",
    height = "100%",
    theme = 'light',
    showShadow = true
}: RawNumberProps) {
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000' : '#fff'
    const textColor = isDark ? '#fff' : '#000'
    const borderColor = isDark ? '#333' : '#000'
    const shadow = showShadow ? (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '8px 8px 0px 0px rgba(0,0,0,1)') : 'none'

    return (
        <div
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                padding: '2rem',
                boxShadow: shadow,
                color: textColor
            }}
        >
            <div
                style={{
                    fontFamily: MONO_FONT,
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    color: isDark ? '#666' : 'var(--terminal-dim-text)',
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
                    letterSpacing: '-0.02em',
                    color: textColor
                }}
            >
                {value}%
            </div>
        </div>
    )
}

