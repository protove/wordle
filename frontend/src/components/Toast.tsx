'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [displayMsg, setDisplayMsg] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      setDisplayMsg(message);
      setVisible(true);
    } else {
      // Fade out first
      const t = setTimeout(() => {
        setVisible(false);
        setDisplayMsg(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!displayMsg) return null;

  return (
    <div
      className={[
        'fixed top-20 left-1/2 -translate-x-1/2 z-50',
        'px-5 py-2.5 rounded-lg',
        'bg-cosmic-gold text-cosmic-dark font-bold text-sm',
        'shadow-lg pointer-events-none',
        'transition-all duration-200',
        visible ? 'opacity-100 translate-y-0 animate-slide-down' : 'opacity-0 -translate-y-2',
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
      aria-live="polite"
    >
      {displayMsg}
    </div>
  );
}
