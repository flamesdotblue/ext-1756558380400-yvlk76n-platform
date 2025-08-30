import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <header className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EFlEghJH3qCmzyRi/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/80" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="pointer-events-none text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">Retro Blackjack</h1>
          <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto drop-shadow-md">
            Step into a playful, retro-inspired casino floor. Place your bets, hit or stand, and try your luck against the dealer.
          </p>
        </div>
      </div>
    </header>
  );
}
