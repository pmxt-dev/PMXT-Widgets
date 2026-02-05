'use client'

import React from 'react'
import { ArrowRight, LayoutGrid, BarChart3, Box, LineChart, Hash, Share2, Activity, PieChart } from 'lucide-react'
import { Treemap, TimelineChart, ChanceChart, RawNumber, LiveOddsPill, FaceOffBar, MiniChart } from '@/widgets'
import { defaultMarketData } from '@/lib/market-data'

import Link from 'next/link'
import { HeroVisual } from '@/components/hero-visual'

export default function LandingPage() {
  const scrolltoWidgets = () => {
    document.getElementById('widgets')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black font-serif">
      <header className="border-b border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter uppercase font-mono">pmxt</span>
            <span className="text-xs font-mono opacity-50 tracking-widest">[WIDGETS]</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="https://pmxt.dev" target="_blank" className="text-sm font-mono hover:underline">PMXT.DEV</a>
            <a href="https://github.com/pmxt-dev" target="_blank" className="text-sm font-mono hover:underline">GITHUB</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 max-w-7xl mx-auto border-x border-black/5 min-h-[80vh] flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="flex-1 max-w-2xl relative z-10">
            <h1 className="text-6xl md:text-8xl font-normal leading-[0.9] mb-8 tracking-tighter">
              Widgets for <span className="italic">prediction markets.</span>
            </h1>
            <p className="text-xl md:text-2xl font-serif text-black/60 mb-12 max-w-xl leading-relaxed">
              Open source components for Polymarket, Kalshi, and more. Embed them anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <a
                href="/examples/terminal"
                className="bg-black text-white px-8 py-4 text-sm font-mono uppercase tracking-widest flex items-center gap-3 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all group"
              >
                Launch Live Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <button
                onClick={scrolltoWidgets}
                className="text-sm font-mono uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group px-4"
              >
                See the widgets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl hidden lg:block">
            <HeroVisual />
          </div>
        </section>

        {/* Widgets Grid */}
        <section id="widgets" className="py-24 px-6 max-w-7xl mx-auto border-t border-x border-black/5 bg-white">
          <div className="mb-24 px-4">
            <h2 className="text-5xl font-normal tracking-tight mb-4 text-center">The Widget Library</h2>
            <p className="text-xl text-black/50 text-center font-serif max-w-2xl mx-auto">
              Modular components designed for high-performance prediction market applications.
            </p>
          </div>

          <div className="space-y-32">
            {/* Macro Views */}
            <div className="space-y-12">
              <div className="flex items-center gap-4 border-b border-black pb-4 mx-4">
                <PieChart className="w-8 h-8" />
                <h3 className="text-3xl font-normal tracking-tight">Market Macro</h3>
                <span className="text-xs font-mono opacity-30 ml-auto uppercase tracking-widest">High-Level Data Visualizers</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/10 border border-black/10">
                <WidgetPreview
                  slug="treemap"
                  title="Market Treemap"
                  description="Hierarchical view of volume and open interest across all categories."
                  render={(w) => (
                    <div className="w-full h-[400px] overflow-hidden">
                      <Treemap
                        data={defaultMarketData.categories}
                        width={w}
                        height={400}
                        globalTotalValue={defaultMarketData.totalValue}
                        rootName="All Markets"
                        rootValue={defaultMarketData.totalValue}
                      />
                    </div>
                  )}
                />
                <WidgetPreview
                  slug="timeline"
                  title="Volume Timeline"
                  description="Historical volume across exchanges to track market liquidity trends."
                  render={(w) => (
                    <div className="w-full h-[400px] flex flex-col justify-center bg-white p-4">
                      <TimelineChart width={w} height={300} selectedFilter="all" />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Outcome Monitoring */}
            <div className="space-y-12">
              <div className="flex items-center gap-4 border-b border-black pb-4 mx-4">
                <Activity className="w-8 h-8" />
                <h3 className="text-3xl font-normal tracking-tight">Outcome Monitoring</h3>
                <span className="text-xs font-mono opacity-30 ml-auto uppercase tracking-widest">Tracking Specific Odds</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/10 border border-black/10">
                <WidgetPreview
                  slug="chance"
                  title="Full Chance Chart"
                  description="Real-time percentage chance tracking with historical price action."
                  render={(w) => (
                    <div className="w-full h-full p-4">
                      <ChanceChart
                        width={w - 64}
                        height={300}
                        urls={[
                          'https://polymarket.com/event/mamdani-opens-city-owned-grocery-store-by-june-30',
                          'https://kalshi.com/markets/kxmarriageswiftkelce/swift-kelce-married/kxmarriageswiftkelce-26'
                        ]}
                      />
                    </div>
                  )}
                />
                <WidgetPreview
                  slug="mini-chart"
                  title="Mini Chance Chart"
                  description="A compact tracker for specific prediction market outcomes, perfect for dashboards."
                  render={(w) => (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gray-50/50">
                      <MiniChart
                        title="Will Bitcoin hit $100k in 2025?"
                        chance={65}
                        change24h={2.4}
                        data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65, 63, 64, 65, 66, 68, 70, 69, 67, 65, 64, 66, 68, 69, 70, 72, 71, 69, 68, 67, 68, 70, 71, 72, 74, 75, 76, 74, 73, 72, 71, 70]}
                        platform="Polymarket"
                        width={320}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Social & Embeds */}
            <div className="space-y-12">
              <div className="flex items-center gap-4 border-b border-black pb-4 mx-4">
                <Share2 className="w-8 h-8" />
                <h3 className="text-3xl font-normal tracking-tight">Social & Embeds</h3>
                <span className="text-xs font-mono opacity-30 ml-auto uppercase tracking-widest">Compact UI Components</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/10 border border-black/10">
                <WidgetPreview
                  slug="live-odds-pill"
                  title="Live Odds Pill"
                  description="Inline badge for embedding odds directly into articles and text blocks."
                  render={(w) => (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-6 bg-gradient-to-br from-gray-50 to-white">
                      <div className="text-center max-w-lg">
                        <p className="text-lg leading-relaxed text-gray-700">
                          OpenAI just announced GPT-5 will launch next quarter. But will we see{' '}
                          <LiveOddsPill
                            label="AGI in 2025?"
                            percentage={12}
                            trend="down"
                            clickUrl="https://pmxt.dev"
                          />
                          {' '}Many experts remain skeptical.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center justify-center">
                        <LiveOddsPill label="Bitcoin $100K?" percentage={67} trend="up" />
                        <LiveOddsPill label="Recession?" percentage={34} trend="down" />
                        <LiveOddsPill label="Mars Landing?" percentage={8} trend="neutral" />
                      </div>
                    </div>
                  )}
                />
                <WidgetPreview
                  slug="face-off-bar"
                  title="Face-Off Bar"
                  description="Binary prediction visualizer comparing two outcomes side-by-side."
                  render={(w) => (
                    <div className="w-full h-full flex flex-col justify-center p-8 gap-6 bg-gradient-to-br from-gray-50 to-white">
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
                  )}
                />
                <WidgetPreview
                  slug="number"
                  title="Raw Number"
                  description="High-impact display of current odds for hero sections and focus areas."
                  render={(w) => (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <RawNumber value={64.2} width={w > 300 ? 300 : "100%"} />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-black bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="text-2xl font-bold uppercase mb-4">pmxt</div>
            <p className="text-black/60 max-w-xs text-sm leading-relaxed">
              Open source widgets for prediction markets.
            </p>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-6">Links</div>
            <ul className="space-y-3 text-sm">
              <li><a href="https://github.com/pmxt-dev/pmxt" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></li>
              <li><a href="https://pmxt.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">pmxt.dev</a></li>
              <li><a href="https://twitter.com/samtinnerholm" target="_blank" rel="noopener noreferrer" className="hover:underline">𝕏 (Twitter)</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex justify-between items-center text-[10px] font-mono text-black/30">
          <div>© 2026 PMXT</div>
          <div>OPEN SOURCE COMPONENTS</div>
        </div>
      </footer>
    </div>
  )
}

function WidgetPreview({ slug, title, description, render }: { slug: string, title: string, description: string, render: (width: number) => React.ReactNode }) {
  const [width, setWidth] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width)
      }
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      href={`/widgets/${slug}`}
      className="bg-white p-6 md:p-8 flex flex-col gap-6 hover:bg-gray-50/50 transition-colors group cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-normal mb-2 tracking-tight group-hover:underline">{title}</h3>
          <p className="text-sm text-black/60 leading-relaxed font-serif">
            {description}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </div>
      <div ref={ref} className="border border-black/5 shadow-sm overflow-hidden flex items-center justify-center bg-gray-50/30 min-h-[300px]">
        {width > 0 && render(width)}
      </div>
    </Link>
  )
}

