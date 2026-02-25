'use client';

import { useMemo } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
}

interface ShootingStar {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
  width: string;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function StarBackground() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 90 }, (_, i) => {
      const r = (n: number) => seededRandom(i * 7 + n);
      const sizeVal = r(0) < 0.6 ? '1px' : r(0) < 0.85 ? '2px' : '3px';
      return {
        id: i,
        top: `${r(1) * 100}%`,
        left: `${r(2) * 100}%`,
        size: sizeVal,
        animationDelay: `${(r(3) * 4).toFixed(2)}s`,
        animationDuration: `${(2 + r(4) * 3).toFixed(2)}s`,
        opacity: 0.3 + r(5) * 0.7,
      };
    });
  }, []);

  const shootingStars = useMemo<ShootingStar[]>(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const r = (n: number) => seededRandom(i * 13 + n + 100);
      return {
        id: i,
        top: `${r(0) * 50}%`,
        left: `${r(1) * 30}%`,
        animationDelay: `${(i * 2.5 + r(2) * 2).toFixed(2)}s`,
        width: `${60 + Math.floor(r(3) * 60)}px`,
      };
    });
  }, []);

  return (
    <div
      className="star-field"
      aria-hidden="true"
    >
      {/* Deep space gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top, #1e2a3a 0%, #141A26 60%, #0a0e17 100%)',
        }}
      />

      {/* Nebula overlay */}
      <div className="absolute inset-0 nebula-overlay" />

      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
            opacity: star.opacity,
            backgroundColor:
              star.id % 7 === 0
                ? 'rgba(242, 191, 145, 0.9)'
                : star.id % 5 === 0
                ? 'rgba(128, 173, 191, 0.9)'
                : 'rgba(232, 241, 245, 0.9)',
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((ss) => (
        <div
          key={ss.id}
          className="shooting-star"
          style={{
            top: ss.top,
            left: ss.left,
            width: ss.width,
            animationDelay: ss.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
