'use client'

import React from 'react'

interface LiveOddsPillProps {
    label: string
    percentage: number
    trend?: 'up' | 'down' | 'neutral'
    clickUrl?: string
    compact?: boolean
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

export function LiveOddsPill({
    label,
    percentage,
    trend = 'neutral',
    clickUrl,
    compact = false
}: LiveOddsPillProps) {
    // Determine color based on trend
    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'var(--terminal-green)'
            case 'down':
                return 'var(--terminal-red)'
            default:
                return 'var(--terminal-dim-text)'
        }
    }

    const trendColor = getTrendColor()

    const pillStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '0.5rem' : '0.75rem',
        padding: compact ? '0.375rem 0.75rem' : '0.5rem 1rem',
        background: 'white',
        border: `2px solid ${trendColor}`,
        borderRadius: '9999px',
        fontFamily: MONO_FONT,
        fontSize: compact ? '13px' : '14px',
        fontWeight: '600',
        cursor: clickUrl ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: '#000',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap'
    }

    const hoverStyle: React.CSSProperties = clickUrl ? {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
    } : {}

    const [isHovered, setIsHovered] = React.useState(false)

    const content = (
        <>
            <span style={{ color: '#374151', fontFamily: SERIF_FONT }}>{label}</span>
            <span
                style={{
                    color: trendColor,
                    fontWeight: '700',
                    fontFamily: MONO_FONT,
                    fontSize: compact ? '14px' : '15px'
                }}
            >
                {percentage}%
            </span>
        </>
    )

    const combinedStyle = {
        ...pillStyle,
        ...(isHovered ? hoverStyle : {})
    }

    if (clickUrl) {
        return (
            <a
                href={clickUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={combinedStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {content}
            </a>
        )
    }

    return (
        <div style={combinedStyle}>
            {content}
        </div>
    )
}
