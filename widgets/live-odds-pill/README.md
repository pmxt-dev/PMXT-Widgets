# Live Odds Pill Widget

A sleek, inline pill-shaped badge designed to embed live prediction market odds directly within text content.

## Overview

The Live Odds Pill is an "Engagement Magnet" widget that transforms passive text into interactive, live data points. Perfect for news sites, blogs, and Substacks that want to make their articles more dynamic and engaging.

## Features

- **Inline Design**: Sits naturally within sentences and headlines
- **Trend Indicators**: Visual color coding (green for up, red for down, gray for neutral)
- **Clickable**: Optional link to drive traffic to your prediction market
- **Compact Mode**: Smaller variant for dense layouts
- **Responsive**: Adapts to different screen sizes

## Usage

### React/Next.js

```tsx
import { LiveOddsPill } from '@/widgets'

<LiveOddsPill 
  label="AGI in 2025?" 
  percentage={12} 
  trend="down"
  clickUrl="https://pmxt.dev"
/>
```

### In Context

```tsx
<p>
  OpenAI just announced GPT-5 will launch next quarter. But will we see{' '}
  <LiveOddsPill 
    label="AGI in 2025?" 
    percentage={12} 
    trend="down"
    clickUrl="https://pmxt.dev"
  />
  {' '}Many experts remain skeptical.
</p>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | The question or event label |
| `percentage` | `number` | Required | The current odds percentage |
| `trend` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Visual trend indicator |
| `clickUrl` | `string` | Optional | URL to navigate to on click |
| `compact` | `boolean` | `false` | Use smaller, compact styling |

## Examples

### Different Trends

```tsx
<LiveOddsPill label="Bitcoin $100K?" percentage={67} trend="up" />
<LiveOddsPill label="Recession 2026?" percentage={34} trend="down" />
<LiveOddsPill label="Mars Landing?" percentage={8} trend="neutral" />
```

### Compact Mode

```tsx
<LiveOddsPill 
  label="Quick Poll" 
  percentage={45} 
  trend="up"
  compact={true}
/>
```

## Traffic Driver

The Live Odds Pill turns passive text into a live data point. When readers see "AGI in 2025? 12%", they naturally wonder "Why is it only 12%?" and click through to explore the full prediction market.

## Design Philosophy

- **Minimal**: Doesn't distract from the main content
- **Informative**: Provides instant context
- **Interactive**: Encourages engagement through curiosity
