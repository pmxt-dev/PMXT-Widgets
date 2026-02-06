'use client'

import React from 'react'
import { WidgetTheme } from '@/lib/widget-types'

interface LiveOddsPillProps {
    label: string
    percentage: number
    trend?: 'up' | 'down' | 'neutral'
    clickUrl?: string
    compact?: boolean
    theme?: WidgetTheme
    showShadow?: boolean
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

export function LiveOddsPill({
    label,
    percentage,
    trend = 'neutral',
    clickUrl,
    compact = false,
    theme = 'light',
    showShadow = false
}: LiveOddsPillProps) {
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000000' : '#ffffff'
    const textColor = isDark ? '#ffffff' : '#000000'
    const secondaryTextColor = isDark ? '#999' : '#374151'
    const borderColor = isDark ? '#333333' : '#000000'
    const shadow = showShadow ? (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '8px 8px 0px 0px rgba(0,0,0,1)') : 'none'

    // Determine color based on trend
    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'var(--terminal-green)'
            case 'down':
                return 'var(--terminal-red)'
            default:
                return isDark ? '#666' : 'var(--terminal-dim-text)'
        }
    }

    const trendColor = getTrendColor()

    const pillStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '0.5rem' : '0.75rem',
        padding: compact ? '0.375rem 0.75rem' : '0.5rem 1rem',
        background: bgColor,
        border: `2px solid ${trendColor}`,
        borderRadius: '9999px',
        fontFamily: MONO_FONT,
        fontSize: compact ? '13px' : '14px',
        fontWeight: '600',
        cursor: clickUrl ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        color: textColor,
        boxShadow: shadow,
        whiteSpace: 'nowrap'
    }

    const hoverStyle: React.CSSProperties = clickUrl ? {
        transform: 'translateY(-1px)',
        boxShadow: showShadow ? (isDark ? '0 15px 40px rgba(0,0,0,0.6)' : '10px 10px 0px 0px rgba(0,0,0,1)') : (isDark ? '0 4px 12px rgba(255,255,255,0.1)' : '0 4px 8px rgba(0,0,0,0.15)')
    } : {}

    const [isHovered, setIsHovered] = React.useState(false)

    const content = (
        <>
            <span style={{ color: secondaryTextColor, fontFamily: SERIF_FONT }}>{label}</span>
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
