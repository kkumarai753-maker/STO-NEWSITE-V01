/**
 * Hero visual (Server Component): a stack of translucent glass cubes drawn in
 * isometric SVG, floating inside glowing orbit rings. CSS only (no WebGL, no
 * client JS): the crystal floats, the rings turn slowly in their tilted
 * planes, and everything stops under prefers-reduced-motion (.hero-crystal).
 */

type Cube = readonly [x: number, y: number, z: number];

/** A stepped crystal: a 2×2 base, three cubes on top of it and a crown. */
const CUBES: Cube[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
  [0, 0, 2],
];

const S = 84; // cube edge in SVG units
const INSET = 0.05; // gap between cubes, as a fraction of the edge
const COS = Math.cos(Math.PI / 6);

/** Isometric projection: x runs right-down, y left-down, z up. */
function pt(x: number, y: number, z: number) {
  return `${((x - y) * COS * S).toFixed(1)},${((x + y) * 0.5 * S - z * S).toFixed(1)}`;
}

function faces([cx, cy, cz]: Cube) {
  const a = INSET;
  const b = 1 - INSET;
  const [x0, x1, y0, y1, z0, z1] = [cx + a, cx + b, cy + a, cy + b, cz + a, cz + b];
  return {
    top: [pt(x0, y0, z1), pt(x1, y0, z1), pt(x1, y1, z1), pt(x0, y1, z1)].join(" "),
    right: [pt(x1, y0, z0), pt(x1, y1, z0), pt(x1, y1, z1), pt(x1, y0, z1)].join(" "),
    left: [pt(x0, y1, z0), pt(x1, y1, z0), pt(x1, y1, z1), pt(x0, y1, z1)].join(" "),
  };
}

// Painter's order for an isometric view from (+x, +y, +z): far cubes first.
const ORDERED = [...CUBES].sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]));

export function HeroCrystal({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`hero-crystal relative isolate aspect-square w-full ${className ?? ""}`}>
      {/* Soft radial glow behind the object */}
      <div
        className="absolute inset-[6%] -z-1 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgb(21 101 240 / 0.28), rgb(91 155 255 / 0.14) 45%, transparent 72%)",
          animation: "glow-breathe 8s var(--ease-in-out) infinite",
        }}
      />

      {/* Orbit rings: tilted planes, each ring turning slowly inside its plane */}
      <div className="absolute inset-0 [perspective:1100px]">
        <OrbitRing size="96%" tilt="rotateX(74deg) rotateZ(-16deg)" duration="26s" />
        <OrbitRing size="78%" tilt="rotateX(68deg) rotateY(14deg) rotateZ(24deg)" duration="34s" reverse dim />
      </div>

      {/* The crystal */}
      <div
        className="absolute inset-[14%] grid place-items-center"
        style={{ animation: "crystal-float 7s var(--ease-in-out) infinite" }}
      >
        <svg viewBox="-170 -270 340 440" className="h-full w-auto overflow-visible drop-shadow-[0_30px_40px_rgb(21_101_240/0.25)]">
          <defs>
            <linearGradient id="crystal-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="1" stopColor="#bcd4ff" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="crystal-left" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7eabff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#2f72f3" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="crystal-right" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3a7cf6" stopOpacity="0.72" />
              <stop offset="1" stopColor="#0d47c2" stopOpacity="0.62" />
            </linearGradient>
          </defs>
          {ORDERED.map((cube) => {
            const f = faces(cube);
            return (
              <g key={cube.join("-")} stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.25" strokeLinejoin="round">
                <polygon points={f.left} fill="url(#crystal-left)" />
                <polygon points={f.right} fill="url(#crystal-right)" />
                <polygon points={f.top} fill="url(#crystal-top)" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Small glints floating around the object */}
      <span className="absolute top-[18%] left-[16%] size-2 rounded-full bg-white shadow-[0_0_16px_4px_rgb(91_155_255/0.6)] animate-float" />
      <span
        className="absolute right-[14%] bottom-[24%] size-1.5 rounded-full bg-white shadow-[0_0_14px_3px_rgb(21_101_240/0.5)] animate-float"
        style={{ animationDelay: "-3s" }}
      />
    </div>
  );
}

function OrbitRing({
  size,
  tilt,
  duration,
  reverse,
  dim,
}: {
  size: string;
  tilt: string;
  duration: string;
  reverse?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{ width: size, height: size, transform: `translate(-50%, -50%) ${tilt}` }}
    >
      <div
        className="relative size-full rounded-full"
        style={{
          border: `1.5px solid rgb(21 101 240 / ${dim ? 0.18 : 0.3})`,
          boxShadow: `0 0 28px rgb(91 155 255 / ${dim ? 0.18 : 0.32}), inset 0 0 28px rgb(91 155 255 / ${dim ? 0.12 : 0.22})`,
          animation: `orbit-spin ${duration} linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        <span className="absolute top-0 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_5px_rgb(21_101_240/0.55)]" />
      </div>
    </div>
  );
}
