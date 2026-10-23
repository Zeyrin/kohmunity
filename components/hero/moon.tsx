/**
 * Pure moon geometry + SVG. The lit area is: right semicircle of the disc + an elliptical
 * terminator whose x-radius = R·|1 − 2f| (f = illuminated fraction). Updating one path `d`
 * per frame is far cheaper than masks/filters and stays crisp at any size.
 */
export const R = 90;

export function litPath(f: number): string {
  const frac = Math.min(Math.max(f, 0), 1);
  if (frac >= 0.999) return `M0 ${-R}A${R} ${R} 0 1 1 0 ${R}A${R} ${R} 0 1 1 0 ${-R}Z`;
  const rx = Math.abs(R * (1 - 2 * frac)).toFixed(2);
  const sweep = frac < 0.5 ? 0 : 1; // crescent: terminator bulges right; gibbous: bulges left
  return `M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${rx} ${R} 0 0 ${sweep} 0 ${-R}Z`;
}

export const INITIAL_FRACTION = 0.06;

export function MoonSvg({ fraction, pathId }: { fraction: number; pathId: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id={`${pathId}-lit`} cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f8f1e1" />
          <stop offset="100%" stopColor="#dccfb0" />
        </radialGradient>
        <clipPath id={`${pathId}-clip`}>
          <path id={pathId} d={litPath(fraction)} />
        </clipPath>
      </defs>
      {/* earthshine: the unlit disc is faintly visible, like the real thing */}
      <circle r={R} fill="#0d0b2b" opacity="0.38" />
      <circle r={R} fill="none" stroke="rgb(251 246 236 / .12)" strokeWidth="0.8" />
      <g clipPath={`url(#${pathId}-clip)`}>
        <circle r={R} fill={`url(#${pathId}-lit)`} />
        {/* maria / craters */}
        <g fill="#c9b994" opacity="0.38">
          <ellipse cx="-28" cy="-22" rx="22" ry="17" />
          <ellipse cx="18" cy="-38" rx="14" ry="10" />
          <ellipse cx="30" cy="12" rx="26" ry="20" />
          <ellipse cx="-20" cy="34" rx="16" ry="12" />
          <circle cx="-48" cy="18" r="7" />
          <circle cx="52" cy="-28" r="5" />
          <circle cx="4" cy="58" r="6" />
        </g>
        <g fill="none" stroke="#a8977a" strokeWidth="1.2" opacity="0.5">
          <circle cx="-8" cy="8" r="6" />
          <circle cx="44" cy="44" r="4" />
          <circle cx="-56" cy="-30" r="4" />
        </g>
      </g>
    </svg>
  );
}
