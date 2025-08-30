import React from 'react';

function Card({ card, hidden = false }) {
  if (hidden) {
    return (
      <div className="w-14 h-20 md:w-16 md:h-24 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 border border-white/20 shadow-lg transform -rotate-3" />
    );
  }
  const color = card.color === 'red' ? 'text-rose-500' : 'text-white';
  return (
    <div className="w-14 h-20 md:w-16 md:h-24 rounded-xl bg-slate-800 border border-white/20 shadow-lg flex flex-col items-center justify-between p-2">
      <div className={`text-sm ${color}`}>{card.rank}</div>
      <div className={`text-xl ${color}`}>{card.suit}</div>
      <div className={`text-sm ${color}`}>{card.rank}</div>
    </div>
  );
}

export default function GameTable({ playerHand, dealerHand, playerTotal, dealerTotal, phase }) {
  const dealerHideHole = phase === 'player' && dealerHand.length >= 2;
  return (
    <div className="rounded-xl bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-white/10 p-4 md:p-6">
      <div className="grid grid-cols-1 gap-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white/90">Dealer</h3>
            <span className="text-white/70 text-sm">{dealerHideHole ? '??' : dealerTotal}</span>
          </div>
          <div className="flex gap-3">
            {dealerHand.map((c, i) => (
              <Card key={c.id} card={c} hidden={dealerHideHole && i === 0} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white/90">Player</h3>
            <span className="text-white/70 text-sm">{playerTotal}</span>
          </div>
          <div className="flex gap-3">
            {playerHand.map((c) => (
              <Card key={c.id} card={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
