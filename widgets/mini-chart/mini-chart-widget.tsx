'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { createChart, ColorType, IChartApi, AreaSeries } from 'lightweight-charts'

interface MiniChartProps {
    title: string
    chance: number
    change24h: number
    data: number[]
    platform?: string
    width?: number
    logoUrl?: string
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

const PMXT_GREEN = '#27AE60' // Matches var(--market-green-vibrant)
const PMXT_RED = '#E74C3C'   // Matches var(--terminal-red)

export function MiniChart({
    title,
    chance,
    change24h,
    data,
    platform = "PMXT",
    width = 340,
    logoUrl,
}: MiniChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)
    const [hoverDate, setHoverDate] = React.useState<string | null>(null)

    const isPositive = change24h >= 0
    const accentColor = isPositive ? PMXT_GREEN : PMXT_RED
    const lightAccentColor = isPositive ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 59, 48, 0.1)'

    // Format data for Lightweight Charts
    const formattedData = useMemo(() => {
        const now = Math.floor(Date.now() / 1000)
        const daySeconds = 86400
        const startTime = now - (data.length - 1) * daySeconds
        return data.map((val, i) => ({
            time: (startTime + i * daySeconds) as any,
            value: val
        }))
    }, [data])

    useEffect(() => {
        if (!chartContainerRef.current) return

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#ffffff' },
                textColor: '#000',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            rightPriceScale: {
                visible: false,
            },
            timeScale: {
                visible: false,
            },
            handleScroll: false,
            handleScale: false,
            width: chartContainerRef.current.clientWidth,
            height: 80,
            crosshair: {
                vertLine: {
                    color: '#000',
                    width: 1,
                    style: 2, // Dashed
                },
                horzLine: {
                    visible: false,
                },
            },
        })

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: accentColor,
            topColor: lightAccentColor,
            bottomColor: 'transparent',
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: true,
        })

        areaSeries.setData(formattedData)

        // Fit content
        chart.timeScale().fitContent()

        chartRef.current = chart

        // Subscribe to crosshair moves
        chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > (chartContainerRef.current?.clientWidth || 0) ||
                param.point.y < 0 ||
                param.point.y > 80
            ) {
                setHoverValue(null)
                setHoverDate(null)
            } else {
                const dataPoint = param.seriesData.get(areaSeries) as { value: number } | undefined
                if (dataPoint && param.time) {
                    setHoverValue(dataPoint.value)
                    const date = new Date((param.time as number) * 1000)
                    setHoverDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase())
                }
            }
        })

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [formattedData, accentColor, lightAccentColor])

    return (
        <div
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                background: '#fff',
                border: '1px solid #000',
                padding: '16px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: MONO_FONT,
                position: 'relative',
                overflow: 'hidden',
                userSelect: 'none'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#666' }}>{platform.toUpperCase()}</span>
                </div>
                <a
                    href="#"
                    style={{ textDecoration: 'none', color: '#000', fontSize: '9px', fontWeight: 'bold', border: '1px solid #000', padding: '2px 6px' }}
                    onClick={(e) => e.preventDefault()}
                >
                    VIEW MARKET
                </a>
            </div>

            <div style={{ marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '400', lineHeight: '1.2', fontFamily: SERIF_FONT }}>{title}</h3>
            </div>

            {/* Chance Info */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                    {hoverValue !== null ? `${hoverValue.toFixed(1)}%` : `${chance}%`}
                </span>
                {hoverValue !== null ? (
                    <span style={{ fontSize: '10px', color: '#999', fontWeight: 'bold' }}>{hoverDate}</span>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: isPositive ? 'var(--terminal-green)' : 'var(--terminal-red)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {isPositive ? '↑' : '↓'}
                            {Math.abs(change24h).toFixed(1)}%
                        </span>
                        <span style={{ fontSize: '10px', color: '#999', fontWeight: 'bold' }}>24H</span>
                    </div>
                )}
            </div>

            {/* Chart */}
            <div ref={chartContainerRef} style={{ height: '80px', width: '100%' }} />

            {/* CSS to hide TradingView branding injected by the library */}
            <style dangerouslySetInnerHTML={{
                __html: `
                #tv-attr-logo, 
                [class*="tv-lightweight-charts-logo"],
                .tv-logo-container {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `}} />
        </div>
    )
}
