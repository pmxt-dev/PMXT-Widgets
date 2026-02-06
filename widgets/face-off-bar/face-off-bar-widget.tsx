'use client'

import React from 'react'
import { WidgetTheme } from '@/lib/widget-types'

interface FaceOffBarProps {
    optionA: {
        label: string
        percentage: number
        color?: 'green' | 'blue' | 'orange'
    }
    optionB: {
        label: string
        percentage: number
        color?: 'green' | 'blue' | 'orange'
    }
    clickUrl?: string
    height?: number | string
    showPercentages?: boolean
    theme?: WidgetTheme
    showShadow?: boolean
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

// Color scheme matching the volume timeline
const COLORS = {
    green: {
        base: 'var(--market-green)',
        pattern: 'var(--market-green-dark)',
        text: '#2d4a2e'
    },
    blue: {
        base: 'var(--market-blue)',
        pattern: 'var(--market-blue-dark)',
        text: '#2d3a4a'
    },
    orange: {
        base: 'var(--market-orange)',
        pattern: 'var(--market-orange-dark)',
        text: '#4a3a2d'
    }
}

export function FaceOffBar({
    optionA,
    optionB,
    clickUrl,
    height = 48,
    showPercentages = true,
    theme = 'light',
    showShadow = true
}: FaceOffBarProps) {
    const [isHovered, setIsHovered] = React.useState(false)
    const patternIdA = React.useId() + '-a'
    const patternIdB = React.useId() + '-b'

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000000' : '#ffffff'
    const textColor = isDark ? '#ffffff' : '#000000'
    const borderColor = isDark ? '#333333' : '#000000'
    const shadow = showShadow ? (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '12px 12px 0px 0px rgba(0,0,0,1)') : 'none'

    // Default colors if not provided
    const colorSchemeA = COLORS[optionA.color || 'blue']
    const colorSchemeB = COLORS[optionB.color || 'orange']

    // Normalize percentages to ensure they add up to 100
    const total = optionA.percentage + optionB.percentage
    const normalizedA = (optionA.percentage / total) * 100
    const normalizedB = (optionB.percentage / total) * 100

    const containerStyle: React.CSSProperties = {
        width: '100%',
        cursor: clickUrl ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        textDecoration: 'none',
        display: 'block'
    }

    const wrapperStyle: React.CSSProperties = {
        background: bgColor,
        border: `1px solid ${borderColor}`,
        padding: '16px',
        boxShadow: shadow,
        transform: isHovered && clickUrl ? 'translate(-1px, -1px)' : 'none',
        transition: 'all 0.15s ease'
    }

    const labelsStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
        fontFamily: MONO_FONT,
        fontSize: '11px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    }

    const barContainerStyle: React.CSSProperties = {
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        position: 'relative'
    }

    const content = (
        <div style={wrapperStyle}>
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    {/* Pattern for Option A */}
                    <pattern id={patternIdA} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="4" stroke={colorSchemeA.pattern} strokeWidth="2" />
                    </pattern>
                    {/* Pattern for Option B */}
                    <pattern id={patternIdB} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                        <line x1="0" y1="0" x2="0" y2="4" stroke={colorSchemeB.pattern} strokeWidth="2" />
                    </pattern>
                </defs>
            </svg>

            <div style={labelsStyle}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'flex-start'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        background: colorSchemeA.base,
                        border: `1px solid ${borderColor}`,
                        flexShrink: 0
                    }} />
                    <span style={{ color: textColor, fontFamily: SERIF_FONT, fontSize: '14px', textTransform: 'none', letterSpacing: 'normal' }}>{optionA.label}</span>
                </div>

                {showPercentages && (
                    <div style={{
                        display: 'flex',
                        gap: '4px',
                        fontWeight: '700',
                        fontSize: '13px',
                        color: textColor
                    }}>
                        <span>{optionA.percentage}%</span>
                        <span style={{ opacity: 0.3 }}>:</span>
                        <span>{optionB.percentage}%</span>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'flex-end'
                }}>
                    <span style={{ color: textColor, fontFamily: SERIF_FONT, fontSize: '14px', textTransform: 'none', letterSpacing: 'normal' }}>{optionB.label}</span>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        background: colorSchemeB.base,
                        border: `1px solid ${borderColor}`,
                        flexShrink: 0
                    }} />
                </div>
            </div>

            <div style={barContainerStyle}>
                <svg width="100%" height="100%" style={{ display: 'block' }}>
                    {/* Option A Bar */}
                    <rect
                        x="0"
                        y="0"
                        width={`${normalizedA}%`}
                        height="100%"
                        fill={colorSchemeA.base}
                        stroke={borderColor}
                        strokeWidth="0.5"
                    />
                    {!isDark && (
                        <rect
                            x="0"
                            y="0"
                            width={`${normalizedA}%`}
                            height="100%"
                            fill={`url(#${patternIdA})`}
                            style={{ pointerEvents: 'none' }}
                        />
                    )}

                    {/* Option B Bar */}
                    <rect
                        x={`${normalizedA}%`}
                        y="0"
                        width={`${normalizedB}%`}
                        height="100%"
                        fill={colorSchemeB.base}
                        stroke={borderColor}
                        strokeWidth="0.5"
                    />
                    {!isDark && (
                        <rect
                            x={`${normalizedA}%`}
                            y="0"
                            width={`${normalizedB}%`}
                            height="100%"
                            fill={`url(#${patternIdB})`}
                            style={{ pointerEvents: 'none' }}
                        />
                    )}

                    {/* Center divider line */}
                    <line
                        x1={`${normalizedA}%`}
                        y1="0"
                        x2={`${normalizedA}%`}
                        y2="100%"
                        stroke={borderColor}
                        strokeWidth="1"
                    />
                </svg>
            </div>
        </div>
    )

    if (clickUrl) {
        return (
            <a
                href={clickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={isDark ? 'dark' : ''}
                style={containerStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {content}
            </a>
        )
    }

    return (
        <div className={isDark ? 'dark' : ''} style={containerStyle}>
            {content}
        </div>
    )
}
