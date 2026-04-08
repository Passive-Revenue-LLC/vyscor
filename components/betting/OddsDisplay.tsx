'use client';

interface OddsDisplayProps {
  homeOdds?: string;
  drawOdds?: string;
  awayOdds?: string;
}

export default function OddsDisplay({ homeOdds = '1.85', drawOdds = '3.40', awayOdds = '2.10' }: OddsDisplayProps) {
  const odds = [
    { label: '1', value: homeOdds },
    { label: 'X', value: drawOdds },
    { label: '2', value: awayOdds },
  ];

  return (
    <div className="flex gap-2">
      {odds.map((odd) => (
        <div
          key={odd.label}
          className="flex-1 flex flex-col items-center gap-1 px-2 sm:px-3 py-2 bg-bg-tertiary border border-border rounded-lg opacity-60 cursor-not-allowed select-none"
        >
          <span className="font-mono text-[10px] text-muted">{odd.label}</span>
          <span className="font-mono text-xs text-[#FFFFFF]">🔒 {odd.value}</span>
        </div>
      ))}
    </div>
  );
}
