import React, { useEffect, useRef } from 'react';

/** Lucide glyph wrapper. Requires the Lucide UMD script on the page. */
export function Icon({ name, size = 16, strokeWidth = 1.75, color = 'currentColor', style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({ nodes: [i], attrs: { width: size, height: size, 'stroke-width': strokeWidth, stroke: color } });
  }, [name, size, strokeWidth, color]);
  return <span ref={ref} aria-hidden="true" style={{ display: 'inline-flex', width: size, height: size, flex: '0 0 auto', color, ...style }} {...rest} />;
}
