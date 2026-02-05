'use client'

import { MarketItem } from '@/lib/market-data'
import * as d3 from 'd3-hierarchy'
import React, { useCallback, useMemo } from 'react'

interface NestedTreemapProps {
  data: MarketItem[]
  width: number
  height: number
  totalValue: number
  onItemClick?: (item: MarketItem, event: React.MouseEvent) => void
}

interface TreeNode {
  name: string
  value: number
  color?: string
  children?: TreeNode[]
  originalItem: MarketItem
}

const formatValue = (val: number): string => {
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(1)}M`
  }
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}K`
  }
  return `$${val}`
}

// Recursively render a treemap node and its children
function TreemapNode({
  node,
  x,
  y,
  width,
  height,
  depth,
  parentColor,
  onItemClick,
}: {
  node: d3.HierarchyRectangularNode<TreeNode>
  x: number
  y: number
  width: number
  height: number
  depth: number
  parentColor?: string
  onItemClick?: (item: MarketItem, event: React.MouseEvent) => void
}) {
  const data = node.data
  const hasChildren = node.children && node.children.length > 0
  const color = data.color || parentColor || '#e5e7eb'
  
  // Header height for categories with children
  const headerHeight = hasChildren ? Math.min(20, height * 0.15) : 0
  const contentY = y + headerHeight
  const contentHeight = height - headerHeight
  
  // Calculate font sizes based on dimensions
  const headerFontSize = Math.min(11, Math.max(8, width / 15))
  const valueFontSize = Math.min(10, Math.max(7, width / 18))
  
  const showHeader = width > 40 && height > 25
  const showValue = width > 60 && headerHeight > 12 && hasChildren
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onItemClick) {
      onItemClick(data.originalItem, e)
    }
  }, [data.originalItem, onItemClick])

  // For leaf nodes (no children)
  if (!hasChildren) {
    const leafFontSize = Math.min(10, Math.max(7, Math.min(width, height) / 8))
    const showName = width > 30 && height > 18
    const showLeafValue = width > 35 && height > 30
    
    return (
      <g onClick={handleClick} style={{ cursor: 'pointer' }}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          stroke="#000"
          strokeWidth={0.5}
        />
        {showName && (
          <text
            x={x + 3}
            y={y + leafFontSize + 2}
            fontSize={leafFontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="#000"
          >
            {data.name.length > width / 6 ? data.name.slice(0, Math.floor(width / 6)) + '...' : data.name}
          </text>
        )}
        {showLeafValue && (
          <text
            x={x + 3}
            y={y + leafFontSize * 2 + 4}
            fontSize={leafFontSize - 1}
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="#333"
          >
            {formatValue(data.value)}
          </text>
        )}
      </g>
    )
  }

  // For nodes with children - create nested layout
  const childrenData = node.children!
  
  // Use d3 treemap for children layout within this node's content area
  const childRoot = d3.hierarchy<TreeNode>({ 
    name: 'root', 
    value: data.value, 
    children: childrenData.map(c => c.data),
    originalItem: data.originalItem 
  })
    .sum(d => d.children ? 0 : d.value)
    .sort((a, b) => (b.value || 0) - (a.value || 0))

  const treemapLayout = d3.treemap<TreeNode>()
    .size([width - 2, contentHeight - 2])
    .padding(1)
    .round(true)

  treemapLayout(childRoot)

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* Background rect for the entire category */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#000"
        strokeWidth={depth === 0 ? 1.5 : 1}
      />
      
      {/* Header with category name */}
      {showHeader && (
        <>
          <text
            x={x + 4}
            y={y + headerFontSize}
            fontSize={headerFontSize}
            fontWeight={depth === 0 ? '500' : '400'}
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="#000"
          >
            {data.name}
          </text>
          {showValue && (
            <text
              x={x + 4 + data.name.length * (headerFontSize * 0.6) + 8}
              y={y + headerFontSize}
              fontSize={valueFontSize}
              fontFamily="system-ui, -apple-system, sans-serif"
              fill="#333"
            >
              {formatValue(data.value)}
            </text>
          )}
        </>
      )}
      
      {/* Render children */}
      {childRoot.children?.map((child, i) => {
        const childNode = childrenData.find(c => c.data.name === child.data.name)
        if (!childNode) return null
        
        return (
          <TreemapNode
            key={`${child.data.name}-${i}`}
            node={childNode}
            x={x + 1 + (child.x0 || 0)}
            y={contentY + 1 + (child.y0 || 0)}
            width={(child.x1 || 0) - (child.x0 || 0)}
            height={(child.y1 || 0) - (child.y0 || 0)}
            depth={depth + 1}
            parentColor={color}
            onItemClick={onItemClick}
          />
        )
      })}
    </g>
  )
}

export function NestedTreemap({ data, width, height, totalValue, onItemClick }: NestedTreemapProps) {
  // Transform MarketItem[] to TreeNode[]
  const transformData = useCallback((items: MarketItem[]): TreeNode[] => {
    return items.map(item => ({
      name: item.name,
      value: item.value,
      color: item.color,
      originalItem: item,
      children: item.children ? transformData(item.children) : undefined,
    }))
  }, [])

  const treeData = useMemo(() => transformData(data), [data, transformData])

  // Create root hierarchy
  const root = useMemo(() => {
    const hierarchy = d3.hierarchy<TreeNode>({ 
      name: 'root', 
      value: totalValue, 
      children: treeData,
      originalItem: { name: 'All Markets', value: totalValue }
    })
      .sum(d => d.children ? 0 : d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0))

    const treemapLayout = d3.treemap<TreeNode>()
      .size([width - 4, height - 24])
      .padding(2)
      .round(true)

    return treemapLayout(hierarchy)
  }, [treeData, width, height, totalValue])

  return (
    <svg 
      width={width} 
      height={height} 
      style={{ border: '1px solid #000', backgroundColor: '#fff' }}
    >
      {/* Outer border and title */}
      <rect x={0} y={0} width={width} height={height} fill="none" stroke="#000" strokeWidth={2} />
      <text x={8} y={16} fontSize={12} fontFamily="system-ui, -apple-system, sans-serif" fill="#000">
        All Markets Open Interest {formatValue(totalValue)}
      </text>
      
      {/* Render top-level categories */}
      <g transform="translate(2, 22)">
        {root.children?.map((child, i) => (
          <TreemapNode
            key={`${child.data.name}-${i}`}
            node={child}
            x={child.x0 || 0}
            y={child.y0 || 0}
            width={(child.x1 || 0) - (child.x0 || 0)}
            height={(child.y1 || 0) - (child.y0 || 0)}
            depth={0}
            onItemClick={onItemClick}
          />
        ))}
      </g>
    </svg>
  )
}
