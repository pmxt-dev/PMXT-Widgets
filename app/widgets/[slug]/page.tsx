'use client'

import React, { use, useState, useEffect, useRef } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { Treemap, TimelineChart, ChanceChart, RawNumber, LiveOddsPill, FaceOffBar, MiniChart } from '@/widgets'
import { defaultMarketData } from '@/lib/market-data'

const WIDGET_CONFIGS: Record<string, any> = {
    treemap: {
        title: 'Market Treemap',
        description: 'Hierarchical view of volume and open interest across prediction markets.',
        render: (w: number) => (
            <div className="w-full">
                <Treemap
                    data={defaultMarketData.categories}
                    width={w}
                    height={500}
                    globalTotalValue={defaultMarketData.totalValue}
                    rootName="All Markets"
                    rootValue={defaultMarketData.totalValue}
                />
            </div>
        ),
        snippet: `<iframe 
  src="https://widgets.pmxt.dev/treemap" 
  width="100%" 
  height="500" 
  frameborder="0"
></iframe>`
    },
    timeline: {
        title: 'Volume Timeline',
        description: 'Historical volume tracking across major prediction exchanges.',
        render: (w: number) => (
            <div className="w-full bg-white p-4">
                <TimelineChart width={w} height={400} selectedFilter="all" />
            </div>
        ),
        snippet: `<iframe 
  src="https://widgets.pmxt.dev/timeline" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`
    },
    chance: {
        title: 'Chance Chart',
        description: 'Real-time percentage chance tracking with historical trend.',
        render: (w: number) => (
            <div className="w-full">
                <ChanceChart
                    width={w}
                    height={400}
                    urls={[
                        'https://polymarket.com/event/mamdani-opens-city-owned-grocery-store-by-june-30',
                        'https://kalshi.com/markets/kxmarriageswiftkelce/swift-kelce-married/kxmarriageswiftkelce-26'
                    ]}
                />
            </div>
        ),
        snippet: `<iframe 
  src="https://widgets.pmxt.dev/chance" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`
    },
    number: {
        title: 'Raw Number',
        description: 'Simple, high-impact display of current prediction market odds.',
        render: (w: number) => (
            <div className="w-full h-[300px] flex items-center justify-center">
                <RawNumber value={64.2} width={w > 400 ? 400 : w} />
            </div>
        ),
        snippet: `<iframe 
  src="https://widgets.pmxt.dev/number" 
  width="100%" 
  height="300" 
  frameborder="0"
></iframe>`
    },
    'live-odds-pill': {
        title: 'Live Odds Pill',
        description: 'Inline badge for embedding live prediction odds directly in text content.',
        render: (w: number) => (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 gap-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="text-center max-w-2xl">
                    <p className="text-xl leading-relaxed text-gray-700">
                        OpenAI just announced GPT-5 will launch next quarter. But will we see{' '}
                        <LiveOddsPill
                            label="AGI in 2025?"
                            percentage={12}
                            trend="down"
                            clickUrl="https://pmxt.dev"
                        />
                        {' '}Many experts remain skeptical about the timeline.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <LiveOddsPill label="Bitcoin $100K?" percentage={67} trend="up" clickUrl="https://pmxt.dev" />
                    <LiveOddsPill label="Recession 2026?" percentage={34} trend="down" clickUrl="https://pmxt.dev" />
                    <LiveOddsPill label="Mars Landing?" percentage={8} trend="neutral" clickUrl="https://pmxt.dev" />
                    <LiveOddsPill label="Compact" percentage={45} trend="up" compact={true} clickUrl="https://pmxt.dev" />
                </div>
            </div>
        ),
        snippet: `<!-- React/Next.js -->
<LiveOddsPill 
  label="AGI in 2025?" 
  percentage={12} 
  trend="down"
  clickUrl="https://pmxt.dev"
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/live-odds-pill?label=AGI%20in%202025&percentage=12&trend=down" 
  width="200" 
  height="40" 
  frameborder="0"
></iframe>`
    },
    'face-off-bar': {
        title: 'Face-Off Bar',
        description: 'Binary prediction visualizer perfect for politics, sports, and any head-to-head matchup.',
        render: (w: number) => (
            <div className="w-full min-h-[400px] flex flex-col justify-center p-8 gap-8 bg-gradient-to-br from-gray-50 to-white">
                <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Who wins the 2028 election?</h3>
                    <FaceOffBar
                        optionA={{
                            label: 'Harris',
                            percentage: 52,
                            color: 'blue'
                        }}
                        optionB={{
                            label: 'Trump',
                            percentage: 48,
                            color: 'orange'
                        }}
                        clickUrl="https://pmxt.dev"
                        height={50}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Which AI lab ships AGI first?</h3>
                    <FaceOffBar
                        optionA={{
                            label: 'OpenAI',
                            percentage: 64,
                            color: 'green'
                        }}
                        optionB={{
                            label: 'DeepMind',
                            percentage: 36,
                            color: 'blue'
                        }}
                        clickUrl="https://pmxt.dev"
                        height={50}
                    />
                </div>
            </div>
        ),
        snippet: `<!-- React/Next.js -->
<FaceOffBar
  optionA={{
    label: 'Harris',
    percentage: 52,
    color: '#3b82f6',
    emoji: '🔵'
  }}
  optionB={{
    label: 'Trump',
    percentage: 48,
    color: '#ef4444',
    emoji: '🔴'
  }}
  clickUrl="https://pmxt.dev"
  height={50}
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/face-off-bar?a=Harris&a_pct=52&b=Trump&b_pct=48" 
  width="100%" 
  height="120" 
  frameborder="0"
></iframe>`
    },
    'mini-chart': {
        title: 'Mini Chance Chart',
        description: 'A professional, compact tracker for specific prediction market outcomes. Perfect for sidebars or dashboards.',
        render: (w: number) => (
            <div className="w-full flex items-center justify-center p-4">
                <MiniChart
                    title="Will Bitcoin hit $100k in 2025?"
                    chance={65}
                    change24h={2.4}
                    data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64, 65, 66, 68, 70, 69, 67, 65, 64, 66, 68, 69, 70, 72, 71, 69, 68, 67, 68, 70, 71, 72, 74, 75, 76, 74, 73, 72, 71, 70]}
                    platform="Polymarket"
                    width={Math.min(w, 400)}
                />
            </div>
        ),
        snippet: `<!-- React/Next.js -->
<MiniChart
  title="Will Bitcoin hit $100k in 2025?"
  chance={65}
  change24h={2.4}
  data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64, 65, 66, 68, 70, 69, 67, 65, 64, 66, 68, 69, 70, 72, 71, 69, 68, 67, 68, 70, 71, 72, 74, 75, 76, 74, 73, 72, 71, 70]}
  platform="Polymarket"
  width={320}
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/mini-chart?title=Will%20Bitcoin%20hit%20$100k%20in%202025?&chance=65&change=2.4" 
  width="320" 
  height="200" 
  frameborder="0"
></iframe>`
    }
}

export default function WidgetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug
    const config = WIDGET_CONFIGS[slug]
    const [copied, setCopied] = useState(false)
    const [width, setWidth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth)
            }
        }

        updateWidth()
        const observer = new ResizeObserver(() => updateWidth())
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    if (!config) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center font-mono gap-4">
                <p>Widget "{slug}" not found.</p>
                <Link href="/" className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors">
                    Go back home
                </Link>
            </div>
        )
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(config.snippet)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] text-black font-serif pb-20">
            <header className="border-b border-black bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-mono uppercase tracking-widest">Back to Widgets</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tighter uppercase font-sans">pmxt</span>
                        <span className="text-xs font-mono opacity-50 tracking-widest">[WIDGETS]</span>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-16">
                <div className="mb-12">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 mb-4">Widget Documentation</div>
                    <h1 className="text-5xl md:text-7xl font-normal tracking-tighter mb-6 uppercase font-sans leading-none">{config.title}</h1>
                    <p className="text-xl md:text-2xl text-black/60 max-w-2xl leading-relaxed font-serif italic">
                        {config.description}
                    </p>
                </div>

                <div className="bg-white border border-black p-4 md:p-8 mb-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div ref={containerRef} className="w-full min-h-[400px] flex items-center justify-center overflow-hidden">
                        {width > 0 && config.render(width)}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-black pb-4">
                            <h2 className="text-2xl font-sans uppercase font-bold tracking-tight">Embed Code</h2>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest bg-black text-white px-6 py-3 hover:bg-black/90 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy Snippet'}
                            </button>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-black/5 rounded-none blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-zinc-900 text-zinc-100 p-8 font-mono text-sm overflow-x-auto border border-black leading-relaxed">
                                <pre><code>{config.snippet}</code></pre>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}

