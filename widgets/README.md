# PMXT Widgets

Flexible, modular, and embeddable widgets for prediction market data.

## Directory Structure

Each widget should live in its own directory within `widgets/`:

```
widgets/
  ├── [widget-name]/
  │   ├── [widget-name]-widget.tsx  # Main component
  │   ├── types.ts                  # Shared types
  │   ├── hooks.ts                  # Widget-specific logic
  │   └── README.md                 # Usage documentation
  └── index.ts                      # Central export point
```

## Adding a New Widget

1. Create a new directory in `widgets/`.
2. Implement your component. Ensure it accepts `width` and `height` props for flexibility.
3. Export your widget from `widgets/index.ts`.
4. Add a demo in `app/examples/` to showcase its functionality.

## Principles

- **Modular**: Widgets should be self-contained as much as possible.
- **Data-Driven**: Powered by PMXT data structures (`lib/market-data.ts`).
- **Responsive**: Use the provided `width` and `height` to adapt to different containers.
- **Themed**: Use CSS variables (like `--font-mono`, `--font-serif`) for consistent styling.
