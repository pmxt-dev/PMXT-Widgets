# Mini Chance Chart Widget

A compact, high-fidelity tracker for specific prediction market outcomes. Designed to fit into sidebars, news feeds, or dashboards.

## Usage

```tsx
import { MiniChart } from '@/widgets'

function MyDashboard() {
  return (
    <MiniChart
      title="Will Bitcoin hit $100k in 2025?"
      chance={65}
      change24h={2.4}
      data={[60, 61, 58, 59, 62, 63, 61, 62, 64, 65]}
      platform="Polymarket"
      width={320}
    />
  )
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The market question/title. |
| `chance` | `number` | The current percentage chance (0-100). |
| `change24h` | `number` | The percentage point change in the last 24 hours. |
| `data` | `number[]` | Array of historical percentage values for the sparkline. |
| `platform` | `string` | (Optional) The source platform (e.g., "Polymarket", "Kalshi"). Default: "PMXT". |
| `width` | `number \| string` | Widget width. |
| `logoUrl` | `string` | (Optional) URL for the platform logo. |
