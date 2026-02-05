'use client'

import React, { useEffect, useState, useMemo, useRef } from "react"

import { EditMarketDialog } from '@/components/edit-market-dialog'
import { ShareDialog } from '@/components/share-dialog'
import { TimelineChart, Treemap, ChanceChart, RawNumber } from '@/widgets'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { MarketData, MarketItem, defaultMarketData } from '@/lib/market-data'
import { fetchMarketData, filterMarketItems, sortMarketItems, searchMarketItems } from '@/lib/market-api'
import { CalendarIcon, DownloadIcon, Menu, SearchIcon, Share2, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { toast } from 'sonner'

export default function PredictionMarketsPage() {
  const [marketData, setMarketData] = useState<MarketData>(defaultMarketData)
  const [viewMode, setViewMode] = useState<'volume' | 'openInterest'>('openInterest')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'kalshi' | 'polymarket' | 'limitless'>('all')
  const [timeframe, setTimeframe] = useState<'latest' | '1w' | '2w' | '1m' | '6m' | '1y' | 'ytd' | 'all'>('latest')
  const [selectedDate, setSelectedDate] = useState('FEB 4 2026')
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [treemapDimensions, setTreemapDimensions] = useState({ width: 800, height: 550 })
  const [drilldownPath, setDrilldownPath] = useState<MarketItem[]>([])
  const [currentView, setCurrentView] = useState<MarketItem[]>([]) // We'll compute this
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const treemapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await fetchMarketData()
        setMarketData(data)
      } catch (error) {
        console.error("Failed to fetch market data:", error)
        toast.error("Failed to load market data")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Derive the filtered market data
  const filteredMarketData = useMemo(() => {
    let results = filterMarketItems(marketData.categories, selectedFilter)
    results = searchMarketItems(results, searchQuery)
    const sortedCategories = sortMarketItems(results)

    return {
      ...marketData,
      categories: sortedCategories,
      totalValue: sortedCategories.reduce((sum, cat) => sum + cat.value, 0)
    }
  }, [marketData, selectedFilter, searchQuery])

  // Update current view when filtered search results or drilldown changes
  useEffect(() => {
    let view = filteredMarketData.categories

    // Follow the drilldown path in the filtered data
    for (const pathItem of drilldownPath) {
      const found = view.find((item: MarketItem) => item.name === pathItem.name)
      if (found && found.children) {
        view = found.children
      } else {
        // If the path is no longer valid (e.g. filtered out), reset drilldown
        setDrilldownPath([])
        view = filteredMarketData.categories
        break
      }
    }
    setCurrentView(view)
  }, [filteredMarketData, drilldownPath])

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        // On very small screens, make it taller relative to width
        const height = width < 640 ? Math.max(350, window.innerHeight * 0.5) : Math.min(550, window.innerHeight - 450)
        setTreemapDimensions({ width, height })
      }
    }

    const observer = new ResizeObserver(() => {
      updateDimensions()
    })

    observer.observe(containerRef.current)
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value}`
  }

  const handleItemClick = (item: MarketItem, event?: React.MouseEvent, path?: MarketItem[]) => {
    // Check if it's a double-click or Ctrl+click for edit
    if (event?.detail === 2 || event?.ctrlKey || event?.metaKey) {
      setEditingItem(item)
      setEditDialogOpen(true)
      return
    }

    // Single click - drill down if item has children
    if (item.children && item.children.length > 0) {
      if (path && path.length > 0) {
        setDrilldownPath([...drilldownPath, ...path])
      } else {
        setDrilldownPath([...drilldownPath, item])
      }
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Go back to root
      setDrilldownPath([])
    } else {
      // Go to specific level
      const newPath = drilldownPath.slice(0, index + 1)
      setDrilldownPath(newPath)
    }
  }

  const findAndUpdateItem = (items: MarketItem[], target: MarketItem, updated: MarketItem): MarketItem[] => {
    return items.map((item) => {
      if (item === target) {
        return updated
      }
      if (item.children) {
        return {
          ...item,
          children: findAndUpdateItem(item.children, target, updated),
          value: item.children.reduce((sum, child) => {
            if (child === target) {
              return sum + updated.value
            }
            return sum + child.value
          }, 0),
        }
      }
      return item
    })
  }

  const handleSaveItem = (updatedItem: MarketItem) => {
    if (!editingItem) return

    const newCategories = findAndUpdateItem(marketData.categories, editingItem, updatedItem)
    const newTotalValue = newCategories.reduce((sum, cat) => sum + cat.value, 0)

    setMarketData({
      ...marketData,
      categories: newCategories,
      totalValue: newTotalValue,
    })

    // Update current view if we're in a drilled-down state
    if (drilldownPath.length > 0) {
      const lastItem = drilldownPath[drilldownPath.length - 1]
      const updatedLastItem = findItemInTree(newCategories, lastItem)
      if (updatedLastItem?.children) {
        setCurrentView(updatedLastItem.children)
      }
    } else {
      setCurrentView(newCategories)
    }
  }

  const findItemInTree = (items: MarketItem[], target: MarketItem): MarketItem | null => {
    for (const item of items) {
      if (item.name === target.name) {
        return item
      }
      if (item.children) {
        const found = findItemInTree(item.children, target)
        if (found) return found
      }
    }
    return null
  }

  const findAndDeleteItem = (items: MarketItem[], target: MarketItem): MarketItem[] => {
    return items
      .filter((item) => item !== target)
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: findAndDeleteItem(item.children, target),
          }
        }
        return item
      })
  }

  const handleDeleteItem = () => {
    if (!editingItem) return

    const newCategories = findAndDeleteItem(marketData.categories, editingItem)
    const newTotalValue = newCategories.reduce((sum, cat) => sum + cat.value, 0)

    setMarketData({
      ...marketData,
      categories: newCategories,
      totalValue: newTotalValue,
    })

    // Update current view after deletion
    if (drilldownPath.length > 0) {
      const lastItem = drilldownPath[drilldownPath.length - 1]
      const updatedLastItem = findItemInTree(newCategories, lastItem)
      if (updatedLastItem?.children) {
        setCurrentView(updatedLastItem.children)
      }
    } else {
      setCurrentView(newCategories)
    }

    setEditDialogOpen(false)
  }



  const handleDownload = async () => {
    if (!treemapRef.current) return

    try {
      // Use the actual dimensions plus a small margin for the screenshot
      const labelPadding = 30
      const fullWidth = treemapDimensions.width + labelPadding
      const dataUrl = await toPng(treemapRef.current, {
        backgroundColor: '#fff',
        width: fullWidth,
        height: treemapDimensions.height,
        style: {
          transform: `translateX(${labelPadding}px)`,
          width: `${treemapDimensions.width}px`,
          height: `${treemapDimensions.height}px`,
        }
      })
      const link = document.createElement('a')
      link.download = `prediction-market-treemap-${new Date().getTime()}.png`
      link.href = dataUrl
      link.click()
      toast.success('Treemap screenshot downloaded')
    } catch (err) {
      console.error('oops, something went wrong!', err)
      toast.error('Failed to capture screenshot')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-black bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-baseline gap-2">
                <div className="text-xl sm:text-2xl md:text-3xl font-normal font-serif leading-tight">
                  Prediction Markets <span className="underline decoration-1 underline-offset-4 sm:underline-offset-8">Open Interest</span> Distribution
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-gray-500 shrink-0"> [Beta]</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                variant={viewMode === 'volume' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('volume')}
                className="h-8 px-3 sm:px-4 text-[10px] sm:text-xs font-mono rounded-none border-black"
              >
                Volume
              </Button>
              <Button
                variant={viewMode === 'openInterest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('openInterest')}
                className="h-8 px-3 sm:px-4 text-[10px] sm:text-xs font-mono rounded-none border-black"
              >
                Open Interest
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className="h-7 px-3 text-[11px] font-mono rounded-none border-black shrink-0"
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'kalshi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('kalshi')}
                className="h-7 px-3 text-[11px] font-mono rounded-none border-black shrink-0"
              >
                Kalshi
              </Button>
              <Button
                variant={selectedFilter === 'polymarket' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('polymarket')}
                className="h-7 px-3 text-[11px] font-mono rounded-none border-black shrink-0"
              >
                Polymarket
              </Button>
              <Button
                variant={selectedFilter === 'limitless' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('limitless')}
                className="h-7 px-3 text-[11px] font-mono rounded-none border-black shrink-0"
              >
                Limitless
              </Button>
            </div>


            <div className="sm:ml-auto flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search markets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 w-full sm:w-48 px-2 pr-8 text-xs border border-black focus:outline-none focus:ring-1 focus:ring-black rounded-none font-mono"
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-7 w-7 rounded-none">
                  <SearchIcon className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-none"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-none"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <div ref={containerRef} className="w-full">
          {/* Breadcrumb Navigation */}
          {drilldownPath.length > 0 && (
            <div className="mb-3 flex items-center gap-2 text-xs overflow-x-auto pb-1 scrollbar-hide whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBreadcrumbClick(-1)}
                className="h-6 px-2 text-xs shrink-0"
              >
                All Markets
              </Button>
              {drilldownPath.map((item, index) => (
                <div key={index} className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-400">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBreadcrumbClick(index)}
                    className="h-6 px-2 text-xs font-semibold"
                  >
                    {item.name}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Treemap Visualization */}
          <div className="mb-4 mt-8 sm:mt-0 relative" ref={treemapRef}>
            <div
              className="absolute -top-7 left-0 right-0 flex items-center justify-center sm:left-[-24px] sm:top-0 sm:bottom-0 sm:right-auto sm:[writing-mode:vertical-rl] sm:rotate-180 text-[9px] font-mono text-black/40 uppercase tracking-[0.5em] select-none"
            >
              PMXT.DEV
            </div>
            {isLoading ? (
              <div
                className="flex flex-col items-center justify-center bg-gray-50/50 border border-black/10"
                style={{ width: treemapDimensions.width, height: treemapDimensions.height }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-black mb-2" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Loading data...</span>
              </div>
            ) : (
              <Treemap
                data={currentView}
                width={treemapDimensions.width}
                height={treemapDimensions.height}
                globalTotalValue={filteredMarketData.totalValue}
                rootName={drilldownPath.length > 0 ? drilldownPath[drilldownPath.length - 1].name : 'All Markets'}
                rootValue={drilldownPath.length > 0 ?
                  (currentView.reduce((sum, item) => sum + item.value, 0)) :
                  filteredMarketData.totalValue}
                onItemClick={handleItemClick}
                onHeaderClick={drilldownPath.length > 0 ? () => {
                  setDrilldownPath(drilldownPath.slice(0, -1))
                } : undefined}
              />
            )}
          </div>

          {/* Timeline Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono font-medium shrink-0 uppercase tracking-wider text-gray-500">Timeframe</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                {(['latest', '1w', '2w', '1m', '6m', '1y', 'ytd', 'all'] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    className="h-6 px-2 text-[10px] font-mono rounded-none border-black shrink-0"
                  >
                    {tf === 'latest' ? 'Latest' : tf === 'ytd' ? 'YTD' : tf === 'all' ? 'All' : tf.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="sm:ml-auto flex items-center justify-between sm:justify-start gap-2 border border-black rounded-none px-3 py-1 bg-white">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" />
                <span className="text-[11px] font-mono">{selectedDate}</span>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="mb-3">
            <div className="overflow-x-auto scrollbar-hide">
              <div style={{ minWidth: treemapDimensions.width > 600 ? 'auto' : '600px' }}>
                <TimelineChart width={Math.max(treemapDimensions.width, 600)} height={120} selectedFilter={selectedFilter} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: 'var(--market-green)' }} />
                <span>Kalshi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: 'var(--market-blue)' }} />
                <span>Polymarket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3" style={{ backgroundColor: 'var(--market-orange)' }} />
                <span>Limitless</span>
              </div>
            </div>
          </div>

          {/* Timeline Scale */}
          <div className="flex justify-between text-[11px] text-gray-500 mb-6 overflow-hidden">
            <span className="truncate">JUN 30 2021</span>
            <span className="truncate">FEB 5 2026</span>
          </div>


          {/* Market Spotlight - New Widgets Demo */}
          <div className="mt-12 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-black/10"></div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black/40">Market Spotlight</span>
              <div className="h-px flex-1 bg-black/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ChanceChart
                  width={treemapDimensions.width > 800 ? treemapDimensions.width * 0.66 : treemapDimensions.width}
                  height={350}
                  urls={[
                    'https://polymarket.com/event/mamdani-opens-city-owned-grocery-store-by-june-30',
                    'https://kalshi.com/markets/kxmarriageswiftkelce/swift-kelce-married/kxmarriageswiftkelce-26'
                  ]}
                />
              </div>
              <div className="flex flex-col gap-6">
                <RawNumber value={52.4} label="TRUMP WIN CHANCE" />
                <div className="bg-black text-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] flex-1 flex flex-col justify-center">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    MARKET STATUS
                  </div>
                  <div className="text-xl font-bold font-sans">HIGH VOLATILITY</div>
                  <p className="text-[10px] font-mono mt-2 opacity-60">Volume increased by 12% in the last 24h.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-300 pt-4 text-[11px] text-gray-600 max-w-2xl">
            <h3 className="font-semibold text-black mb-1">Disclaimer</h3>
            <p className="leading-relaxed">
              This dashboard is for informational and educational purposes only. It reflects aggregated market data and
              does not constitute financial or investment advice. Always conduct your own research before making any
              trading or investment decisions.
            </p>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <EditMarketDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        item={editingItem}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />

      {/* Footer / Powered by */}
      <footer className="fixed bottom-4 right-4 z-50">
        <a
          href="https://pmxt.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-gray-500 hover:text-black transition-colors duration-200 uppercase tracking-[0.2em] flex items-center gap-1.5 group"
        >
          <span className="opacity-40 group-hover:opacity-70 transition-opacity">Powered by</span>
          <span className="font-bold bg-black text-white px-1.5 py-0.5 group-hover:bg-gray-800 transition-colors">pmxt</span>
        </a>
      </footer>
    </div>
  )
}
