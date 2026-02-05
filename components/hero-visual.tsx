'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MiniChart, FaceOffBar, RawNumber } from '@/widgets'

export function HeroVisual() {
    const [tilt, setTilt] = useState({ x: 10, y: -20 })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const mouseX = e.clientX - centerX
            const mouseY = e.clientY - centerY

            // Calculate rotation based on mouse position relative to center of component
            // Adjust sensitivities as needed
            const rotateY = (mouseX / (rect.width / 2)) * 15
            const rotateX = -(mouseY / (rect.height / 2)) * 15

            setTilt({ x: rotateX + 10, y: rotateY - 20 })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[500px] flex items-center justify-center perspective-1000 pointer-events-none select-none"
        >
            {/* Dynamic Background Glow */}
            <div
                className="absolute w-[400px] h-[400px] blur-[100px] rounded-full"
                style={{
                    background: 'var(--market-blue)',
                    opacity: 0.1,
                    transform: `translate3d(${tilt.y * 2}px, ${-tilt.x * 2}px, -200px)`
                }}
            />
            <div
                className="absolute w-[300px] h-[300px] blur-[80px] rounded-full translate-x-32 -translate-y-24"
                style={{
                    background: 'var(--market-green)',
                    opacity: 0.1,
                    transform: `translate3d(${-tilt.y}px, ${tilt.x}px, -150px)`
                }}
            />

            {/* The 3D Stack */}
            <div
                className="preserve-3d w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                }}
            >
                {/* Bottom Layer: Raw Number (Confidence) */}
                <div
                    className="absolute transform-gpu"
                    style={{ transform: 'translate3d(-60px, 80px, -100px) rotateZ(-5deg)' }}
                >
                    <div className="scale-90 opacity-70">
                        <RawNumber value={84.2} width={240} />
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-black/40 text-center">
                        </div>
                    </div>
                </div>

                {/* Middle Layer: Face Off (Binary Event) */}
                <div
                    className="absolute transform-gpu"
                    style={{ transform: 'translate3d(40px, -40px, 0px) rotateZ(2deg)' }}
                >
                    <div className="bg-white/90 backdrop-blur-md border border-black shadow-2xl scale-100 group">
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <FaceOffBar
                            optionA={{ label: 'Democrat', percentage: 72, color: 'blue' }}
                            optionB={{ label: 'Conservative', percentage: 28, color: 'orange' }}
                            height={40}
                        />
                    </div>
                </div>

                {/* Top Layer: Mini Chart (Hero Asset) */}
                <div
                    className="absolute transform-gpu"
                    style={{ transform: 'translate3d(-20px, -100px, 120px) rotateZ(-2deg)' }}
                >
                    <div className="bg-white border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] transition-all">
                        <MiniChart
                            title="PMXT Surpasses 1K Stars in 2026"
                            chance={65}
                            change24h={4.2}
                            data={[45, 48, 42, 50, 55, 52, 58, 62, 60, 65, 63, 68, 72, 70, 65]}
                            width={320}
                        />
                    </div>
                </div>

                {/* Floating Accents */}
                <div
                    className="absolute transform-gpu bg-black text-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] shadow-xl"
                    style={{ transform: 'translate3d(180px, 140px, 200px)' }}
                >
                    Live Feed
                </div>

            </div>
        </div>
    )
}
