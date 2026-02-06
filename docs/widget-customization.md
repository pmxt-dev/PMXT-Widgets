# PMXT Widget Customization: Design Document

This document outlines the customization system for PMXT widgets, including global settings, widget-specific properties, and the technical implementation for exportability.

## 1. Global Customizations (The "Base" Config)
All widgets implement these standard properties to ensure visual consistency across parent sites.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `light` \| `dark` | `light` | Switches between parchment white (#FFFFFF) and terminal black (#000000). |
| `showShadow` | `boolean` | `true` | Toggles the 12px neo-brutalist hard shadow. |
| `font` | `mono` \| `serif` | `mono` | Controls the primary display font stack. |
| `width` | `string` \| `number` | `100%` | Ensures the widget fits its container or a fixed pixel width. |
| `borderRadius` | `number` | `0` | Defaults to brutalist square edges, but allows slight rounding for softer UI. |

---

## 2. Widget-Specific Customizations

### A. Mini Chance Chart
*The compact, sidebar-optimized tracker.*
*   **Market Source:** `marketUrl` (Resolves platform and icon automatically).
*   **Header Toggle:** `showPlatformIcon` (Boolean).
*   **Trend Style:** `trendColor` (Override default Green/Red with custom branding).
*   **Interactivity:** `showCrosshair` (Boolean) - enable/disable hover state on the sparkline.

### B. Full Chance Chart
*The high-fidelity historical tracker.*
*   **Data Layout:** `multiAxis` (Boolean) - whether to stack or separate Y-axes for different markets.
*   **Visualization:** `interpolation` (`step` | `linear` | `smooth`). Step is best for "Truth" events; smooth is best for sentiment.
*   **Legend:** `showLegend` (Boolean) - display source names at the top.
*   **Timeframe:** `range` (`24h`, `7d`, `30d`, `all`).

### C. Raw Number (High Impact)
*For landing pages and big-screen displays.*
*   **Formatting:** `precision` (Number of decimal places).
*   **Anomalies:** `showTrendArrow` (Up/Down arrow next to the % symbol).
*   **Content:** `subtext` (Optional small text below the number).

### D. Live Odds Pill
*Inline badges for news articles and social feeds.*
*   **State:** `animation` (`none` | `pulse`) - pulse effect when the price changes in real-time.
*   **Density:** `compact` (Boolean) - hide the label, show only the percentage badge.
*   **Style:** `hollow` (Boolean) - transparent background with just an outline.

### E. Face-Off Bar
*Head-to-head competition visualization.*
*   **Branding:** `colorA` / `colorB` (Custom hex codes for candidates/teams).
*   **Visuals:** `showEmoji` (Boolean) - toggle political party or team emojis.
*   **Sizing:** `thickness` (Height in pixels).

### F. Market Treemap
*The "Stock Market" view of prediction volume.*
*   **Metric:** `valueBy` (`volume` | `openInterest` | `liquidity`).
*   **Color Strategy:** `colorBy` (`category` | `change24h`). Shows green/red heat based on price movement.
*   **Filtering:** `minVolume` (Filter out dust markets).

---

## 3. Implementation Logic

### URL Parameter Structure
The exported `<iframe>` uses a predictable query string format:
`?theme=dark&shadow=1&url=...&accent=ff0000`

*   **Booleans:** Represented as `1` or `0` for URL brevity.
*   **Arrays:** Space-separated or comma-separated strings (e.g., `?urls=url1+url2`).
*   **Colors:** Hex codes without the `#` prefix.

### Data Hydration
1.  **Url-driven:** If a `url` param is present, the widget triggers a server-side "unfurl" to fetch live odds.
2.  **Mock Mode:** If no `url` is present, the widget displays high-quality mock data (standardized for demos).
