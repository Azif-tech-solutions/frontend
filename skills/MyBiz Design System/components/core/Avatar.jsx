import React from 'react';

const SIZES = { xs: 20, sm: 24, md: 32, lg: 40, xl: 64 };
const RING = ['--burgundy-700', '--accent-teal', '--accent-blue', '--accent-violet', '--accent-amber', '--accent-green'];

export function Avatar({ name = '', src, size = 'md', square, style }) {
  const px = SIZES[size] || SIZES.md;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
  const hue = RING[(name.charCodeAt(0) || 0) % RING.length];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: px, height: px,
      borderRadius: square ? 'var(--radius-md)' : 'var(--radius-full)', overflow: 'hidden', flex: '0 0 auto',
      background: src ? 'var(--n-100)' : `var(${hue})`, color: '#fff',
      font: `var(--fw-bold) ${Math.max(10, Math.round(px * 0.4))}px/1 var(--font-ui)`, ...style }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}
