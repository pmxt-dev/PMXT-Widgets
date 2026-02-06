'use client'

import { MarketItem } from '@/lib/market-data'
import { WidgetTheme } from '@/lib/widget-types'
import * as d3Hierarchy from 'd3-hierarchy'
import React, { useState, useMemo } from 'react'

interface TreemapProps {
  data: MarketItem[]
  width: number
  height: number
  globalTotalValue?: number
  rootName?: string
  rootValue?: number
  onItemClick?: (item: MarketItem, event: React.MouseEvent, path: MarketItem[]) => void
  onHeaderClick?: () => void
  theme?: WidgetTheme
  showShadow?: boolean
}

const formatValue = (value: number): string => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

const MONO_FONT = "var(--font-mono), monospace"
const SERIF_FONT = "var(--font-serif), serif"

interface HoveredItemInfo {
  item: MarketItem
  parentName: string
  parentValue: number
  totalValue: number
}

// Recursively layout and render treemap nodes
function renderNode(
  item: MarketItem,
  x: number,
  y: number,
  width: number,
  height: number,
  depth: number,
  parentColor: string | undefined,
  parentName: string,
  parentValue: number,
  totalValue: number,
  hoveredItem: MarketItem | null,
  setHoveredInfo: (info: HoveredItemInfo | null) => void,
  setMousePos: (pos: { x: number; y: number }) => void,
  onItemClick?: (item: MarketItem, event: React.MouseEvent, path: MarketItem[]) => void,
  isDark?: boolean,
  borderColor: string = "#000",
  currentPath: MarketItem[] = []
): React.ReactNode {
  const hasChildren = item.children && item.children.length > 0
  const isHovered = hoveredItem === item

  const newPath = [...currentPath, item]

  // Highlight hovered leaf nodes with bright green
  const color = isHovered ? 'var(--terminal-accent)' : (item.color || parentColor || (isDark ? '#1a1a1a' : '#e8e8e8'))

  // Header height for nodes with children
  const headerHeight = hasChildren ? Math.min(22, Math.max(16, height * 0.1)) : 0
  const contentPadding = 2

  const contentX = x + contentPadding
  const contentY = y + headerHeight + contentPadding
  const contentW = Math.max(0, width - contentPadding * 2)
  const contentH = Math.max(0, height - headerHeight - contentPadding * 2)

  // Text visibility - be more aggressive on small screens
  const showName = width > 20 && height > 12
  const showValue = width > 35 && height > 20

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onItemClick?.(item, e, newPath)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHoveredInfo({
      item,
      parentName,
      parentValue,
      totalValue
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMousePos({ x: e.clientX, y: e.clientY })
    // Ensure hovered info is set during move to maintain sync
    setHoveredInfo({
      item,
      parentName,
      parentValue,
      totalValue
    })
  }

  // Leaf node (no children)
  if (!hasChildren) {
    const fontSize = Math.min(10, Math.max(7, Math.min(width, height) / 8))
    return (
      <g
        key={`${item.name}-${x}-${y}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          stroke={borderColor}
          strokeWidth={0.5}
          className="transition-colors duration-200"
        />
        {showName && (
          <text
            x={x + 4}
            y={y + fontSize + 3}
            fontSize={fontSize}
            fontFamily={MONO_FONT}
            fill={isDark ? "#fff" : "#000"}
            style={{ pointerEvents: 'none' }}
          >
            {item.name.length > width / 6 ? item.name.slice(0, Math.floor(width / 6)) + '...' : item.name}
          </text>
        )}
        {showValue && (
          <text
            x={x + 4}
            y={y + fontSize * 2 + 5}
            fontSize={fontSize - 1}
            fontFamily={MONO_FONT}
            fill={isHovered ? (isDark ? "#fff" : "#000") : (isDark ? "#999" : "#555")}
            style={{ pointerEvents: 'none' }}
          >
            {formatValue(item.value)}
          </text>
        )}
      </g>
    )
  }

  // Node with children - create nested layout
  const children = item.children!
  const nodeTotalValue = children.reduce((sum, c) => sum + c.value, 0)

  // Use d3 treemap for children
  const root = d3Hierarchy.hierarchy({ name: 'root', value: nodeTotalValue, children })
    .sum((d: any) => (d.children ? 0 : d.value))
    .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))

  const treemap = d3Hierarchy.treemap<any>()
    .size([contentW, contentH])
    .paddingInner(1)
    .round(true)

  treemap(root)

  const headerFontSize = Math.min(11, Math.max(8, width / 18))
  const showHeader = width > 30 && headerHeight > 10

  return (
    <g
      key={`${item.name}-${x}-${y}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'pointer' }}
    >
      {/* Background for entire category */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke={borderColor}
        strokeWidth={depth === 0 ? 1.5 : 1}
      />

      {/* Header divider line */}
      {showHeader && (
        <line
          x1={x} y1={y + headerHeight}
          x2={x + width} y2={y + headerHeight}
          stroke={borderColor} strokeWidth={1}
        />
      )}

      {/* Category header text */}
      {showHeader && (
        <text
          x={x + 4}
          y={y + headerHeight - (headerHeight - headerFontSize) / 2 - 1}
          fontSize={headerFontSize}
          fontWeight={depth === 0 ? '400' : '400'}
          fontFamily={SERIF_FONT}
          fill={isDark ? "#fff" : "#000"}
        >
          {item.name.length > width / (headerFontSize * 0.6) ? item.name.slice(0, Math.floor(width / (headerFontSize * 0.6))) + '..' : item.name}
          {width > 100 && (
            <tspan fontSize={headerFontSize - 1} fontWeight="400" fill={isDark ? "#999" : "#666"}> {formatValue(item.value)}</tspan>
          )}
        </text>
      )}

      {/* Render children with increased padding */}
      {root.children?.map((child: any, i: number) => {
        const childItem = children.find((c) => c.name === child.data.name)
        if (!childItem) return null

        return renderNode(
          childItem,
          contentX + child.x0,
          contentY + child.y0,
          child.x1 - child.x0,
          child.y1 - child.y0,
          depth + 1,
          color,
          item.name,
          item.value,
          totalValue,
          hoveredItem,
          setHoveredInfo,
          setMousePos,
          onItemClick,
          isDark,
          borderColor,
          newPath
        )
      })}
    </g>
  )
}

export default function Treemap({ data, width, height, globalTotalValue, rootName, rootValue, onItemClick, onHeaderClick, theme = 'light', showShadow = false }: TreemapProps) {
  const [hoveredInfo, setHoveredInfo] = useState<HoveredItemInfo | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#000000' : '#ffffff'
  const textColor = isDark ? '#ffffff' : '#000000'
  const borderColor = isDark ? '#333333' : '#000000'
  const shadow = showShadow ? (isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '12px 12px 0px 0px rgba(0,0,0,1)') : 'none'

  const totalValue = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])
  const outerTitleHeight = 28

  const rootValueToUse = rootValue || totalValue
  const rootNameToUse = rootName || 'All Markets'
  const globalTotalToUse = globalTotalValue || totalValue

  // Layout top-level categories
  const root = useMemo(() => {
    const r = d3Hierarchy.hierarchy({ name: rootNameToUse, value: rootValueToUse, children: data })
      .sum((d: any) => (d.children ? 0 : d.value))
      .sort((a: any, b: any) => (b.value || 0) - (a.value || 0))

    const treemapLayout = d3Hierarchy.treemap<any>()
      .size([width, height - outerTitleHeight])
      .paddingInner(3) // Padding between main categories
      .round(true)

    treemapLayout(r)
    return r
  }, [data, width, height, rootValueToUse, rootNameToUse])

  return (
    <div
      className={`relative ${isDark ? 'dark' : ''}`}
      style={{ width, height, boxShadow: shadow }}
      onMouseLeave={() => setHoveredInfo(null)}
    >
      <svg width={width} height={height} style={{ backgroundColor: bgColor, borderRadius: 0 }}>
        {/* Outer border - shifted by 1px to stay within bounds */}
        <rect x={1} y={1} width={width - 2} height={height - 2} fill="none" stroke={borderColor} strokeWidth={2} />

        {/* Header Bar */}
        <g
          onMouseEnter={(e) => {
            const rootItem: MarketItem = { name: rootNameToUse, value: rootValueToUse };
            setHoveredInfo({
              item: rootItem,
              parentName: rootNameToUse,
              parentValue: rootValueToUse,
              totalValue: globalTotalToUse
            });
          }}
          onMouseMove={(e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
          }}
          onClick={onHeaderClick}
          style={{ cursor: onHeaderClick ? 'pointer' : 'default' }}
        >
          <rect
            x={1} y={1} width={width - 2} height={outerTitleHeight}
            fill={bgColor} stroke={borderColor} strokeWidth={1}
          />
          <text
            x={10}
            y={outerTitleHeight / 2 + 5}
            fontSize={width < 400 ? 12 : 14}
            fontFamily={SERIF_FONT}
            fontWeight="400"
            fill={textColor}
            style={{ pointerEvents: 'none' }}
          >
            {rootNameToUse} {formatValue(rootValueToUse)}
          </text>
        </g>

        {/* Render categories shifted down for title */}
        <g transform={`translate(0, ${outerTitleHeight})`}>
          {root.children?.map((child: any) => {
            const item = data.find((d) => d.name === child.data.name)
            if (!item) return null

            return renderNode(
              item,
              child.x0,
              child.y0,
              child.x1 - child.x0,
              child.y1 - child.y0,
              0,
              undefined,
              rootNameToUse,
              rootValueToUse,
              globalTotalToUse,
              hoveredInfo?.item || null,
              setHoveredInfo,
              setMousePos,
              onItemClick,
              isDark,
              borderColor,
              []
            )
          })}
        </g>
      </svg>

      {/* Terminal Hover Tooltip */}
      {hoveredInfo && (
        <div
          className={`fixed z-50 pointer-events-none flex flex-col ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-black border-white/20'} text-white p-5 border shadow-2xl min-w-[240px]`}
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
            transform: (mousePos.x + 250 > (typeof window !== 'undefined' ? window.innerWidth : 1000)) ? 'translateX(-110%)' : 'none'
          }}
        >
          <div className="text-[16px] text-white mb-2" style={{ fontFamily: SERIF_FONT }}>
            {hoveredInfo.item.name}
          </div>
          <div className="text-4xl font-bold text-[var(--terminal-accent)] mb-4 font-mono">
            {formatValue(hoveredInfo.item.value)}
          </div>
          <div className="h-[1px] bg-white/30 w-full mb-4" />
          <div className="flex justify-between items-center text-[13px] font-mono mb-2">
            <span className="text-white">{((hoveredInfo.item.value / globalTotalToUse) * 100).toFixed(1)}%</span>
            <span className="text-gray-400">of Total</span>
          </div>
          {hoveredInfo.item.name !== hoveredInfo.parentName && (
            <div className="flex justify-between items-center text-[13px] font-mono">
              <span className="text-white">{((hoveredInfo.item.value / hoveredInfo.parentValue) * 100).toFixed(1)}%</span>
              <span className="text-gray-400 truncate max-w-[130px]">of {hoveredInfo.parentName}</span>
            </div>
          )}
          {hoveredInfo.parentName !== rootNameToUse && rootNameToUse !== 'All Markets' && hoveredInfo.item.name !== rootNameToUse && (
            <div className="flex justify-between items-center text-[13px] font-mono mt-2">
              <span className="text-white">{((hoveredInfo.item.value / rootValueToUse) * 100).toFixed(1)}%</span>
              <span className="text-gray-400 truncate max-w-[130px]">of {rootNameToUse}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
