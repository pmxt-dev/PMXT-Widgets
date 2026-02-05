'use client'

import React, { useMemo, useState, useRef } from 'react'

interface TimelineChartProps {
  width: number
  height: number
  selectedFilter?: string
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

export function TimelineChart({ width, height, selectedFilter = 'all' }: TimelineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Generate sample data for the timeline (50 points)
  const numPoints = 50
  const generateData = (points: number, baseValue: number, variance: number) => {
    const data: number[] = []
    let value = baseValue
    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.5) * variance
      data.push(Math.max(5, value))
    }
    return data
  }

  const { kalshiData, polymarketData, limitlessData } = useMemo(() => ({
    kalshiData: generateData(numPoints, 30, 4),
    polymarketData: generateData(numPoints, 50, 6),
    limitlessData: generateData(numPoints, 20, 3),
  }), [])

  const showKalshi = selectedFilter === 'all' || selectedFilter === 'kalshi'
  const showPolymarket = selectedFilter === 'all' || selectedFilter === 'polymarket'
  const showLimitless = selectedFilter === 'all' || selectedFilter === 'limitless'

  const maxTotal = Math.max(...kalshiData.map((v, i) =>
    (showKalshi ? v : 0) + (showPolymarket ? polymarketData[i] : 0) + (showLimitless ? limitlessData[i] : 0)
  ))
  const barWidth = width / numPoints
  const padding = 1

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const index = Math.floor(x / barWidth)
    if (index >= 0 && index < numPoints) {
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
      <defs>
        {/* Kalshi Pattern: Green stripes */}
        <pattern id="hatch-kalshi" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--market-green-dark)" strokeWidth="2" />
        </pattern>
        {/* Polymarket Pattern: Blue stripes */}
        <pattern id="hatch-polymarket" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--market-blue-dark)" strokeWidth="2" />
        </pattern>
        {/* Limitless Pattern: Orange stripes */}
        <pattern id="hatch-limitless" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(0)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="var(--market-orange-dark)" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1={0}
          y1={height * p}
          x2={width}
          y2={height * p}
          stroke="#eee"
          strokeWidth={1}
        />
      ))}

      {/* Bars */}
      {kalshiData.map((kv, i) => {
        const pv = polymarketData[i]
        const lv = limitlessData[i]

        const kValue = showKalshi ? kv : 0
        const pValue = showPolymarket ? pv : 0
        const lValue = showLimitless ? lv : 0

        const kHeight = (kValue / maxTotal) * height
        const pHeight = (pValue / maxTotal) * height
        const lHeight = (lValue / maxTotal) * height
        const x = i * barWidth

        return (
          <g key={i}>
            {/* Kalshi Bar (Bottom) */}
            {showKalshi && (
              <>
                <rect
                  x={x + padding}
                  y={height - kHeight}
                  width={barWidth - padding * 2}
                  height={kHeight}
                  fill="var(--market-green)"
                  stroke="#000"
                  strokeWidth={0.5}
                />
                <rect
                  x={x + padding}
                  y={height - kHeight}
                  width={barWidth - padding * 2}
                  height={kHeight}
                  fill="url(#hatch-kalshi)"
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}

            {/* Polymarket Bar (Middle) */}
            {showPolymarket && (
              <>
                <rect
                  x={x + padding}
                  y={height - (showKalshi ? kHeight : 0) - pHeight}
                  width={barWidth - padding * 2}
                  height={pHeight}
                  fill="var(--market-blue)"
                  stroke="#000"
                  strokeWidth={0.5}
                />
                <rect
                  x={x + padding}
                  y={height - (showKalshi ? kHeight : 0) - pHeight}
                  width={barWidth - padding * 2}
                  height={pHeight}
                  fill="url(#hatch-polymarket)"
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}

            {/* Limitless Bar (Top) */}
            {showLimitless && (
              <>
                <rect
                  x={x + padding}
                  y={height - (showKalshi ? kHeight : 0) - (showPolymarket ? pHeight : 0) - lHeight}
                  width={barWidth - padding * 2}
                  height={lHeight}
                  fill="var(--market-orange)"
                  stroke="#000"
                  strokeWidth={0.5}
                />
                <rect
                  x={x + padding}
                  y={height - (showKalshi ? kHeight : 0) - (showPolymarket ? pHeight : 0) - lHeight}
                  width={barWidth - padding * 2}
                  height={lHeight}
                  fill="url(#hatch-limitless)"
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}
          </g>
        )
      })}



      {/* Hover Tooltip */}
      {hoveredIndex !== null && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={hoveredIndex * barWidth}
            y={0}
            width={barWidth}
            height={height}
            fill="rgba(0,0,0,0.05)"
          />
          <line
            x1={hoveredIndex * barWidth + barWidth / 2}
            y1={0}
            x2={hoveredIndex * barWidth + barWidth / 2}
            y2={height}
            stroke="#000"
            strokeDasharray="2,2"
          />

          <g transform={`translate(${hoveredIndex > numPoints / 2 ? hoveredIndex * barWidth - 175 : hoveredIndex * barWidth + barWidth + 10}, 10)`}>
            {/* Shadow */}
            <rect
              x={4}
              y={4}
              width={165}
              height={100}
              fill="rgba(0,0,0,0.2)"
            />
            <rect
              width={165}
              height={100}
              fill="#000"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
            />
            <text x={12} y={22} fontSize={11} fontFamily={SERIF_FONT} fontWeight="400" fill="#fff" letterSpacing="0.02em">Volume Details</text>

            <g transform="translate(12, 38)">
              <rect width={6} height={6} fill="var(--market-green)" stroke="#fff" strokeWidth={0.5} opacity={showKalshi ? 1 : 0.3} />
              <text x={14} y={6} fontSize={9} fontFamily={MONO_FONT} fill={showKalshi ? "#aaa" : "#555"}>
                KALSHI  <tspan fill={showKalshi ? "var(--terminal-accent)" : "#555"} fontWeight="bold">${kalshiData[hoveredIndex].toFixed(1)}M</tspan>
              </text>
            </g>

            <g transform="translate(12, 53)">
              <rect width={6} height={6} fill="var(--market-blue)" stroke="#fff" strokeWidth={0.5} opacity={showPolymarket ? 1 : 0.3} />
              <text x={14} y={6} fontSize={9} fontFamily={MONO_FONT} fill={showPolymarket ? "#aaa" : "#555"}>
                POLY    <tspan fill={showPolymarket ? "var(--terminal-accent)" : "#555"} fontWeight="bold">${polymarketData[hoveredIndex].toFixed(1)}M</tspan>
              </text>
            </g>

            <g transform="translate(12, 68)">
              <rect width={6} height={6} fill="var(--market-orange)" stroke="#fff" strokeWidth={0.5} opacity={showLimitless ? 1 : 0.3} />
              <text x={14} y={6} fontSize={9} fontFamily={MONO_FONT} fill={showLimitless ? "#aaa" : "#555"}>
                LIMIT   <tspan fill={showLimitless ? "var(--terminal-accent)" : "#555"} fontWeight="bold">${limitlessData[hoveredIndex].toFixed(1)}M</tspan>
              </text>
            </g>

            <line x1={10} y1={78} x2={155} y2={78} stroke="rgba(255,255,255,0.1)" />

            <text x={12} y={90} fontSize={9} fontFamily={MONO_FONT} fontWeight="bold" fill="#fff">
              TOTAL   <tspan fill="var(--terminal-accent)">${(
                (showKalshi ? kalshiData[hoveredIndex] : 0) +
                (showPolymarket ? polymarketData[hoveredIndex] : 0) +
                (showLimitless ? limitlessData[hoveredIndex] : 0)
              ).toFixed(1)}M</tspan>
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}
