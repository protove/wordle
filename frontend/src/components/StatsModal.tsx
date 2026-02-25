'use client';

import { useCallback } from 'react';
import { GameStats } from '@/types';

interface StatsModalProps {
  stats: GameStats;
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  targetWord?: string;
  gameStatus?: string;
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <span className="text-2xl sm:text-3xl font-black text-cosmic-white">{value}</span>
      <span className="text-[10px] sm:text-xs text-cosmic-gray text-center leading-tight uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function StatsModal({
  stats,
  isOpen,
  onClose,
  onNewGame,
  targetWord,
  gameStatus,
}: StatsModalProps) {
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxDistribution = Math.max(...stats.guessDistribution, 1);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center modal-backdrop bg-[rgba(10,14,23,0.75)]"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <div className="relative w-full max-w-sm mx-4 animate-slide-up">
        {/* Card */}
        <div className="bg-[#1a2535] border border-[#2d4055] rounded-2xl p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cosmic-gray hover:text-cosmic-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold rounded-lg p-1"
            aria-label="Close statistics"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title */}
          <h2
            id="stats-title"
            className="text-center text-cosmic-white font-black text-lg tracking-widest uppercase mb-5"
          >
            Statistics
          </h2>

          {/* Lost reveal */}
          {gameStatus === 'lost' && targetWord && (
            <div className="mb-4 text-center">
              <p className="text-cosmic-gray text-xs uppercase tracking-widest mb-1">The word was</p>
              <p className="text-cosmic-gold font-black text-xl tracking-[0.2em] uppercase">
                {targetWord}
              </p>
            </div>
          )}

          {/* Stat boxes */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-6">
            <StatBox label="Played" value={stats.gamesPlayed} />
            <StatBox label="Win %" value={winRate} />
            <StatBox label="Current Streak" value={stats.currentStreak} />
            <StatBox label="Max Streak" value={stats.maxStreak} />
          </div>

          {/* Guess distribution */}
          <div className="mb-6">
            <h3 className="text-center text-cosmic-gray text-xs uppercase tracking-widest mb-3">
              Guess Distribution
            </h3>
            <div className="flex flex-col gap-1.5">
              {stats.guessDistribution.map((count, i) => {
                const pct = Math.max(
                  Math.round((count / maxDistribution) * 100),
                  count > 0 ? 8 : 4
                );
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-cosmic-gray text-xs font-bold w-3 text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 h-6 flex items-center">
                      <div
                        className="h-full flex items-center justify-end pr-2 rounded stats-bar-fill min-w-[24px]"
                        style={{
                          width: `${pct}%`,
                          background:
                            count > 0
                              ? 'linear-gradient(90deg, #42708C, #80ADBF)'
                              : '#2a3545',
                        }}
                      >
                        <span className="text-cosmic-white text-xs font-bold">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Game button */}
          <button
            onClick={onNewGame}
            className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest
              bg-cosmic-blue hover:bg-cosmic-light text-cosmic-white transition-all duration-200
              hover:shadow-lg hover:shadow-[rgba(66,112,140,0.4)] active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold"
            type="button"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
