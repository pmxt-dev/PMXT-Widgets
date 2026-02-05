'use client'

import React from "react"

import { MarketItem } from '@/lib/market-data'
import { Treemap as RechartsTreemap, ResponsiveContainer } from 'recharts'

interface TreemapProps {
  data: MarketItem[]
  width?: number
  height?: number
  onItemClick?: (item: MarketItem, event?: React.MouseEvent) => void
}

interface TreemapNode {
  name: string
  size?: number
  value?: number
  children?: TreemapNode[]
  color?: string
  originalItem?: MarketItem
}

// Custom content component for treemap cells
const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, value, depth, color, root } = props

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`
    }
    return `$${val}`
  }

  // Determine font size based on box size
  const getFontSize = () => {
    if (width < 50 || height < 25) return '7px'
    if (width < 80 || height < 40) return '8px'
    if (width < 120 || height < 60) return '9px'
    return '10px'
  }

  const fontSize = getFontSize()
  const showValue = width > 40 && height > 25
  const showName = width > 35 && height > 20

  // Get parent color if this is a child node
  const getColor = () => {
    if (color) return color
    // For children, lighten the parent color slightly
    if (depth > 0 && root?.color) {
      return root.color
    }
    return '#e5e7eb'
  }

  const fillColor = getColor()

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#000',
          strokeWidth: 1,
          cursor: 'pointer',
        }}
      />
      {showName && (
        <text
          x={x + 4}
          y={y + 12}
          textAnchor="start"
          fill="#000"
          fontSize={fontSize}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
          fontWeight="400"
        >
          {name}
        </text>
      )}
      {showValue && value && (
        <text
          x={x + 4}
          y={y + 24}
          textAnchor="start"
          fill="#000"
          fontSize={fontSize}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
          fontWeight="300"
        >
          {formatValue(value)}
        </text>
      )}
    </g>
  )
}

export function Treemap({ data, width = 1300, height = 600, onItemClick }: TreemapProps) {
  // Transform data for Recharts
  const transformData = (items: MarketItem[]): TreemapNode[] => {
    return items.map((item) => ({
      name: item.name,
      size: item.value,
      value: item.value,
      color: item.color,
      originalItem: item,
      children: item.children ? transformData(item.children) : undefined,
    }))
  }

  const treemapData = transformData(data)

  const handleClick = (node: any, event: React.MouseEvent) => {
    if (node?.originalItem && onItemClick) {
      onItemClick(node.originalItem, event)
    }
  }

  return (
    <div style={{ width, height, border: '2px solid #000' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsTreemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#000"
          fill="#e5e7eb"
          content={<CustomizedContent />}
          onClick={handleClick}
        />
      </ResponsiveContainer>
    </div>
  )
}
