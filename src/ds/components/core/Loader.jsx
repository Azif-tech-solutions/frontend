/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */

// Keyframes can't live in inline styles, so they're injected via <style>.
// Users who prefer reduced motion get a slower spin instead of none,
// so the loader still reads as "working".
const CSS = `
@keyframes biz-spin { to { transform: rotate(360deg); } }
@keyframes biz-fade-in { from { opacity: 0; } to { opacity: 1; } }
.biz-spinner { animation: biz-spin 0.8s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .biz-spinner { animation-duration: 2.4s; }
}
`

/* ------------------------------------------------------------------ */
/* Spinner: the bare animated ring                                     */
/* ------------------------------------------------------------------ */

/**
 * A ring with one coloured arc that spins. Use it on its own (inside a button,
 * next to a label) or via <Loader /> for a full-screen overlay.
 *
 * size      diameter in px
 * thickness stroke width in px
 * color     any CSS colour; defaults to the link colour from your design tokens
 */
export function Spinner({ size = 24, thickness = 3, color = 'var(--text-link, #2563eb)' }) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <>
      <style>{CSS}</style>
      <svg
        className="biz-spinner"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* faint full ring (the track) */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth={thickness}
          style={{ color: 'var(--border, rgba(128,128,128,0.25))' }}
        />
        {/* the moving arc: a quarter of the ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.25} ${circumference}`}
        />
      </svg>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Loader: spinner + optional label, inline or as a covering overlay   */
/* ------------------------------------------------------------------ */

/**
 * overlay=false  renders inline, centred in whatever container it's placed in.
 * overlay=true   covers the whole screen and blocks clicks while it shows.
 * label          short text under the spinner, e.g. "Signing in…"
 */
export default function Loader({ label, overlay = false, size = 40 }) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
    >
      <Spinner size={size} />
      {label ? (
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{label}</div>
      ) : (
        // Screen readers still get a message when there's no visible label.
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Loading
        </span>
      )}
    </div>
  )

  if (!overlay) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>{content}</div>
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--overlay, rgba(15, 23, 42, 0.35))',
        animation: 'biz-fade-in 0.15s ease-out',
      }}
    >
      <div
        style={{
          background: 'var(--surface, #fff)', borderRadius: 12,
          padding: '28px 36px', boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
        }}
      >
        {content}
      </div>
    </div>
  )
}