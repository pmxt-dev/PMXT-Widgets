'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import { createChart, ColorType, IChartApi, AreaSeries, ISeriesApi } from 'lightweight-charts'
import { WidgetTheme } from '@/lib/widget-types'

interface SeriesData {
    name: string
    color: string
    data: { time: number; value: number }[]
    axis?: 'left' | 'right'
}

interface ChanceChartProps {
    width?: number | string
    height?: number
    series?: SeriesData[]
    // Compatibility with existing demo
    urls?: string[]
    theme?: WidgetTheme
    showShadow?: boolean
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

const MARKET_COLORS = [
    '#27AE60', // Green
    '#4A90E2', // Blue
    '#E67E22', // Orange
    '#9B59B6', // Purple
    '#E74C3C', // Red
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
    width = '100%',
    height = 300,
    series: providedSeries,
    urls = [],
    theme = 'light',
    showShadow = false,
}: ChanceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const [hoverData, setHoverData] = useState<{ [key: string]: number }>({})
    const [hoverDate, setHoverDate] = useState<string | null>(null)

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000000' : '#ffffff'
    const textColor = isDark ? '#ffffff' : '#000000'
    const borderColor = isDark ? '#333333' : '#000000'
    const gridColor = isDark ? '#1a1a1a' : '#f0f0f0'
    const secondaryTextColor = isDark ? '#999' : '#666'
    const shadow = showShadow ? (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '12px 12px 0px 0px rgba(0,0,0,1)') : 'none'

    // Generate mock data if none provided (for demo purposes)
    const chartSeries = useMemo((): SeriesData[] => {
        if (providedSeries && providedSeries.length > 0) return providedSeries

        const marketUrls = urls.length > 0 ? urls : [
            'https://polymarket.com/event/example-1',
            'https://kalshi.com/markets/example-2'
        ]

        const now = Math.floor(Date.now() / 1000)
        const daySeconds = 86400
        const numPoints = 60

        return marketUrls.map((url, idx) => {
            const data: { time: number; value: number }[] = []
            let val = 30 + Math.random() * 40

            for (let i = 0; i < numPoints; i++) {
                const time = now - (numPoints - 1 - i) * daySeconds
                val += (Math.random() - 0.5) * 6
                val = Math.max(5, Math.min(95, val))
                data.push({ time, value: val })
            }

            return {
                name: extractMarketName(url),
                color: MARKET_COLORS[idx % MARKET_COLORS.length],
                data,
                axis: idx % 2 === 0 ? 'left' : 'right' // demonstrating multiple axes
            }
        })
    }, [providedSeries, urls])

    useEffect(() => {
        if (!chartContainerRef.current) return

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: bgColor },
                textColor: secondaryTextColor,
                fontSize: 10,
                fontFamily: MONO_FONT,
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { color: gridColor },
            },
            leftPriceScale: {
                visible: true,
                borderVisible: false,
                scaleMargins: { top: 0.1, bottom: 0.1 },
            },
            rightPriceScale: {
                visible: false,
            },
            timeScale: {
                visible: true,
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: true,
            handleScale: true,
            width: chartContainerRef.current.clientWidth,
            height: height,
            crosshair: {
                vertLine: {
                    color: isDark ? '#333' : '#e0e0e0',
                    width: 1,
                    style: 2,
                    labelVisible: true,
                },
                horzLine: {
                    color: isDark ? '#333' : '#e0e0e0',
                    width: 1,
                    style: 2,
                    labelVisible: true,
                },
            },
        })

        const seriesApis: { api: ISeriesApi<"Area">, name: string }[] = []

        chartSeries.forEach((s) => {
            const series = chart.addSeries(AreaSeries, {
                lineColor: s.color,
                topColor: s.color + '33', // 20% opacity hex
                bottomColor: 'rgba(255, 255, 255, 0)',
                lineWidth: 2,
                priceScaleId: 'left',
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: true,
            })
            series.setData(s.data as any)
            seriesApis.push({ api: series, name: s.name })
        })

        chart.timeScale().fitContent()
        chartRef.current = chart

        chart.subscribeCrosshairMove((param) => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > (chartContainerRef.current?.clientWidth || 0) ||
                param.point.y < 0 ||
                param.point.y > height
            ) {
                setHoverData({})
                setHoverDate(null)
            } else {
                const newHoverData: { [key: string]: number } = {}
                seriesApis.forEach(({ api, name }) => {
                    const data = param.seriesData.get(api) as { value: number } | undefined
                    if (data) {
                        newHoverData[name] = data.value
                    }
                })
                setHoverData(newHoverData)
                const date = new Date((param.time as number) * 1000)
                setHoverDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))
            }
        })

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [chartSeries, height, bgColor, secondaryTextColor, gridColor, isDark])

    return (
        <div style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: bgColor,
            border: `1px solid ${borderColor}`,
            padding: '24px',
            boxSizing: 'border-box',
            boxShadow: shadow,
            color: textColor
        }}>
            {/* Header info like Mini Chart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                    {chartSeries.map((s) => (
                        <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: secondaryTextColor, fontFamily: MONO_FONT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {s.name}
                                </span>
                            </div>
                            <span style={{ fontSize: '28px', fontWeight: '700', color: textColor, fontFamily: MONO_FONT, letterSpacing: '-0.02em' }}>
                                {hoverData[s.name] !== undefined ? `${hoverData[s.name].toFixed(1)}%` : `${s.data[s.data.length - 1].value.toFixed(1)}%`}
                            </span>
                        </div>
                    ))}
                </div>
                {hoverDate && (
                    <div style={{ fontSize: '10px', color: secondaryTextColor, fontWeight: 'bold', fontFamily: MONO_FONT, background: isDark ? '#111' : '#f5f5f5', padding: '4px 8px' }}>
                        {hoverDate}
                    </div>
                )}
            </div>

            {/* Chart Container */}
            <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px` }} />

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
