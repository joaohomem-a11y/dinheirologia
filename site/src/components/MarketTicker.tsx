'use client';

const TICKER_DATA = [
  { symbol: 'IBOV', value: '191.490', change: '+1.40%', positive: true },
  { symbol: 'S&P 500', value: '6.890', change: '+0.77%', positive: true },
  { symbol: 'NASDAQ', value: '23.100', change: '+1.06%', positive: true },
  { symbol: 'DOW', value: '49.277', change: '+0.26%', positive: true },
  { symbol: 'USD/BRL', value: '5.15', change: '-0.03%', positive: false },
  { symbol: 'EUR/BRL', value: '6.07', change: '+0.12%', positive: true },
  { symbol: 'BTC', value: '65.099', change: '+3.5%', positive: true },
  { symbol: 'Ouro', value: '5.121', change: '+0.45%', positive: true },
  { symbol: 'Selic', value: '15.00%', change: '', positive: true },
];

export default function MarketTicker() {
  // Duplicate items for seamless loop
  const items = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="bg-navy-900 overflow-hidden">
      <div className="ticker-scroll flex whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-4 py-1.5 font-sans text-caption text-cream-100">
            <span className="font-semibold">{item.symbol}</span>
            <span>{item.value}</span>
            {item.change && (
              <span className={item.positive ? 'text-green-400' : 'text-salmon-400'}>
                {item.change}
              </span>
            )}
            <span className="text-navy-500 ml-2">|</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
