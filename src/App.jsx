import React, { useCallback, useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import GameTable from './components/GameTable';
import Controls from './components/Controls';
import ChipSelector from './components/ChipSelector';

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = [
  { sym: '♠', name: 'spades', color: 'black' },
  { sym: '♥', name: 'hearts', color: 'red' },
  { sym: '♣', name: 'clubs', color: 'black' },
  { sym: '♦', name: 'diamonds', color: 'red' },
];

function buildDeck() {
  const deck = [];
  for (const s of suits) {
    for (const r of ranks) {
      const value = r === 'A' ? 11 : ['J', 'Q', 'K'].includes(r) ? 10 : parseInt(r, 10);
      deck.push({ rank: r, suit: s.sym, color: s.color, value, id: `${r}${s.sym}-${Math.random().toString(36).slice(2, 9)}` });
    }
  }
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function scoreHand(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    total += card.value;
    if (card.rank === 'A') aces += 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10; // Count an Ace as 1 instead of 11
    aces -= 1;
  }
  return total;
}

export default function App() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState('Place your bet to start');
  const [phase, setPhase] = useState('betting'); // betting | player | dealer | roundOver

  const playerTotal = useMemo(() => scoreHand(playerHand), [playerHand]);
  const dealerTotal = useMemo(() => scoreHand(dealerHand), [dealerHand]);

  const ensureDeck = useCallback(() => {
    setDeck((d) => (d.length < 10 ? buildDeck() : d));
  }, []);

  useEffect(() => {
    setDeck(buildDeck());
  }, []);

  const drawCard = useCallback(() => {
    return setDeck((prev) => {
      let newDeck = prev;
      if (newDeck.length === 0) newDeck = buildDeck();
      const card = newDeck[0];
      const rest = newDeck.slice(1);
      setDeck(rest);
      return rest;
    });
  }, []);

  const dealCard = useCallback((to) => {
    setDeck((prev) => {
      let d = prev;
      if (d.length === 0) d = buildDeck();
      const [card, ...rest] = d;
      if (to === 'player') setPlayerHand((h) => [...h, card]);
      else setDealerHand((h) => [...h, card]);
      return rest;
    });
  }, []);

  const placeBet = (amount) => {
    if (phase !== 'betting') return;
    if (amount <= 0) return;
    if (amount > balance) return;
    setBet((b) => b + amount);
    setBalance((bal) => bal - amount);
  };

  const clearBet = () => {
    if (phase !== 'betting') return;
    setBalance((bal) => bal + bet);
    setBet(0);
  };

  const deal = () => {
    if (phase !== 'betting' || bet <= 0) return;
    setPlayerHand([]);
    setDealerHand([]);
    ensureDeck();
    // Initial deal
    setTimeout(() => dealCard('player'), 50);
    setTimeout(() => dealCard('dealer'), 200);
    setTimeout(() => dealCard('player'), 350);
    setTimeout(() => dealCard('dealer'), 500);
    setPhase('player');
    setMessage('Your move: Hit or Stand');
  };

  useEffect(() => {
    if (phase !== 'player') return;
    const total = playerTotal;
    if (playerHand.length >= 2) {
      if (total === 21) {
        setMessage("Blackjack or 21! Standing...");
        setTimeout(() => stand(), 400);
      } else if (total > 21) {
        setMessage('Bust! Dealer wins.');
        setPhase('roundOver');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerTotal, phase, playerHand.length]);

  const hit = () => {
    if (phase !== 'player') return;
    dealCard('player');
  };

  const stand = () => {
    if (phase !== 'player') return;
    setPhase('dealer');
    setMessage("Dealer's turn...");
  };

  // Dealer logic
  useEffect(() => {
    if (phase !== 'dealer') return;
    const playDealer = async () => {
      let currentTotal = scoreHand(dealerHand);
      // Reveal and draw until 17 or more
      while (currentTotal < 17) {
        await new Promise((r) => setTimeout(r, 500));
        setDeck((prev) => {
          let d = prev;
          if (d.length === 0) d = buildDeck();
          const [card, ...rest] = d;
          setDealerHand((h) => {
            const nh = [...h, card];
            currentTotal = scoreHand(nh);
            return nh;
          });
          return rest;
        });
      }
      // Resolve outcome
      await new Promise((r) => setTimeout(r, 600));
      const p = scoreHand(playerHand);
      const dTot = scoreHand(dealerHand);
      if (dTot > 21 || p > dTot) {
        setMessage('You win!');
        setBalance((bal) => bal + bet * 2);
      } else if (p === dTot) {
        setMessage('Push. Bet returned.');
        setBalance((bal) => bal + bet);
      } else {
        setMessage('Dealer wins.');
      }
      setPhase('roundOver');
    };
    playDealer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const newRound = () => {
    setBet(0);
    setPlayerHand([]);
    setDealerHand([]);
    setMessage('Place your bet to start');
    setPhase('betting');
    ensureDeck();
  };

  const canDeal = phase === 'betting' && bet > 0;
  const canHit = phase === 'player';
  const canStand = phase === 'player';
  const canNewRound = phase === 'roundOver';

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <HeroCover />
      <main className="relative mx-auto max-w-6xl px-4 pb-24">
        <section className="-mt-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-6 md:p-8">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold">Blackjack</h2>
                <p className="text-white/70">Balance: ${balance} • Current Bet: ${bet}</p>
              </div>
              <div className="text-sm text-white/80">{message}</div>
            </div>

            <GameTable
              playerHand={playerHand}
              dealerHand={dealerHand}
              playerTotal={playerTotal}
              dealerTotal={dealerTotal}
              phase={phase}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Controls
                  onDeal={deal}
                  onHit={hit}
                  onStand={stand}
                  onNewRound={newRound}
                  canDeal={canDeal}
                  canHit={canHit}
                  canStand={canStand}
                  canNewRound={canNewRound}
                />
              </div>
              <div>
                <ChipSelector
                  balance={balance}
                  bet={bet}
                  onAddChip={placeBet}
                  onClear={clearBet}
                  disabled={phase !== 'betting'}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
