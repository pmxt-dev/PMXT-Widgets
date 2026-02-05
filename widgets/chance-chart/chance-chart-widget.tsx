'use client'

import React, { useMemo, useState, useRef } from 'react'

interface MarketData {
    url: string
    data: number[]
    color: string
    name: string
}

interface ChanceChartProps {
    width: number
    height: number
    urls?: string[]
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

// Use the same color palette as the volume timeline
const MARKET_COLORS = [
    { color: 'var(--market-green-vibrant)', name: 'Kalshi' },
    { color: 'var(--market-blue-vibrant)', name: 'Polymarket' },
    { color: 'var(--market-orange-vibrant)', name: 'Limitless' },
]

const extractMarketName = (url: string): string => {
    try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname
        if (hostname.includes('polymarket')) return 'Polymarket'
        if (hostname.includes('kalshi')) return 'Kalshi'
        if (hostname.includes('manifold')) return 'Manifold'
        if (hostname.includes('metaculus')) return 'Metaculus'
        if (hostname.includes('limitless')) return 'Limitless'
        return hostname.split('.')[0]
    } catch {
        return 'Market'
    }
}

export function ChanceChart({
    width,
    height,
    urls = []
}: ChanceChartProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // Add padding for Y-axis labels
    const paddingLeft = 35
    const chartWidth = width - paddingLeft

    // Generate mock data for each market URL
    const markets = useMemo((): MarketData[] => {
        const numPoints = 50
        const marketUrls = urls.length > 0 ? urls : [
            'https://polymarket.com/event/example-1',
            'https://kalshi.com/markets/example-2'
        ]

        return marketUrls.map((url, idx) => {
            const colorConfig = MARKET_COLORS[idx % MARKET_COLORS.length]
            const data: number[] = []
            let val = 30 + Math.random() * 40 // Start between 30-70%

            for (let i = 0; i < numPoints; i++) {
                val += (Math.random() - 0.5) * 8
                val = Math.max(5, Math.min(95, val))
                data.push(val)
            }

            return {
                url,
                data,
                color: colorConfig.color,
                name: extractMarketName(url)
            }
        })
    }, [urls])

    // Calculate Y-axis range (0-100% for probability)
    const minY = 0
    const maxY = 100
    const range = maxY - minY

    const pointWidth = chartWidth / 50

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return
        const rect = svgRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - paddingLeft
        const index = Math.floor(x / pointWidth)
        if (index >= 0 && index < 50) {
            setHoveredIndex(index)
        } else {
            setHoveredIndex(null)
        }
    }

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            className="overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'crosshair' }}
        >
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <line
                    key={p}
                    x1={paddingLeft}
                    y1={height * p}
                    x2={width}
                    y2={height * p}
                    stroke="#eee"
                    strokeWidth={1}
                />
            ))}

            {/* Y-axis labels */}
            {[0, 25, 50, 75, 100].map((val) => (
                <text
                    key={val}
                    x={paddingLeft - 8}
                    y={height - (val / 100) * height + 4}
                    fontSize={9}
                    fontFamily={MONO_FONT}
                    fill="#999"
                    textAnchor="end"
                >
                    {val}%
                </text>
            ))}

            {/* Draw lines for each market */}
            {markets.map((market, marketIdx) => {
                const linePath = market.data.map((val, i) => {
                    const x = paddingLeft + i * pointWidth + pointWidth / 2
                    const y = height - ((val - minY) / range) * height
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                }).join(' ')

                return (
                    <g key={marketIdx}>
                        {/* Main line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke={market.color}
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {market.data.map((val, i) => {
                            const x = paddingLeft + i * pointWidth + pointWidth / 2
                            const y = height - ((val - minY) / range) * height
                            const isLast = i === market.data.length - 1

                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r={isLast ? 5 : 2}
                                    fill={market.color}
                                    opacity={isLast ? 1 : 0.4}
                                    stroke={isLast ? "#fff" : "none"}
                                    strokeWidth={isLast ? 2 : 0}
                                />
                            )
                        })}
                    </g>
                )
            })}

            {/* Hover Tooltip */}
            {hoveredIndex !== null && (
                <g style={{ pointerEvents: 'none' }}>
                    <rect
                        x={paddingLeft + hoveredIndex * pointWidth}
                        y={0}
                        width={pointWidth}
                        height={height}
                        fill="rgba(0,0,0,0.05)"
                    />
                    <line
                        x1={paddingLeft + hoveredIndex * pointWidth + pointWidth / 2}
                        y1={0}
                        x2={paddingLeft + hoveredIndex * pointWidth + pointWidth / 2}
                        y2={height}
                        stroke="#000"
                        strokeDasharray="2,2"
                    />

                    {/* Highlighted points for all markets */}
                    {markets.map((market, idx) => {
                        const x = paddingLeft + hoveredIndex * pointWidth + pointWidth / 2
                        const y = height - ((market.data[hoveredIndex] - minY) / range) * height
                        return (
                            <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r={6}
                                fill={market.color}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        )
                    })}

                    <g transform={`translate(${hoveredIndex > 25 ? paddingLeft + hoveredIndex * pointWidth - 175 : paddingLeft + hoveredIndex * pointWidth + pointWidth + 10}, 10)`}>
                        {/* Shadow */}
                        <rect
                            x={4}
                            y={4}
                            width={165}
                            height={30 + markets.length * 20}
                            fill="rgba(0,0,0,0.2)"
                        />
                        <rect
                            width={165}
                            height={30 + markets.length * 20}
                            fill="#000"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth={1}
                        />
                        <text x={12} y={20} fontSize={10} fontFamily={MONO_FONT} fontWeight="bold" fill="#fff" letterSpacing="0.05em">
                            POINT {hoveredIndex + 1}
                        </text>

                        {markets.map((market, idx) => (
                            <g key={idx} transform={`translate(12, ${38 + idx * 20})`}>
                                <circle cx={3} cy={0} r={4} fill={market.color} />
                                <text x={14} y={4} fontSize={9} fontFamily={MONO_FONT} fill="#aaa">
                                    {market.name.toUpperCase().slice(0, 8)}
                                    <tspan fill={market.color} fontWeight="bold" dx={4}>
                                        {market.data[hoveredIndex].toFixed(1)}%
                                    </tspan>
                                </text>
                            </g>
                        ))}
                    </g>
                </g>
            )}
        </svg>
    )
}
