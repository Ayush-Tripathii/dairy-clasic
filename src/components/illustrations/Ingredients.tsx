/**
 * Hand-built ingredient illustrations for the hero edges.
 * Self-hosted vectors in the brand's warm palette — swap for photographic
 * transparent cut-outs (WebP with soft shadow) when the shoot is done.
 */
type P = { className?: string };

export function Raspberry({ className }: P) {
  const drupe = [
    [50, 30], [36, 38], [64, 38], [28, 52], [50, 46], [72, 52], [38, 62], [62, 62], [50, 74], [30, 70], [70, 70], [44, 86], [58, 86],
  ];
  return (
    <svg viewBox="0 0 100 110" className={className} aria-hidden>
      <defs>
        <radialGradient id="rb-g" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#ff7a86" />
          <stop offset="0.55" stopColor="#d81f3f" />
          <stop offset="1" stopColor="#8f0f28" />
        </radialGradient>
      </defs>
      <path d="M50 18c-6-8-16-10-22-6 8 0 13 4 16 9-8-3-17-1-20 5 9-2 16 0 20 4" fill="#5c8a3a" />
      <path d="M50 18c6-8 16-10 22-6-8 0-13 4-16 9 8-3 17-1 20 5-9-2-16 0-20 4" fill="#4b7a2e" />
      {drupe.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="11.5" fill="url(#rb-g)" />
          <circle cx={x - 3.5} cy={y - 4} r="2.6" fill="#fff" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

export function Peanut({ className }: P) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden>
      <defs>
        <linearGradient id="pn-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2c98f" />
          <stop offset="0.6" stopColor="#d9a05b" />
          <stop offset="1" stopColor="#a8693a" />
        </linearGradient>
      </defs>
      <path d="M10 35c0-15 12-26 27-26 9 0 14 5 23 5s14-5 23-5c15 0 27 11 27 26S98 61 83 61c-9 0-14-5-23-5s-14 5-23 5C22 61 10 50 10 35Z" fill="url(#pn-g)" />
      <path d="M60 15v40" stroke="#b77a43" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="34" cy="26" rx="12" ry="5" fill="#fff" opacity="0.3" />
      <ellipse cx="86" cy="26" rx="12" ry="5" fill="#fff" opacity="0.25" />
    </svg>
  );
}

export function ChocolateChunk({ className }: P) {
  return (
    <svg viewBox="0 0 110 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="cc-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b4a3a" />
          <stop offset="1" stopColor="#5a2a20" />
        </linearGradient>
      </defs>
      <path d="M14 30 52 10l46 18-8 46-42 18-34-22Z" fill="#3f1c15" />
      <path d="M14 30 52 10l46 18-44 20Z" fill="url(#cc-top)" />
      <path d="M54 48 98 28l-8 46-42 18Z" fill="#4a221a" />
      <path d="M30 30h0M44 23l26 10M30 32l26 10" stroke="#a5604c" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function Wafer({ className }: P) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="wf-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d39c" />
          <stop offset="1" stopColor="#d7a15c" />
        </linearGradient>
        <clipPath id="wf-c">
          <path d="M8 26 80 6l32 30-20 58L18 84Z" />
        </clipPath>
      </defs>
      <path d="M8 26 80 6l32 30-20 58L18 84Z" fill="url(#wf-g)" />
      <g clipPath="url(#wf-c)" stroke="#b9823f" strokeWidth="3" opacity="0.75">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`a${i}`} d={`M${-20 + i * 18} 0l60 110`} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`b${i}`} d={`M${140 - i * 18} 0l-60 110`} />
        ))}
      </g>
      <path d="M8 26 80 6l32 30" stroke="#fff" strokeWidth="2" opacity="0.5" fill="none" />
    </svg>
  );
}

export function VanillaPod({ className }: P) {
  return (
    <svg viewBox="0 0 160 60" className={className} aria-hidden>
      <defs>
        <linearGradient id="vp-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a3b2a" />
          <stop offset="1" stopColor="#2e140d" />
        </linearGradient>
      </defs>
      <path d="M6 44C40 22 96 10 150 14c4 0 6 3 2 5C104 28 52 40 12 52c-6 2-10-4-6-8Z" fill="url(#vp-g)" />
      <path d="M20 42C56 26 100 18 146 17" stroke="#8a5a43" strokeWidth="1.6" fill="none" opacity="0.7" />
      <path d="M150 14c6-4 8-8 7-12" stroke="#3a1a10" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* vanilla flower */}
      <g transform="translate(118 36)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="5" ry="11" transform={`rotate(${r}) translate(0 -9)`} fill="#fbf1d6" stroke="#ecd9a8" strokeWidth="0.8" />
        ))}
        <circle r="4.2" fill="#f2c94c" />
      </g>
    </svg>
  );
}
