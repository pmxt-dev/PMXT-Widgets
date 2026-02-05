import { MarketData, MarketItem, defaultMarketData } from './market-data';

/**
 * Fetches market data from the "backend" (currently returns mock data).
 * This will later be updated to use pmxt.
 */
export async function fetchMarketData(): Promise<MarketData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        ...defaultMarketData,
        lastUpdated: new Date()
    };
}

/**
 * Sorts market items by value descending.
 */
export function sortMarketItems(items: MarketItem[]): MarketItem[] {
    return [...items].sort((a, b) => b.value - a.value).map(item => {
        if (item.children) {
            return {
                ...item,
                children: sortMarketItems(item.children)
            };
        }
        return item;
    });
}

/**
 * Filters market items by exchange.
 */
export function filterMarketItems(items: MarketItem[], exchange: string): MarketItem[] {
    if (exchange === 'all') return items;

    return items
        .map((item) => {
            if (item.children) {
                const filteredChildren = filterMarketItems(item.children, exchange);
                if (filteredChildren.length > 0) {
                    return {
                        ...item,
                        children: filteredChildren,
                        value: filteredChildren.reduce((sum, child) => sum + child.value, 0)
                    };
                }
                return null;
            }
            return item.exchange === exchange ? item : null;
        })
        .filter((item): item is MarketItem => item !== null);
}

/**
 * Filters market items by search query.
 */
export function searchMarketItems(items: MarketItem[], query: string): MarketItem[] {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();

    return items
        .map((item) => {
            // If item name matches, keep it and all its children
            if (item.name.toLowerCase().includes(lowerQuery)) {
                return item;
            }

            // Otherwise, filter children
            if (item.children) {
                const filteredChildren = searchMarketItems(item.children, query);
                if (filteredChildren.length > 0) {
                    return {
                        ...item,
                        children: filteredChildren,
                        value: filteredChildren.reduce((sum, child) => sum + child.value, 0)
                    };
                }
            }
            return null;
        })
        .filter((item): item is MarketItem => item !== null);
}
