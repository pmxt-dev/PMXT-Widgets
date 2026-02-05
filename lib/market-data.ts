export interface MarketItem {
  name: string
  value: number
  color?: string
  exchange?: 'kalshi' | 'polymarket' | 'limitless'
  children?: MarketItem[]
}

export interface MarketData {
  categories: MarketItem[]
  totalValue: number
  lastUpdated: Date
}

export const defaultMarketData: MarketData = {
  totalValue: 884200000,
  lastUpdated: new Date('2026-02-04'),
  categories: [
    {
      name: 'Politics',
      value: 424500000,
      color: 'var(--category-politics)',
      children: [
        {
          name: 'US Elections',
          value: 280000000,
          children: [
            { name: 'Dem Presidential Nominee', value: 85000000, exchange: 'polymarket' },
            { name: 'Military', value: 30000000, exchange: 'kalshi' },
            { name: 'US Presidential Election', value: 65000000, exchange: 'polymarket' },
            { name: 'GOP Presidential Nominee', value: 75000000, exchange: 'polymarket' },
            { name: '+141 others', value: 8000000, exchange: 'limitless' },
            { name: 'Presidential Winner', value: 12000000, exchange: 'polymarket' },
            { name: 'Senate Nominations', value: 3000000, exchange: 'kalshi' },
            { name: 'May...', value: 2000000, exchange: 'limitless' },
          ],
        },
        {
          name: 'Legislature',
          value: 50000000,
          children: [
            { name: 'Government Shutdown', value: 20000000, exchange: 'kalshi' },
            { name: '+50 others', value: 8000000, exchange: 'limitless' },
            { name: 'Government Funding', value: 7000000, exchange: 'kalshi' },
            { name: 'House Contro...', value: 6000000, exchange: 'polymarket' },
            { name: 'Leader Transition', value: 5000000, exchange: 'kalshi' },
            { name: 'Executive', value: 2000000, exchange: 'limitless' },
            { name: 'Conflict', value: 2000000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'Appointments',
          value: 65000000,
          children: [
            { name: 'Nomination', value: 40000000, exchange: 'polymarket' },
            { name: 'Fed Chair', value: 15000000, exchange: 'kalshi' },
            { name: 'Leader Transition', value: 10000000, exchange: 'limitless' },
          ],
        },
        {
          name: 'Foreign Policy',
          value: 15000000,
          children: [
            {
              name: 'US-Iran Relations',
              value: 5000000,
              children: [
                { name: 'Territory', value: 2000000, exchange: 'polymarket' },
                { name: 'China-Taiwan Relations', value: 1000000, exchange: 'kalshi' },
                { name: 'Election', value: 800000, exchange: 'polymarket' },
                { name: 'Ceasefire', value: 700000, exchange: 'limitless' },
                { name: 'Leader Transition', value: 500000, exchange: 'kalshi' },
              ],
            },
            { name: 'Leader Transition', value: 4000000, exchange: 'polymarket' },
            { name: 'Military', value: 3000000, exchange: 'kalshi' },
            { name: 'Judiciary', value: 1500000, exchange: 'limitless' },
            { name: 'Political Events', value: 1500000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'International Elections',
          value: 14500000,
          children: [
            { name: '+50 others', value: 5000000, exchange: 'limitless' },
            { name: 'Government...', value: 3000000, exchange: 'kalshi' },
            { name: 'Leader Transition', value: 2500000, exchange: 'polymarket' },
            { name: 'Executive', value: 2000000, exchange: 'limitless' },
            { name: 'Presidential...', value: 1000000, exchange: 'kalshi' },
            { name: 'Conflict', value: 1000000, exchange: 'polymarket' },
          ],
        },
      ],
    },
    {
      name: 'Sports',
      value: 309700000,
      color: 'var(--category-sports)',
      children: [
        {
          name: 'Basketball',
          value: 140000000,
          children: [
            { name: 'NBA Game', value: 50000000, exchange: 'kalshi' },
            { name: 'March Madness', value: 25000000, exchange: 'polymarket' },
            { name: '+59 others', value: 20000000, exchange: 'limitless' },
            { name: 'NBA Champion', value: 18000000, exchange: 'kalshi' },
            { name: 'NBA Total Points', value: 12000000, exchange: 'polymarket' },
            { name: 'NBA MVP', value: 10000000, exchange: 'limitless' },
            { name: 'NBA Spread', value: 5000000, exchange: 'kalshi' },
          ],
        },
        {
          name: 'Football',
          value: 90000000,
          children: [
            { name: 'Super Bowl Champion', value: 35000000, exchange: 'polymarket' },
            { name: 'NFL Coach of Year', value: 18000000, exchange: 'kalshi' },
            { name: 'NFL MVP', value: 12000000, exchange: 'limitless' },
            { name: 'Super Bowl MVP', value: 10000000, exchange: 'polymarket' },
            { name: 'NFL Game', value: 8000000, exchange: 'kalshi' },
            { name: '+53 others', value: 4000000, exchange: 'limitless' },
            { name: 'NFL Offensive...', value: 3000000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'Soccer',
          value: 48000000,
          children: [
            { name: 'Soccer Spread', value: 15000000, exchange: 'kalshi' },
            { name: 'EPL Champion', value: 12000000, exchange: 'polymarket' },
            { name: 'Soccer Game', value: 10000000, exchange: 'limitless' },
            { name: 'Soccer Champion', value: 8000000, exchange: 'kalshi' },
            { name: 'UCL Champion', value: 3000000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'Hockey',
          value: 20000000,
          children: [
            { name: 'NHL Game', value: 10000000, exchange: 'kalshi' },
            { name: 'Stanley Cup Champion', value: 10000000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'Sports Combo',
          value: 6700000,
          children: [
            { name: 'Multi-sport Parlays', value: 2500000, exchange: 'limitless' },
            { name: 'Combined Props', value: 2200000, exchange: 'kalshi' },
            { name: 'Futures Combo', value: 2000000, exchange: 'polymarket' },
          ],
        },
        {
          name: 'Esports',
          value: 3000000,
          children: [
            { name: 'Baseball', value: 1500000, exchange: 'kalshi' },
            { name: 'MMA', value: 1000000, exchange: 'polymarket' },
            { name: 'Golf', value: 500000, exchange: 'limitless' },
          ],
        },
      ],
    },
    {
      name: 'Crypto',
      value: 66800000,
      color: 'var(--category-crypto)',
      children: [
        { name: 'Bitcoin', value: 38000000, exchange: 'polymarket' },
        { name: 'Bitcoin Price', value: 18000000, exchange: 'kalshi' },
        { name: 'Ethereum', value: 8000000, exchange: 'limitless' },
        { name: 'Ethereum Price', value: 2800000, exchange: 'polymarket' },
      ],
    },
    {
      name: 'Culture',
      value: 36600000,
      color: 'var(--category-culture)',
      children: [
        { name: 'Movies', value: 12000000, exchange: 'kalshi' },
        { name: 'Academy Awards', value: 8000000, exchange: 'polymarket' },
        { name: 'Music', value: 7500000, exchange: 'limitless' },
        { name: 'TV', value: 5600000, exchange: 'kalshi' },
        { name: 'Social Media', value: 3500000, exchange: 'polymarket' },
      ],
    },
    {
      name: 'Economics',
      value: 22500000,
      color: 'var(--category-economics)',
      children: [
        { name: 'Interest Rate', value: 9000000, exchange: 'kalshi' },
        { name: 'GDP', value: 6500000, exchange: 'polymarket' },
        { name: 'Federal Reserve', value: 5000000, exchange: 'limitless' },
        { name: 'Inflation', value: 2000000, exchange: 'kalshi' },
      ],
    },
    {
      name: 'STEM',
      value: 9600000,
      color: 'var(--category-stem)',
      children: [
        { name: 'AI Research', value: 4000000, exchange: 'polymarket' },
        { name: 'Space Exploration', value: 3500000, exchange: 'kalshi' },
        { name: 'Climate', value: 2100000, exchange: 'limitless' },
      ],
    },
    {
      name: 'International',
      value: 14500000,
      color: 'var(--category-international)',
      children: [
        { name: 'Executive', value: 6500000, exchange: 'polymarket' },
        { name: 'Leader Transition', value: 5000000, exchange: 'kalshi' },
        { name: 'Conflict', value: 3000000, exchange: 'limitless' },
      ],
    },
  ],
}
