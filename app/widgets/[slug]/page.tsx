'use client'

import React, { use, useState, useEffect, useRef } from 'react'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { Treemap, TimelineChart, ChanceChart, RawNumber, LiveOddsPill, FaceOffBar, MiniChart } from '@/widgets'
import { defaultMarketData } from '@/lib/market-data'

import { BaseWidgetConfig, WidgetTheme } from '@/lib/widget-types'

const WIDGET_CONFIGS: Record<string, any> = {
    treemap: {
        title: 'Market Treemap',
        description: 'Hierarchical view of volume and open interest across prediction markets.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full">
                <Treemap
                    data={defaultMarketData.categories}
                    width={w}
                    height={500}
                    globalTotalValue={defaultMarketData.totalValue}
                    rootName="All Markets"
                    rootValue={defaultMarketData.totalValue}
                    theme={config.theme}
                    showShadow={config.showShadow}
                />
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<iframe 
  src="https://widgets.pmxt.dev/treemap?theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}" 
  width="100%" 
  height="500" 
  frameborder="0"
></iframe>`
    },
    timeline: {
        title: 'Volume Timeline',
        description: 'Historical volume tracking across major prediction exchanges.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full">
                <TimelineChart
                    width={w}
                    height={400}
                    selectedFilter="all"
                    theme={config.theme}
                    showShadow={config.showShadow}
                />
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<iframe 
  src="https://widgets.pmxt.dev/timeline?theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`
    },
    chance: {
        title: 'Chance Chart',
        description: 'Real-time percentage chance tracking with historical trend.',
        render: (w: number, config: BaseWidgetConfig) => {
            const urls = config.marketUrl
                ? config.marketUrl.split(' ').filter(u => u.trim() !== '')
                : [
                    'https://polymarket.com/event/mamdani-opens-city-owned-grocery-store-by-june-30',
                    'https://kalshi.com/markets/kxmarriageswiftkelce/swift-kelce-married/kxmarriageswiftkelce-26'
                ]

            return (
                <div className="w-full">
                    <ChanceChart
                        width={w}
                        height={400}
                        theme={config.theme}
                        showShadow={config.showShadow}
                        urls={urls}
                    />
                </div>
            )
        },
        snippet: (config: BaseWidgetConfig) => `<iframe 
  src="https://widgets.pmxt.dev/chance?theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}${config.marketUrl ? `&urls=${encodeURIComponent(config.marketUrl)}` : ''}" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`
    },
    number: {
        title: 'Raw Number',
        description: 'Simple, high-impact display of current prediction market odds.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full h-[300px] flex items-center justify-center">
                <RawNumber
                    value={64.2}
                    width={w > 400 ? 400 : w}
                    theme={config.theme}
                    showShadow={config.showShadow}
                />
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<iframe 
  src="https://widgets.pmxt.dev/number?theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}" 
  width="100%" 
  height="300" 
  frameborder="0"
></iframe>`
    },
    'live-odds-pill': {
        title: 'Live Odds Pill',
        description: 'Inline badge for embedding live prediction odds directly in text content.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 gap-8">
                <div className="text-center max-w-2xl">
                    <p className={`text-xl leading-relaxed ${config.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        OpenAI just announced GPT-5 will launch next quarter. But will we see{' '}
                        <LiveOddsPill
                            label="AGI in 2025?"
                            percentage={12}
                            trend="down"
                            clickUrl="https://pmxt.dev"
                            theme={config.theme}
                            showShadow={config.showShadow}
                        />
                        {' '}Many experts remain skeptical about the timeline.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <LiveOddsPill label="Bitcoin $100K?" percentage={67} trend="up" clickUrl="https://pmxt.dev" theme={config.theme} showShadow={config.showShadow} />
                    <LiveOddsPill label="Recession 2026?" percentage={34} trend="down" clickUrl="https://pmxt.dev" theme={config.theme} showShadow={config.showShadow} />
                    <LiveOddsPill label="Mars Landing?" percentage={8} trend="neutral" clickUrl="https://pmxt.dev" theme={config.theme} showShadow={config.showShadow} />
                    <LiveOddsPill label="Compact" percentage={45} trend="up" compact={true} clickUrl="https://pmxt.dev" theme={config.theme} showShadow={config.showShadow} />
                </div>
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<!-- React/Next.js -->
<LiveOddsPill 
  label="AGI in 2025?" 
  percentage={12} 
  trend="down"
  clickUrl="https://pmxt.dev"
  theme="${config.theme}"
  showShadow={${config.showShadow}}
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/live-odds-pill?label=AGI%20in%202025&percentage=12&trend=down&theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}" 
  width="200" 
  height="40" 
  frameborder="0"
></iframe>`
    },
    'face-off-bar': {
        title: 'Face-Off Bar',
        description: 'Binary prediction visualizer perfect for politics, sports, and any head-to-head matchup.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full min-h-[400px] flex flex-col justify-center p-8 gap-8">
                <div>
                    <h3 className={`text-lg font-bold mb-3 ${config.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Who wins the 2028 election?</h3>
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
                        theme={config.theme}
                        showShadow={config.showShadow}
                    />
                </div>
                <div>
                    <h3 className={`text-lg font-bold mb-3 ${config.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Which AI lab ships AGI first?</h3>
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
                        theme={config.theme}
                        showShadow={config.showShadow}
                    />
                </div>
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<!-- React/Next.js -->
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
  theme="${config.theme}"
  showShadow={${config.showShadow}}
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/face-off-bar?a=Harris&a_pct=52&b=Trump&b_pct=48&theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}" 
  width="100%" 
  height="120" 
  frameborder="0"
></iframe>`
    },
    'mini-chart': {
        title: 'Mini Chance Chart',
        description: 'A professional, compact tracker for specific prediction market outcomes. Perfect for sidebars or dashboards.',
        render: (w: number, config: BaseWidgetConfig) => (
            <div className="w-full flex items-center justify-center p-4">
                <MiniChart
                    title="Will Bitcoin hit $100k in 2025?"
                    chance={65}
                    change24h={2.4}
                    data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64, 65, 66, 68, 70, 69, 67, 65, 64, 66, 68, 69, 70, 72, 71, 69, 68, 67, 68, 70, 71, 72, 74, 75, 76, 74, 73, 72, 71, 70]}
                    platform="Polymarket"
                    width={Math.min(w, 400)}
                    theme={config.theme}
                    showShadow={config.showShadow}
                />
            </div>
        ),
        snippet: (config: BaseWidgetConfig) => `<!-- React/Next.js -->
<MiniChart
  title="Will Bitcoin hit $100k in 2025?"
  chance={65}
  change24h={2.4}
  data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64, 65, 66, 68, 70, 69, 67, 65, 64, 66, 68, 69, 70, 72, 71, 69, 68, 67, 68, 70, 71, 72, 74, 75, 76, 74, 73, 72, 71, 70]}
  platform="Polymarket"
  width={Math.min(w, 400)}
  theme="${config.theme}"
  showShadow={${config.showShadow}}
/>

<!-- HTML Embed -->
<iframe 
  src="https://widgets.pmxt.dev/mini-chart?title=Will%20Bitcoin%20hit%20$100k%20in%202025?&chance=65&change=2.4&theme=${config.theme}&shadow=${config.showShadow ? '1' : '0'}${config.marketUrl ? `&url=${encodeURIComponent(config.marketUrl)}` : ''}" 
  width="320" 
  height="200" 
  frameborder="0"
></iframe>`
    }
}

import { WidgetSettings } from '@/components/widget-settings'

export default function WidgetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params)
    const slug = resolvedParams.slug
    const config = WIDGET_CONFIGS[slug]
    const [copied, setCopied] = useState(false)
    const [width, setWidth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Widget customisation state
    const [settings, setSettings] = useState<BaseWidgetConfig>({
        theme: 'light',
        font: 'mono',
        showShadow: true,
        marketUrl: ''
    })

    useEffect(() => {
        if (!containerRef.current) return
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth)
            }
        }

        updateWidth()
        window.addEventListener('resize', updateWidth)
        const observer = new ResizeObserver(() => updateWidth())
        observer.observe(containerRef.current)
        return () => {
            window.removeEventListener('resize', updateWidth)
            observer.disconnect()
        }
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

    const currentSnippet = typeof config.snippet === 'function' ? config.snippet(settings) : config.snippet

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentSnippet)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`${settings.theme === 'dark' ? 'dark bg-black' : 'bg-[#FBFBFB]'} min-h-screen text-black dark:text-white font-serif pb-20 transition-colors duration-300`}>
            <header className="border-b border-black dark:border-white/20 bg-white dark:bg-black sticky top-0 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-black dark:text-white">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-mono uppercase tracking-widest">Back to Widgets</span>
                    </Link>
                    <div className="flex items-center gap-2 text-black dark:text-white">
                        <span className="text-xl font-bold tracking-tighter uppercase font-sans">pmxt</span>
                        <span className="text-xs font-mono opacity-50 tracking-widest">[WIDGETS]</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-16">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    <div className="flex-1 min-w-0">
                        <div className="mb-12">
                            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-4">Widget Documentation</div>
                            <h1 className="text-5xl md:text-7xl font-normal tracking-tighter mb-6 uppercase font-sans leading-none text-black dark:text-white">{config.title}</h1>
                            <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 max-w-2xl leading-relaxed font-serif italic">
                                {config.description}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-black dark:border-white p-4 md:p-8 mb-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] transition-all duration-300">
                            <div ref={containerRef} className="w-full min-h-[400px] flex items-center justify-center overflow-hidden">
                                {width > 0 && config.render(width, settings)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            <section className="space-y-6">
                                <div className="flex items-center justify-between border-b border-black dark:border-white pb-4">
                                    <h2 className="text-2xl font-sans uppercase font-bold tracking-tight text-black dark:text-white">Embed Code</h2>
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-6 py-3 hover:bg-black/90 dark:hover:bg-white/90 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied' : 'Copy Snippet'}
                                    </button>
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-black/5 dark:bg-white/5 rounded-none blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative bg-zinc-900 dark:bg-black text-zinc-100 p-8 font-mono text-sm overflow-x-auto border border-black dark:border-white/20 leading-relaxed shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
                                        <pre><code>{currentSnippet}</code></pre>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] shrink-0 sticky top-32">
                        <WidgetSettings
                            settings={settings}
                            onChange={setSettings}
                            controls={['theme', 'font', 'shadow', 'marketUrl']}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}


