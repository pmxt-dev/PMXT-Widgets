'use client'

import React from 'react'
import { BaseWidgetConfig } from '@/lib/widget-types'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type ControlDefinition = 'theme' | 'font' | 'shadow' | 'marketUrl'

interface WidgetSettingsProps {
    settings: BaseWidgetConfig
    onChange: (settings: BaseWidgetConfig | ((prev: BaseWidgetConfig) => BaseWidgetConfig)) => void
    controls: ControlDefinition[]
}

export function WidgetSettings({ settings, onChange, controls }: WidgetSettingsProps) {
    const updateSetting = (key: keyof BaseWidgetConfig, value: any) => {
        onChange(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] space-y-8 transition-all duration-300">
            <div className="border-b border-black dark:border-white/20 pb-4">
                <h2 className="text-2xl font-sans uppercase font-bold tracking-tight text-black dark:text-white">Customization</h2>
                <p className="text-xs font-mono uppercase text-black/40 dark:text-white/40 mt-1">Configure your widget</p>
            </div>

            <div className="space-y-6">
                {controls.includes('marketUrl') && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-mono uppercase tracking-widest text-black dark:text-white">Market URL</Label>
                        <Input
                            placeholder="https://polymarket.com/..."
                            value={settings.marketUrl}
                            onChange={(e) => updateSetting('marketUrl', e.target.value)}
                            className="rounded-none border-black dark:border-white/20 dark:bg-black dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <p className="text-[10px] text-black/40 dark:text-white/40 italic">Paste link(s) from Polymarket, Kalshi, or Limitless (separated by space)</p>
                    </div>
                )}

                {controls.includes('theme') && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-mono uppercase tracking-widest text-black dark:text-white">Theme Mode</Label>
                        <Select
                            value={settings.theme}
                            onValueChange={(val) => updateSetting('theme', val)}
                        >
                            <SelectTrigger className="rounded-none border-black dark:border-white/20 dark:bg-black dark:text-white focus:ring-0">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-black dark:border-white/20 dark:bg-zinc-900 dark:text-white">
                                <SelectItem value="light">Light Mode</SelectItem>
                                <SelectItem value="dark">Dark Mode</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {controls.includes('font') && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-mono uppercase tracking-widest text-black dark:text-white">Font Stack</Label>
                        <Select
                            value={settings.font || 'mono'}
                            onValueChange={(val) => updateSetting('font', val)}
                        >
                            <SelectTrigger className="rounded-none border-black dark:border-white/20 dark:bg-black dark:text-white focus:ring-0">
                                <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-black dark:border-white/20 dark:bg-zinc-900 dark:text-white">
                                <SelectItem value="mono">Mono (Technical)</SelectItem>
                                <SelectItem value="serif">Serif (Editorial)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {controls.includes('shadow') && (
                    <div className="flex items-center justify-between p-4 border border-black dark:border-white/20 bg-zinc-50 dark:bg-black transition-colors duration-300">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-mono uppercase tracking-widest text-black dark:text-white">Drop Shadows</Label>
                            <p className="text-[10px] text-black/40 dark:text-white/40">Enable neo-brutalist depth</p>
                        </div>
                        <Switch
                            checked={settings.showShadow}
                            onCheckedChange={(checked) => updateSetting('showShadow', checked)}
                            className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white dark:bg-zinc-700"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
