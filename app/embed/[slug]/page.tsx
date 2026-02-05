'use client'

import React, { use, useState, useEffect, useRef, useMemo } from 'react'
import { Treemap, TimelineChart, ChanceChart, RawNumber, LiveOddsPill, FaceOffBar, MiniChart } from '@/widgets'
import { defaultMarketData, MarketItem } from '@/lib/market-data'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

const TreemapWidgetEmbed = ({ w, h }: { w: number, h: number }) => {
    const [drilldownPath, setDrilldownPath] = useState<MarketItem[]>([])

    const currentView = useMemo(() => {
        let view = defaultMarketData.categories
        for (const pathItem of drilldownPath) {
            const found = view.find(item => item.name === pathItem.name)
            if (found && found.children) {
                view = found.children
            } else {
                break
            }
        }
        return view
    }, [drilldownPath])

    const handleItemClick = (item: MarketItem, event: React.MouseEvent, path: MarketItem[]) => {
        if (item.children && item.children.length > 0) {
            setDrilldownPath([...drilldownPath, ...path])
        }
    }

    const handleHeaderClick = () => {
        if (drilldownPath.length > 0) {
            setDrilldownPath(drilldownPath.slice(0, -1))
        }
    }

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setDrilldownPath([])
        } else {
            setDrilldownPath(drilldownPath.slice(0, index + 1))
        }
    }

    const breadcrumbHeight = drilldownPath.length > 0 ? 40 : 0
    const treemapHeight = h - breadcrumbHeight

    const rootName = drilldownPath.length > 0 ? drilldownPath[drilldownPath.length - 1].name : 'All Markets'
    const rootValue = drilldownPath.length > 0 ?
        currentView.reduce((sum, item) => sum + item.value, 0) :
        defaultMarketData.totalValue

    return (
        <div className="flex flex-col w-full h-full">
            {drilldownPath.length > 0 && (
                <div className="flex items-center gap-2 text-xs overflow-x-auto p-2 scrollbar-hide whitespace-nowrap bg-white border-b border-black/10">
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
            <Treemap
                data={currentView}
                width={w}
                height={treemapHeight}
                globalTotalValue={defaultMarketData.totalValue}
                rootName={rootName}
                rootValue={rootValue}
                onItemClick={handleItemClick}
                onHeaderClick={drilldownPath.length > 0 ? handleHeaderClick : undefined}
            />
        </div>
    )
}

const WIDGETS: Record<string, any> = {
    treemap: (w: number, h: number) => <TreemapWidgetEmbed w={w} h={h} />,
    timeline: (w: number, h: number) => (
        <TimelineChart width={w} height={h} selectedFilter="all" />
    ),
    chance: (w: number, h: number) => (
        <ChanceChart
            width={w}
            height={h}
            urls={[
                'https://polymarket.com/event/mamdani-opens-city-owned-grocery-store-by-june-30',
                'https://kalshi.com/markets/kxmarriageswiftkelce/swift-kelce-married/kxmarriageswiftkelce-26'
            ]}
        />
    ),
    number: (w: number, h: number) => (
        <div className="w-full h-full flex items-center justify-center p-4">
            <RawNumber value={64.2} width={Math.min(w, 400)} />
        </div>
    ),
    'live-odds-pill': (w: number, h: number, searchParams: URLSearchParams) => (
        <div className="w-full h-full flex items-center justify-center p-2">
            <LiveOddsPill
                label={searchParams.get('label') || 'Prediction'}
                percentage={parseInt(searchParams.get('percentage') || '50')}
                trend={(searchParams.get('trend') as any) || 'neutral'}
                compact={searchParams.get('compact') === 'true'}
            />
        </div>
    ),
    'face-off-bar': (w: number, h: number, searchParams: URLSearchParams) => (
        <div className="w-full h-full flex items-center justify-center p-4">
            <FaceOffBar
                optionA={{
                    label: searchParams.get('a') || 'Option A',
                    percentage: parseInt(searchParams.get('a_pct') || '50'),
                    color: (searchParams.get('a_color') as any) || 'blue'
                }}
                optionB={{
                    label: searchParams.get('b') || 'Option B',
                    percentage: parseInt(searchParams.get('b_pct') || '50'),
                    color: (searchParams.get('b_color') as any) || 'orange'
                }}
                height={h - 32}
            />
        </div>
    ),
    'mini-chart': (w: number, h: number, searchParams: URLSearchParams) => (
        <div className="w-full h-full flex items-center justify-center p-4">
            <MiniChart
                title={searchParams.get('title') || 'Market Matchup'}
                chance={parseInt(searchParams.get('chance') || '50')}
                change24h={parseFloat(searchParams.get('change') || '0')}
                data={searchParams.get('data')?.split(',').map(Number) || [60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64]}
                platform={searchParams.get('platform') || 'Prediction Market'}
                width={Math.min(w, 400)}
            />
        </div>
    )
}

export default function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug
    const searchParams = useSearchParams()
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (!containerRef.current) return

        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const renderWidget = WIDGETS[slug]

    if (!renderWidget) {
        return <div className="p-4 font-mono text-xs">Widget not found</div>
    }

    return (
        <div
            ref={containerRef}
            className="w-screen h-screen overflow-hidden bg-white"
        >
            {dimensions.width > 0 && renderWidget(dimensions.width, dimensions.height, searchParams)}
        </div>
    )
}
