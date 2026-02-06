export type WidgetTheme = 'light' | 'dark';
export type WidgetFont = 'mono' | 'serif';

export interface BaseWidgetConfig {
    theme: WidgetTheme;
    font?: WidgetFont;
    showShadow: boolean;
    marketUrl?: string;
    width?: number;
}

export interface MiniChartConfig extends BaseWidgetConfig {
    title: string;
    chance: number;
    change24h: number;
    data: number[];
    platform: string;
}

export interface TimelineConfig extends BaseWidgetConfig {
    height: number;
    selectedFilter: string;
}

export interface ChanceChartConfig extends BaseWidgetConfig {
    urls: string[];
    height: number;
}

export interface RawNumberConfig extends BaseWidgetConfig {
    value: number;
}

export interface LiveOddsPillConfig extends BaseWidgetConfig {
    label: string;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
    clickUrl: string;
    compact?: boolean;
}

export interface FaceOffBarConfig extends BaseWidgetConfig {
    optionA: {
        label: string;
        percentage: number;
        color: string;
    };
    optionB: {
        label: string;
        percentage: number;
        color: string;
    };
    clickUrl: string;
    height: number;
}
