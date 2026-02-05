# Face-Off Bar Widget

A binary prediction visualizer that gamifies content through head-to-head matchups. Perfect for politics, sports, and any competitive scenario.

## Overview

The Face-Off Bar is an "Engagement Magnet" widget that creates instant tribalism and engagement. It visualizes binary predictions as a tug-of-war style horizontal bar, encouraging users to see if "their side" is winning.

## Features

- **Tug-of-War Visualization**: Single horizontal bar split between two options
- **Customizable Colors**: Match your brand or the nature of the matchup
- **Emoji Support**: Add visual flair with emojis for each option
- **Clickable**: Drive traffic to the full prediction market
- **Responsive**: Adapts to container width
- **Auto-Normalized**: Percentages automatically normalized to 100%

## Usage

### React/Next.js

```tsx
import { FaceOffBar } from '@/widgets'

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
```

## Props

### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `optionA` | `Option` | Required | First option configuration |
| `optionB` | `Option` | Required | Second option configuration |
| `clickUrl` | `string` | Optional | URL to navigate to on click |
| `height` | `number \| string` | `60` | Height of the bar in pixels |
| `showPercentages` | `boolean` | `true` | Show percentage labels |

### Option Object

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Option name/label |
| `percentage` | `number` | Required | Current percentage (auto-normalized) |
| `color` | `string` | Optional | Hex color for this option |
| `emoji` | `string` | Optional | Emoji to display with label |

## Examples

### Politics

```tsx
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
/>
```

### Sports

```tsx
<FaceOffBar
  optionA={{
    label: 'Chiefs',
    percentage: 58,
    color: '#dc2626',
    emoji: '🏈'
  }}
  optionB={{
    label: 'Eagles',
    percentage: 42,
    color: '#059669',
    emoji: '🦅'
  }}
  clickUrl="https://pmxt.dev"
  height={50}
/>
```

### Technology

```tsx
<FaceOffBar
  optionA={{
    label: 'OpenAI',
    percentage: 64,
    color: '#10b981',
    emoji: '🤖'
  }}
  optionB={{
    label: 'DeepMind',
    percentage: 36,
    color: '#8b5cf6',
    emoji: '🧠'
  }}
  clickUrl="https://pmxt.dev"
/>
```

### Without Emojis

```tsx
<FaceOffBar
  optionA={{
    label: 'Yes',
    percentage: 73,
    color: '#22c55e'
  }}
  optionB={{
    label: 'No',
    percentage: 27,
    color: '#ef4444'
  }}
  showPercentages={true}
/>
```

## Traffic Driver

The Face-Off Bar creates instant tribalism. When readers see "Harris 52% | Trump 48%", they immediately want to:
1. See if "their side" is winning
2. Click through to bet and change the odds
3. Share the widget to rally support

This emotional engagement drives significantly higher click-through rates than static content.

## Design Philosophy

- **Simple**: No complex charts, just a clear visual comparison
- **Engaging**: Taps into competitive instincts
- **Branded**: Customizable colors to match any context
- **Informative**: Shows both percentages and visual proportions

## Default Colors

If no colors are specified, the widget uses:
- Option A: `#3b82f6` (Blue)
- Option B: `#ef4444` (Red)

## Auto-Normalization

The widget automatically normalizes percentages to ensure they total 100%, so you don't need to worry about rounding errors:

```tsx
// These percentages will be normalized to 52.5% and 47.5%
<FaceOffBar
  optionA={{ label: 'A', percentage: 52.3 }}
  optionB={{ label: 'B', percentage: 47.2 }}
/>
```
