/**
 * Hero backdrop artwork, drawn in SVG so it stays crisp at any size:
 * a gradient glow, film grain, a guilloché-style seal with a slowly turning
 * ring, and a line drawing of the scales of justice.
 */
export function HeroArt() {
  const rings = Array.from({ length: 9 }, (_, i) => 120 + i * 34);
  // Guilloché rosette: overlapping ellipses rotated around the seal's centre.
  const petals = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* Glow */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(60% 55% at 78% 18%, rgba(70,170,115,0.42), transparent 70%)",
            "radial-gradient(45% 50% at 12% 85%, rgba(214,150,72,0.30), transparent 70%)",
            "radial-gradient(70% 60% at 50% 110%, rgba(110,140,220,0.22), transparent 70%)",
            "linear-gradient(160deg, #182744 0%, #111c33 55%, #0c1426 100%)",
          ].join(","),
        }}
      />

      {/* Fine ledger lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 39px, #f5f2ea 39px, #f5f2ea 40px)",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 85%)",
        }}
      />

      {/* Seal */}
      <svg
        viewBox="-500 -500 1000 1000"
        className="absolute -right-80 -top-56 h-[820px] w-[820px] opacity-[0.5] lg:-right-56 lg:-top-64"
        fill="none"
      >
        <g stroke="#f5f2ea" strokeOpacity="0.12" strokeWidth="1">
          {rings.map((r) => (
            <circle key={r} r={r} />
          ))}
        </g>
        <g stroke="#9fd8b6" strokeOpacity="0.22" strokeWidth="0.8">
          {petals.map((deg) => (
            <ellipse key={deg} rx="250" ry="92" transform={`rotate(${deg})`} />
          ))}
        </g>
        <g className="hero-spin" stroke="#f5f2ea" strokeOpacity="0.35">
          <circle r="420" strokeWidth="1.2" strokeDasharray="2 10" />
          <circle r="452" strokeWidth="0.8" strokeDasharray="40 14 4 14" />
        </g>
        <circle r="96" stroke="#9fd8b6" strokeOpacity="0.35" strokeWidth="1.5" />
      </svg>

      {/* Scales of justice */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -bottom-24 -left-36 hidden h-[400px] w-[400px] opacity-[0.16] xl:block"
        fill="none"
        stroke="#f5f2ea"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M200 40v300M130 340h140M60 110h280" />
        <circle cx="200" cy="34" r="10" />
        <path d="M60 110 20 220h80L60 110ZM340 110l-40 110h80l-40-110Z" />
        <path d="M20 220a40 22 0 0 0 80 0M300 220a40 22 0 0 0 80 0" />
      </svg>

      {/* Film grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* Inner edge highlight */}
      <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
