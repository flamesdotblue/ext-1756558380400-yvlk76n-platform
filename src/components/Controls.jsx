import React from 'react';

export default function Controls({ onDeal, onHit, onStand, onNewRound, canDeal, canHit, canStand, canNewRound }) {
  const baseBtn =
    'px-4 py-2 rounded-lg font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-wrap gap-3">
      <button
        className={`${baseBtn} bg-emerald-600 hover:bg-emerald-500`}
        onClick={onDeal}
        disabled={!canDeal}
      >
        Deal
      </button>
      <button
        className={`${baseBtn} bg-indigo-600 hover:bg-indigo-500`}
        onClick={onHit}
        disabled={!canHit}
      >
        Hit
      </button>
      <button
        className={`${baseBtn} bg-amber-600 hover:bg-amber-500`}
        onClick={onStand}
        disabled={!canStand}
      >
        Stand
      </button>
      <button
        className={`${baseBtn} bg-slate-700 hover:bg-slate-600 ml-auto`}
        onClick={onNewRound}
        disabled={!canNewRound}
      >
        New Round
      </button>
    </div>
  );
}
