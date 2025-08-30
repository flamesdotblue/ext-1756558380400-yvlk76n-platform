import React from 'react';

const chips = [5, 10, 25, 50, 100];

export default function ChipSelector({ balance, bet, onAddChip, onClear, disabled }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Betting</h4>
        <div className="text-sm text-white/70">Balance: ${balance}</div>
      </div>
      <div className="flex gap-3 flex-wrap">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => onAddChip(c)}
            disabled={disabled || c > balance}
            className={`h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              c === 5 ? 'bg-rose-500/80 hover:bg-rose-500' :
              c === 10 ? 'bg-amber-500/80 hover:bg-amber-500' :
              c === 25 ? 'bg-emerald-500/80 hover:bg-emerald-500' :
              c === 50 ? 'bg-sky-500/80 hover:bg-sky-500' :
              'bg-violet-500/80 hover:bg-violet-500'
            }`}
          >
            ${c}
          </button>
        ))}
        <button
          onClick={onClear}
          disabled={disabled || bet === 0}
          className="ml-auto px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 border border-white/10 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Bet
        </button>
      </div>
    </div>
  );
}
