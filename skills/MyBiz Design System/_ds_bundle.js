/* @ds-bundle: {"format":4,"namespace":"MyBizDesignSystem_c77ec7","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"FilterChip","sourcePath":"components/data/FilterChip.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"SidebarItem","sourcePath":"components/navigation/SidebarItem.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"74aa65fb7c8d","components/core/Badge.jsx":"a3f4636215fd","components/core/Button.jsx":"ebd4fe0b9c22","components/core/Card.jsx":"2dc6f7849de8","components/core/Icon.jsx":"af87974893bc","components/core/IconButton.jsx":"3e6456d66f0b","components/core/Tag.jsx":"7818774c6562","components/data/DataTable.jsx":"fd4eb797d22f","components/data/FilterChip.jsx":"614691f96618","components/feedback/Banner.jsx":"73f4c3276849","components/feedback/Dialog.jsx":"74b19f7d6098","components/feedback/Toast.jsx":"35371c9d8a0e","components/feedback/Tooltip.jsx":"53542cd6855f","components/forms/Checkbox.jsx":"ddfa7b31e212","components/forms/Input.jsx":"b4c4f4c6ff01","components/forms/Radio.jsx":"ea2a9dcbc17e","components/forms/Select.jsx":"db059db41c30","components/forms/Switch.jsx":"1d3587c1cf5b","components/navigation/SidebarItem.jsx":"2e25ec87a695","components/navigation/Tabs.jsx":"1132902e1ed0","ui_kits/mybiz-app/AuthScreen.jsx":"8f9ea9d3cbdb","ui_kits/mybiz-app/GridScreen.jsx":"d7b8b8de2354","ui_kits/mybiz-app/HomeScreen.jsx":"4bed8c15e6ad","ui_kits/mybiz-app/Sidebar.jsx":"4535dcc570f0","ui_kits/mybiz-app/TopBar.jsx":"a41447194f72","ui_kits/mybiz-web/FeatureSection.jsx":"9e058380b656","ui_kits/mybiz-web/Hero.jsx":"6ba60b764529","ui_kits/mybiz-web/PricingSection.jsx":"ad277352bce7","ui_kits/mybiz-web/SiteFooter.jsx":"d8f06e5d094c","ui_kits/mybiz-web/SiteHeader.jsx":"f2eccdfb9503"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MyBizDesignSystem_c77ec7 = window.MyBizDesignSystem_c77ec7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64
};
const RING = ['--burgundy-700', '--accent-teal', '--accent-blue', '--accent-violet', '--accent-amber', '--accent-green'];
function Avatar({
  name = '',
  src,
  size = 'md',
  square,
  style
}) {
  const px = SIZES[size] || SIZES.md;
  const initials = name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
  const hue = RING[(name.charCodeAt(0) || 0) % RING.length];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: px,
      height: px,
      borderRadius: square ? 'var(--radius-md)' : 'var(--radius-full)',
      overflow: 'hidden',
      flex: '0 0 auto',
      background: src ? 'var(--n-100)' : `var(${hue})`,
      color: '#fff',
      font: `var(--fw-bold) ${Math.max(10, Math.round(px * 0.4))}px/1 var(--font-ui)`,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--n-100)',
    fg: 'var(--n-700)'
  },
  brand: {
    bg: 'var(--brand-subtle)',
    fg: 'var(--burgundy-700)'
  },
  success: {
    bg: 'var(--success-bg)',
    fg: 'var(--accent-green-fg)'
  },
  warning: {
    bg: 'var(--warning-bg)',
    fg: 'var(--accent-amber-fg)'
  },
  danger: {
    bg: 'var(--danger-bg)',
    fg: '#8A1C21'
  },
  info: {
    bg: 'var(--info-bg)',
    fg: 'var(--accent-blue-fg)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  solid,
  uppercase,
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 20,
      padding: '0 8px',
      borderRadius: 'var(--radius-sm)',
      background: solid ? t.fg : t.bg,
      color: solid ? '#fff' : t.fg,
      font: uppercase ? 'var(--type-eyebrow)' : 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)',
      letterSpacing: uppercase ? 'var(--ls-widest)' : 'var(--ls-normal)',
      textTransform: uppercase ? 'uppercase' : 'none',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect,
  useRef
} = React;
/** Lucide glyph wrapper. Requires the Lucide UMD script on the page. */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      nodes: [i],
      attrs: {
        width: size,
        height: size,
        'stroke-width': strokeWidth,
        stroke: color
      }
    });
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: '0 0 auto',
      color,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    height: 28,
    padding: '0 10px',
    font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)',
    gap: 6,
    icon: 14
  },
  md: {
    height: 32,
    padding: '0 14px',
    font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-ui)',
    gap: 6,
    icon: 16
  },
  lg: {
    height: 44,
    padding: '0 22px',
    font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)',
    gap: 8,
    icon: 18
  }
};
function variantStyle(variant, hover) {
  switch (variant) {
    case 'secondary':
      return {
        background: hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        color: 'var(--text-strong)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xs)'
      };
    case 'ghost':
      return {
        background: hover ? 'var(--surface-hover)' : 'transparent',
        color: 'var(--text-body)',
        border: '1px solid transparent'
      };
    case 'danger':
      return {
        background: hover ? 'var(--danger-hover)' : 'var(--danger)',
        color: '#fff',
        border: '1px solid transparent'
      };
    case 'inverse':
      return {
        background: hover ? 'var(--n-800)' : 'var(--n-900)',
        color: '#fff',
        border: '1px solid transparent'
      };
    default:
      return {
        background: hover ? 'var(--brand-hover)' : 'var(--brand)',
        color: 'var(--brand-on)',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-xs)'
      };
  }
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled,
  fullWidth,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      font: s.font,
      letterSpacing: 'var(--ls-tight)',
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transform: down && !disabled ? 'scale(var(--press-scale))' : 'none',
      transition: 'var(--transition-control), transform var(--dur-instant) var(--ease-standard)',
      whiteSpace: 'nowrap',
      ...variantStyle(variant, hover && !disabled),
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
const {
  useState
} = React;
function Card({
  title,
  description,
  icon,
  iconColor = 'var(--brand)',
  children,
  interactive,
  onClick,
  padding = 20,
  style
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-card)',
      padding,
      boxShadow: interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      borderColor: interactive && hover ? 'var(--border-strong)' : 'var(--border-default)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12,
      color: iconColor
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: iconColor
  })), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h4)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)',
      marginBottom: description ? 6 : 0
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, description), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const BOX = {
  sm: 24,
  md: 28,
  lg: 32
};
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  active,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const box = BOX[size] || BOX.md;
  const onShell = variant === 'onShell';
  const bg = active ? 'var(--surface-active)' : hover ? onShell ? 'var(--surface-shell-hover)' : 'var(--surface-hover)' : 'transparent';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: box,
      height: box,
      border: variant === 'outline' ? '1px solid var(--border-default)' : '1px solid transparent',
      borderRadius: 'var(--radius-control)',
      background: onShell && active ? 'var(--surface-shell-hover)' : bg,
      color: onShell ? 'rgba(255,255,255,.86)' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 14 : 16
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
const COLORS = ['amber', 'teal', 'blue', 'violet', 'green', 'rose'];
function Tag({
  children,
  color = 'blue',
  onRemove,
  style
}) {
  const c = COLORS.includes(color) ? color : 'blue';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 20,
      padding: onRemove ? '0 4px 0 8px' : '0 8px',
      borderRadius: 'var(--radius-full)',
      background: `var(--accent-${c}-bg)`,
      color: `var(--accent-${c}-fg)`,
      font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)',
      whiteSpace: 'nowrap',
      maxWidth: 200,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, children), onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      display: 'inline-flex',
      cursor: 'pointer',
      opacity: .6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 11
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/FilterChip.jsx
try { (() => {
const {
  useState
} = React;
function FilterChip({
  field,
  operator,
  value,
  active,
  onClick,
  style
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: '0 8px 0 10px',
      background: hover ? 'var(--surface-hover)' : 'var(--surface-card)',
      border: `1px solid ${active ? 'var(--brand-border)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-control)',
      font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, field), operator && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-subtle)'
    }
  }, operator), value, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14,
    color: "var(--text-subtle)"
  }));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
const TONES = {
  brand: {
    bg: 'var(--brand-subtle)',
    border: 'var(--brand-border)',
    icon: 'var(--brand)'
  },
  info: {
    bg: 'var(--info-bg)',
    border: '#C3D6F6',
    icon: 'var(--info)'
  },
  success: {
    bg: 'var(--success-bg)',
    border: '#BEE3CC',
    icon: 'var(--success)'
  },
  warning: {
    bg: 'var(--warning-bg)',
    border: '#F2DDB0',
    icon: 'var(--warning)'
  },
  danger: {
    bg: 'var(--danger-bg)',
    border: '#F2C9C9',
    icon: 'var(--danger)'
  }
};
function Banner({
  title,
  children,
  tone = 'brand',
  icon,
  actions,
  onDismiss,
  style
}) {
  const t = TONES[tone] || TONES.brand;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 18px',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-panel)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: t.icon
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fw-bold) var(--text-lg)/1.3 var(--font-ui)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      marginTop: 5
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 14
    }
  }, actions)), onDismiss && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dismiss",
    onClick: onDismiss
  }));
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  children,
  footer,
  width = 480,
  onClose,
  style
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface-overlay)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 50
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '92%',
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-panel)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '20px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  })), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 0'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: 20,
      marginTop: 4
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const ICONS = {
  success: 'check-circle',
  danger: 'alert-circle',
  info: 'info',
  neutral: 'info'
};
function Toast({
  children,
  tone = 'neutral',
  action,
  onDismiss,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 10px 10px 14px',
      background: 'var(--surface-inverse)',
      color: '#fff',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      font: 'var(--type-ui)',
      maxWidth: 420,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ICONS[tone],
    size: 16,
    color: tone === 'success' ? '#7FD3A0' : tone === 'danger' ? '#F09B9B' : 'rgba(255,255,255,.7)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), action, onDismiss && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dismiss",
    size: "sm",
    onClick: onDismiss,
    style: {
      color: 'rgba(255,255,255,.7)'
    }
  }));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  label,
  shortcut,
  placement = 'top',
  children,
  style
}) {
  const [show, setShow] = useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 6px)'
  } : {
    bottom: 'calc(100% + 6px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 8px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--n-900)',
      color: '#fff',
      font: 'var(--fw-medium) var(--text-xs)/1.2 var(--font-ui)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-md)',
      zIndex: 40,
      pointerEvents: 'none'
    }
  }, label, shortcut && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 11,
      opacity: .6
    }
  }, shortcut)));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  indeterminate,
  onChange,
  disabled,
  style
}) {
  const on = checked || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      borderRadius: 'var(--radius-xs)',
      background: on ? 'var(--brand)' : 'var(--surface-card)',
      border: `1px solid ${on ? 'var(--brand)' : 'var(--border-strong)'}`,
      color: '#fff',
      transition: 'var(--transition-control)',
      flex: '0 0 auto'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: indeterminate ? 'minus' : 'check',
    size: 11,
    strokeWidth: 3,
    color: "#fff"
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
const {
  useState
} = React;
function DataTable({
  columns = [],
  rows = [],
  selectable = true,
  showRowNumbers = true,
  onAddRow,
  style
}) {
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);
  const toggle = i => setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
  const cellBase = {
    display: 'flex',
    alignItems: 'center',
    height: 'var(--row-h)',
    padding: '0 8px',
    borderRight: '1px solid var(--border-subtle)',
    font: 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)',
    color: 'var(--text-body)',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  };
  const gutter = showRowNumbers || selectable ? 68 : 0;
  const template = `${gutter ? gutter + 'px ' : ''}${columns.map(c => (c.width || 160) + 'px').join(' ')}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: template,
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-default)'
    }
  }, gutter > 0 && /*#__PURE__*/React.createElement("div", {
    key: "__gutter",
    style: {
      ...cellBase,
      gap: 8,
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: selected.length === rows.length && rows.length > 0,
    indeterminate: selected.length > 0 && selected.length < rows.length,
    onChange: v => setSelected(v ? rows.map((_, i) => i) : [])
  })), columns.map((c, ci) => /*#__PURE__*/React.createElement("div", {
    key: c.key ?? ci,
    style: {
      ...cellBase,
      gap: 6,
      font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-ui)',
      color: 'var(--text-muted)'
    }
  }, c.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: c.icon,
    size: 13,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, c.label)))), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(null),
    style: {
      display: 'grid',
      gridTemplateColumns: template,
      borderBottom: '1px solid var(--border-subtle)',
      background: selected.includes(i) ? 'var(--brand-subtle)' : hover === i ? 'var(--surface-hover)' : 'transparent',
      transition: 'background-color var(--dur-instant) var(--ease-standard)'
    }
  }, gutter > 0 && /*#__PURE__*/React.createElement("div", {
    key: "__gutter",
    style: {
      ...cellBase,
      gap: 8,
      color: 'var(--text-subtle)',
      font: 'var(--type-mono)'
    }
  }, (hover === i || selected.includes(i)) && selectable ? /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
    checked: selected.includes(i),
    onChange: () => toggle(i)
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      textAlign: 'center'
    }
  }, showRowNumbers ? i + 1 : ''), hover === i && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "maximize-2",
    size: 12,
    color: "var(--text-subtle)"
  })), columns.map((c, ci) => /*#__PURE__*/React.createElement("div", {
    key: c.key ?? ci,
    style: {
      ...cellBase,
      fontWeight: ci === 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)',
      color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r[c.key]))))), onAddRow && /*#__PURE__*/React.createElement("div", {
    onClick: onAddRow,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      height: 'var(--row-h)',
      padding: '0 8px',
      color: 'var(--text-subtle)',
      font: 'var(--type-ui)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 14
  }), " Add record"));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
function Input({
  label,
  hint,
  error,
  iconLeft,
  suffix,
  size = 'md',
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const h = size === 'lg' ? 'var(--field-h-lg)' : 'var(--field-h)';
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-strong)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: size === 'lg' ? '0 14px' : '0 10px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-control)',
      boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 16,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: size === 'lg' ? 'var(--type-body)' : 'var(--fw-regular) var(--text-sm)/1.3 var(--font-ui)',
      color: 'var(--text-strong)'
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-subtle)'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--text-danger)' : 'var(--text-muted)',
      marginTop: 5
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  description,
  checked,
  onChange,
  name,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 9,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(true),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      marginTop: description ? 2 : 0,
      borderRadius: 'var(--radius-full)',
      background: 'var(--surface-card)',
      border: `${checked ? 5 : 1}px solid ${checked ? 'var(--brand)' : 'var(--border-strong)'}`,
      transition: 'var(--transition-control)',
      flex: '0 0 auto'
    },
    "data-name": name
  }), /*#__PURE__*/React.createElement("span", null, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-ui)',
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState
} = React;
function Select({
  label,
  options = [],
  value,
  onChange,
  size = 'md',
  disabled,
  placeholder = 'Select…',
  style
}) {
  const [focus, setFocus] = useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-strong)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: size === 'lg' ? 'var(--field-h-lg)' : 'var(--field-h)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-control)',
      boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-xs)',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      width: '100%',
      height: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: '0 30px 0 10px',
      font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
      color: 'var(--text-strong)',
      cursor: 'pointer'
    }
  }, !value && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 9,
      pointerEvents: 'none',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 15,
    color: "var(--text-muted)"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 32,
      height: 18,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--brand)' : 'var(--n-300)',
      transition: 'background-color var(--dur-normal) var(--ease-standard)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 16 : 2,
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-full)',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-normal) var(--ease-emphasis)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarItem.jsx
try { (() => {
const {
  useState
} = React;
function SidebarItem({
  icon,
  label,
  active,
  level = 0,
  trailing,
  onClick,
  onShell,
  style
}) {
  const [hover, setHover] = useState(false);
  const bg = onShell ? active ? 'rgba(255,255,255,.14)' : hover ? 'var(--surface-shell-hover)' : 'transparent' : active ? 'var(--surface-active)' : hover ? 'var(--surface-hover)' : 'transparent';
  const fg = onShell ? active ? '#fff' : 'rgba(255,255,255,.78)' : active ? 'var(--text-strong)' : 'var(--text-body)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: level > 0 ? 30 : 36,
      padding: `0 8px 0 ${8 + level * 20}px`,
      borderRadius: 'var(--radius-md)',
      background: bg,
      color: fg,
      font: level > 0 ? 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)' : 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)',
      letterSpacing: 'var(--ls-tight)',
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label), trailing);
}
Object.assign(__ds_scope, { SidebarItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const {
  useState
} = React;
function Tabs({
  tabs = [],
  value,
  onChange,
  style
}) {
  const [hover, setHover] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 2,
      borderBottom: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map(t => {
    const id = t.value ?? t;
    const on = id === value;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      onClick: () => onChange && onChange(id),
      onMouseEnter: () => setHover(id),
      onMouseLeave: () => setHover(null),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: 34,
        padding: '0 12px',
        borderBottom: `2px solid ${on ? 'var(--brand)' : 'transparent'}`,
        color: on ? 'var(--text-strong)' : hover === id ? 'var(--text-body)' : 'var(--text-muted)',
        font: `${on ? 'var(--fw-bold)' : 'var(--fw-medium)'} var(--text-sm)/1 var(--font-ui)`,
        cursor: 'pointer',
        marginBottom: -1,
        transition: 'var(--transition-control)'
      }
    }, t.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 15
    }), t.label ?? t, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-subtle)'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-app/AuthScreen.jsx
try { (() => {
function AuthScreen({
  onContinue
}) {
  const {
    Button,
    Input,
    Icon
  } = window.MyBizDesignSystem_c77ec7;
  const [email, setEmail] = React.useState('alex@northwind.com');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 96,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 408
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark.svg",
    width: "34",
    height: "34",
    alt: ""
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      fontSize: 'var(--text-4xl)',
      letterSpacing: 'var(--ls-tighter)',
      color: 'var(--text-strong)',
      margin: '28px 0 34px'
    }
  }, "Welcome to MyBiz"), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    size: "lg",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    style: {
      marginTop: 18
    },
    onClick: onContinue
  }, "Continue with email"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      margin: '18px 0'
    }
  }, "or"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    variant: "secondary",
    onClick: onContinue
  }, "Continue with ", /*#__PURE__*/React.createElement("b", null, "Single Sign On")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    variant: "secondary",
    iconLeft: "chrome",
    onClick: onContinue
  }, "Continue with ", /*#__PURE__*/React.createElement("b", null, "Google")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    fullWidth: true,
    variant: "secondary",
    iconLeft: "apple",
    onClick: onContinue
  }, "Continue with ", /*#__PURE__*/React.createElement("b", null, "Apple"))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: 40,
      lineHeight: 1.9
    }
  }, "By creating an account you agree to the ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms of Service"), " and ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy Policy"), ".", /*#__PURE__*/React.createElement("br", null), "Manage your cookie preferences ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "here"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-muted)',
      marginTop: 26
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onContinue();
    }
  }, "Sign in"))));
}
Object.assign(window, {
  AuthScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-app/AuthScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-app/GridScreen.jsx
try { (() => {
const GRID_COLS = [{
  key: 'name',
  label: 'Account name',
  icon: 'type',
  width: 190
}, {
  key: 'tier',
  label: 'Tier',
  icon: 'circle-dot',
  width: 96
}, {
  key: 'arr',
  label: 'Estimated ARR',
  icon: 'hash',
  width: 132
}, {
  key: 'stage',
  label: 'Funding stage',
  icon: 'circle-dot',
  width: 132
}, {
  key: 'emp',
  label: 'Employees',
  icon: 'hash',
  width: 108
}, {
  key: 'owner',
  label: 'Account executive',
  icon: 'user',
  width: 168
}, {
  key: 'last',
  label: 'Last interaction',
  icon: 'calendar',
  width: 136
}];

// Plain data — JSX is built at render time so the bundle's namespace is populated.
const GRID_DATA = [['Northwind Labs', ['amber', 'Tier 2'], '$4–4.5B', ['violet', 'IPO'], '7,500', 'Dana Reed', '05/15/2024'], ['Ardent Systems', ['rose', 'Tier 1'], '$600–700M', ['teal', 'Series F'], '2,500', 'Priya Nair', '02/20/2024'], ['Halcyon Data', ['rose', 'Tier 1'], '$100–300M', ['blue', 'Series D'], '800', 'Sam Ortiz', '03/30/2024'], ['Cobalt Studio', ['green', 'Tier 3'], '$3–4B', ['teal', 'Series F'], '5,000', 'Dana Reed', '07/04/2024'], ['Meridian Cloud', ['rose', 'Tier 1'], '$3–4B', ['amber', 'Series J'], '8,000', 'Lee Chan', '08/19/2024'], ['Verity Analytics', ['rose', 'Tier 1'], '$500–560M', ['green', 'Series C'], '2,500', 'Priya Nair', '01/25/2024'], ['Kestrel Health', ['green', 'Tier 3'], '$1–1.25B', ['violet', 'IPO'], '3,400', 'Sam Ortiz', '06/11/2024'], ['Junipero Works', ['green', 'Tier 3'], '$250–300M', ['teal', 'Series E'], '900', 'Lee Chan', '09/09/2024']];
function GridScreen({
  onToast
}) {
  const {
    SidebarItem,
    Tabs,
    DataTable,
    FilterChip,
    Tag,
    Button,
    IconButton,
    Icon,
    Avatar,
    Badge
  } = window.MyBizDesignSystem_c77ec7;
  const [view, setView] = React.useState('grid');
  const rows = GRID_DATA.map(([name, tier, arr, stage, emp, ae, last]) => ({
    name,
    tier: /*#__PURE__*/React.createElement(Tag, {
      color: tier[0]
    }, tier[1]),
    arr,
    stage: /*#__PURE__*/React.createElement(Tag, {
      color: stage[0]
    }, stage[1]),
    emp,
    owner: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: ae,
      size: "xs"
    }), ae),
    last
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 236,
      flex: '0 0 auto',
      background: 'var(--surface-page)',
      borderRight: '1px solid var(--border-default)',
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '4px 6px 14px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Pipeline Radar",
    square: true,
    size: "md"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-bold) var(--text-md)/1.2 var(--font-ui)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)'
    }
  }, "Pipeline Radar"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 15,
    color: "var(--text-muted)"
  })), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "briefcase",
    label: "Accounts HQ"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Top targets",
    level: 1,
    active: true
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Dashboard",
    level: 1
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "All accounts",
    level: 1
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Account calendar",
    level: 1
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "handshake",
    label: "Opportunities"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "target",
    label: "Initiatives"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "calendar-days",
    label: "Interactions",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "3")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "plus",
    label: "Add a table"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 16px',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: view,
    onChange: setView,
    style: {
      border: 'none',
      flex: 1
    },
    tabs: [{
      value: 'grid',
      label: 'Grid',
      icon: 'table-2'
    }, {
      value: 'cal',
      label: 'Calendar',
      icon: 'calendar'
    }, {
      value: 'kan',
      label: 'Kanban',
      icon: 'columns-3'
    }, {
      value: 'form',
      label: 'Form',
      icon: 'clipboard-list'
    }]
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    iconLeft: "share-2",
    onClick: () => onToast('Share dialog opened')
  }, "Share"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    iconLeft: "sparkles",
    onClick: () => onToast('Ask MyBiz is thinking…')
  }, "Ask MyBiz")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 16px',
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-default)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(FilterChip, {
    field: "Tier"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    field: "Account executive"
  }), /*#__PURE__*/React.createElement(FilterChip, {
    field: "Risk level",
    operator: "is",
    value: /*#__PURE__*/React.createElement(Tag, {
      color: "rose"
    }, "High"),
    active: true
  }), /*#__PURE__*/React.createElement(FilterChip, {
    field: "Recently funded",
    operator: "is",
    value: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: "var(--success)"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-up-down",
    label: "Sort",
    variant: "outline"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "eye-off",
    label: "Hide fields",
    variant: "outline"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "rows-3",
    label: "Row height",
    variant: "outline"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflow: 'auto',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      marginBottom: 12
    }
  }, "High growth targets"), /*#__PURE__*/React.createElement(DataTable, {
    columns: GRID_COLS,
    rows: rows,
    onAddRow: () => onToast('Record added to Top targets')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-subtle)',
      marginTop: 10
    }
  }, "8 of 412 records \xB7 showing an abbreviated set"))));
}
Object.assign(window, {
  GridScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-app/GridScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-app/HomeScreen.jsx
try { (() => {
const HOME_RECENTS = [{
  name: 'Pipeline Radar',
  ws: 'Revenue Ops',
  when: 'Opened 2h ago',
  color: 'var(--burgundy-700)'
}, {
  name: 'Marketing Calendar',
  ws: 'Growth',
  when: 'Opened yesterday',
  color: 'var(--accent-teal)'
}, {
  name: 'Hiring Tracker',
  ws: 'People',
  when: 'Opened Jul 24',
  color: 'var(--accent-violet)'
}, {
  name: 'Vendor Contracts',
  ws: 'Finance',
  when: 'Opened Jul 21',
  color: 'var(--accent-amber)'
}];
function HomeScreen({
  onOpenBase,
  onToast
}) {
  const {
    Banner,
    Card,
    Button,
    Badge,
    Avatar,
    Icon
  } = window.MyBizDesignSystem_c77ec7;
  const [banner, setBanner] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 32px 48px',
      maxWidth: 1180
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h1)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: '0 0 20px'
    }
  }, "Home"), banner && /*#__PURE__*/React.createElement(Banner, {
    tone: "brand",
    icon: "sparkles",
    onDismiss: () => setBanner(false),
    style: {
      marginBottom: 20
    },
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Upgrade to the Team plan before your trial expires in ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--brand)'
      }
    }, "13 days")),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      size: "md",
      iconLeft: "zap",
      onClick: () => onToast('Plan comparison opened')
    }, "Upgrade"), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onToast('Comparing plans');
      },
      style: {
        font: 'var(--type-ui)'
      }
    }, "Compare plans"))
  }, "Keep the automations, interfaces and permissions your team already relies on."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14,
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    icon: "sparkles",
    iconColor: "var(--brand)",
    title: "Start with AI",
    description: "Describe a workflow and MyBiz builds the base.",
    onClick: () => onToast('AI builder coming up')
  }), /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    icon: "table-2",
    iconColor: "var(--accent-teal)",
    title: "Start with templates",
    description: "Pick a proven base and adapt it as you go.",
    onClick: () => onToast('Template gallery opened')
  }), /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    icon: "upload",
    iconColor: "var(--accent-blue)",
    title: "Quickly upload",
    description: "Migrate spreadsheets in a few minutes.",
    onClick: () => onToast('Import started')
  }), /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    icon: "layout-grid",
    iconColor: "var(--accent-violet)",
    title: "Build on your own",
    description: "Start blank and shape your ideal workflow.",
    onClick: () => onToast('Blank base created')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h4)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)'
    }
  }, "Recently opened"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, HOME_RECENTS.length), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--type-ui)',
      color: 'var(--text-muted)'
    }
  }, "All workspaces ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14
    }
  }, HOME_RECENTS.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    onClick: () => onOpenBase(),
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: 14,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-xs)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-lg)',
      background: r.color,
      color: '#fff',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "table-2",
    size: 19,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--fw-bold) var(--text-md)/1.2 var(--font-ui)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, r.ws, " \xB7 ", r.when))))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-app/Sidebar.jsx
try { (() => {
function Sidebar({
  route,
  onNavigate
}) {
  const {
    SidebarItem,
    Button,
    Icon,
    IconButton,
    Badge
  } = window.MyBizDesignSystem_c77ec7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'var(--sidebar-w)',
      flex: '0 0 auto',
      borderRight: '1px solid var(--border-default)',
      background: 'var(--surface-page)',
      display: 'flex',
      flexDirection: 'column',
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "house",
    label: "Home",
    active: route === 'home',
    onClick: () => onNavigate('home')
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "star",
    label: "Starred",
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15
    })
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "share-2",
    label: "Shared"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "users",
    label: "Workspaces",
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "New workspace",
      size: "sm"
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 15
    }))
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Revenue Ops",
    level: 1,
    trailing: /*#__PURE__*/React.createElement(Badge, null, "4")
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Pipeline Radar",
    level: 1,
    active: route === 'grid',
    onClick: () => onNavigate('grid')
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Marketing Calendar",
    level: 1
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      paddingTop: 12,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "book-open",
    label: "Templates and apps"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "store",
    label: "Marketplace"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "upload",
    label: "Import"
  })), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    iconLeft: "plus",
    style: {
      marginTop: 12
    }
  }, "Create"));
}
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-app/TopBar.jsx
try { (() => {
function TopBar({
  onToggleSidebar
}) {
  const {
    IconButton,
    Avatar,
    Icon,
    Tooltip
  } = window.MyBizDesignSystem_c77ec7;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 'var(--topbar-h)',
      padding: '0 16px',
      borderBottom: '1px solid var(--border-default)',
      background: 'var(--surface-page)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "menu",
    label: "Toggle sidebar",
    onClick: onToggleSidebar
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    width: "118",
    height: "26",
    alt: "MyBiz",
    style: {
      marginLeft: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: 460,
      height: 34,
      padding: '0 12px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-control)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--type-ui)',
      color: 'var(--text-subtle)'
    }
  }, "Search\u2026"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      fontSize: 11,
      color: 'var(--text-subtle)'
    }
  }, "\u2318K"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      font: 'var(--type-ui)',
      color: 'var(--text-muted)',
      paddingRight: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-help",
    size: 15
  }), " Help"), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Notifications"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Notifications"
  })), /*#__PURE__*/React.createElement(Avatar, {
    name: "Alex Smith",
    size: "sm",
    style: {
      marginLeft: 4
    }
  })));
}
Object.assign(window, {
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-app/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-web/FeatureSection.jsx
try { (() => {
const FEATURE_ITEMS = [{
  icon: 'sparkles',
  color: 'var(--burgundy-700)',
  title: 'AI that knows your data',
  body: 'Ask a question in plain language and get an answer grounded in the records your team already maintains.'
}, {
  icon: 'workflow',
  color: 'var(--accent-teal)',
  title: 'Automations without code',
  body: 'Trigger updates, notifications and hand-offs the moment a record changes — no scripting, no glue services.'
}, {
  icon: 'layout-dashboard',
  color: 'var(--accent-blue)',
  title: 'Interfaces for every reader',
  body: 'Publish focused views so each team sees only the fields and records that matter to their work.'
}, {
  icon: 'shield-check',
  color: 'var(--accent-violet)',
  title: 'Governance built in',
  body: 'Field-level permissions, audit history and SSO come standard on Business and Enterprise plans.'
}];
const FEATURE_STATS = [['500k+', 'organizations building on MyBiz'], ['80%', 'of the Fortune 100 have a MyBiz workspace'], ['12m', 'average time to first working app']];
function FeatureSection() {
  const {
    Card,
    Icon,
    Badge
  } = window.MyBizDesignSystem_c77ec7;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--section-y) 40px',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 40,
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--ls-widest)',
      textTransform: 'uppercase',
      color: 'var(--burgundy-700)',
      marginBottom: 16
    }
  }, "Why MyBiz"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      fontSize: 'var(--text-4xl)',
      letterSpacing: 'var(--ls-tighter)',
      color: 'var(--text-strong)',
      margin: 0,
      maxWidth: 620
    }
  }, "The workspace your operations already wanted to be")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      maxWidth: 400,
      margin: 0
    }
  }, "Start from the data you have. Layer on the views, automations and AI your teams need \u2014 in the same place, with the same permissions.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, FEATURE_ITEMS.map(x => /*#__PURE__*/React.createElement(Card, {
    key: x.title,
    icon: x.icon,
    iconColor: x.color,
    title: x.title,
    description: x.body,
    padding: 24
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '72px 40px',
      background: 'var(--surface-shell)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 40
    }
  }, FEATURE_STATS.map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-display)',
      fontSize: 'var(--text-5xl)',
      lineHeight: 1,
      color: '#fff'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'rgba(255,255,255,.66)',
      marginTop: 12
    }
  }, l))))));
}
Object.assign(window, {
  FeatureSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-web/FeatureSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-web/Hero.jsx
try { (() => {
const HERO_COLS = [{
  key: 'name',
  label: 'Account name',
  icon: 'type',
  width: 176
}, {
  key: 'tier',
  label: 'Tier',
  icon: 'circle-dot',
  width: 92
}, {
  key: 'arr',
  label: 'Estimated ARR',
  icon: 'hash',
  width: 126
}, {
  key: 'stage',
  label: 'Funding stage',
  icon: 'circle-dot',
  width: 126
}, {
  key: 'emp',
  label: 'Employees',
  icon: 'hash',
  width: 104
}, {
  key: 'site',
  label: 'Website',
  icon: 'link',
  width: 168
}];

// Plain data — JSX is built at render time so the bundle's namespace is populated.
const HERO_DATA = [['Northwind Labs', ['amber', 'Tier 2'], '$4–4.5B', ['violet', 'IPO'], '7,500', 'northwindlabs.com'], ['Ardent Systems', ['rose', 'Tier 1'], '$600–700M', ['teal', 'Series F'], '2,500', 'ardent.systems'], ['Halcyon Data', ['rose', 'Tier 1'], '$100–300M', ['blue', 'Series D'], '800', 'halcyondata.io'], ['Cobalt Studio', ['green', 'Tier 3'], '$3–4B', ['teal', 'Series F'], '5,000', 'cobalt.studio'], ['Meridian Cloud', ['rose', 'Tier 1'], '$3–4B', ['amber', 'Series J'], '8,000', 'meridiancloud.com']];
function Hero({
  onCta,
  onPrompt
}) {
  const {
    Button,
    Icon,
    Tag,
    DataTable,
    SidebarItem,
    Avatar
  } = window.MyBizDesignSystem_c77ec7;
  const [prompt, setPrompt] = React.useState('Surface top accounts with up-to-date signals.');
  const rows = HERO_DATA.map(([name, tier, arr, stage, emp, site]) => ({
    name,
    arr,
    emp,
    site,
    tier: /*#__PURE__*/React.createElement(Tag, {
      color: tier[0]
    }, tier[1]),
    stage: /*#__PURE__*/React.createElement(Tag, {
      color: stage[0]
    }, stage[1])
  }));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 40px 0',
      background: 'var(--gradient-warm-wash)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--ls-widest)',
      textTransform: 'uppercase',
      color: 'var(--burgundy-700)',
      marginBottom: 20
    }
  }, "The connected workspace"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontSize: 'var(--text-6xl)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "All your teams, all their workflows \u2014", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--burgundy-700)'
    }
  }, "connected in one workspace")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      maxWidth: 640,
      margin: '24px auto 0'
    }
  }, "Build AI-powered workflows that unify your data, keep collaboration in one place, and set your teams up for long-term success. No code required."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onCta
  }, "Get started for free"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onCta
  }, "Book demo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '64px auto 0',
      background: 'var(--burgundy-100)',
      borderRadius: 'var(--radius-3xl) var(--radius-3xl) 0 0',
      padding: '40px 40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 720,
      margin: '0 auto 32px',
      background: 'var(--surface-card)',
      border: '1px solid var(--n-0)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-lg)',
      padding: '18px 18px 18px 22px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: prompt,
    onChange: e => setPrompt(e.target.value),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--fw-regular) var(--text-xl)/1.3 var(--font-ui)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onPrompt(prompt),
    "aria-label": "Build it",
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-full)',
      background: 'var(--brand)',
      border: 'none',
      cursor: 'pointer',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 18,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-panel) var(--radius-panel) 0 0',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      height: 330
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      background: 'var(--surface-page)',
      borderRight: '1px solid var(--border-default)',
      padding: 12,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '4px 6px 14px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Pipeline Radar",
    square: true,
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)',
      color: 'var(--text-strong)'
    }
  }, "Pipeline Radar")), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "briefcase",
    label: "Accounts HQ"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Top targets",
    level: 1,
    active: true
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "Dashboard",
    level: 1
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    label: "All accounts",
    level: 1
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "handshake",
    label: "Opportunities"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "target",
    label: "Initiatives"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: 18,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      marginBottom: 12
    }
  }, "High growth targets"), /*#__PURE__*/React.createElement(DataTable, {
    columns: HERO_COLS,
    rows: rows
  })))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-web/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-web/PricingSection.jsx
try { (() => {
const PRICING_PLANS = [{
  name: 'Free',
  price: '$0',
  per: 'per user / month',
  blurb: 'For individuals mapping out a first workflow.',
  feats: ['Unlimited bases', '1,000 records per base', 'Grid, calendar and form views'],
  cta: 'Start for free',
  variant: 'secondary'
}, {
  name: 'Team',
  price: '$24',
  per: 'per user / month',
  blurb: 'For teams running recurring operations together.',
  feats: ['50,000 records per base', 'Automations and interfaces', 'Standard AI credits', 'Field-level permissions'],
  cta: 'Start free trial',
  variant: 'primary',
  featured: true
}, {
  name: 'Business',
  price: '$54',
  per: 'per user / month',
  blurb: 'For departments that need governance.',
  feats: ['250,000 records per base', 'SSO and SCIM provisioning', 'Admin panel and audit log', 'Priority support'],
  cta: 'Talk to sales',
  variant: 'secondary'
}];
function PricingSection({
  onCta
}) {
  const {
    Button,
    Badge,
    Icon,
    Radio
  } = window.MyBizDesignSystem_c77ec7;
  const [annual, setAnnual] = React.useState(true);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--section-y) 40px',
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      fontSize: 'var(--text-4xl)',
      letterSpacing: 'var(--ls-tighter)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, "Plans that scale with the work"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 26,
      marginTop: 26,
      padding: '10px 18px',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-full)'
    }
  }, /*#__PURE__*/React.createElement(Radio, {
    label: "Billed annually",
    checked: annual,
    onChange: () => setAnnual(true)
  }), /*#__PURE__*/React.createElement(Radio, {
    label: "Billed monthly",
    checked: !annual,
    onChange: () => setAnnual(false)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18,
      marginTop: 40,
      textAlign: 'left'
    }
  }, PRICING_PLANS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: 26,
      background: 'var(--surface-card)',
      border: `1px solid ${p.featured ? 'var(--brand-border)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-panel)',
      boxShadow: p.featured ? 'var(--shadow-lg)' : 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-h4)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)'
    }
  }, p.name), p.featured && /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    uppercase: true
  }, "Most popular")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-display)',
      fontSize: 'var(--text-5xl)',
      lineHeight: 1,
      color: 'var(--text-strong)'
    }
  }, annual ? p.price : '$' + (parseInt(p.price.slice(1), 10) === 0 ? 0 : parseInt(p.price.slice(1), 10) + 6)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, p.per)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      margin: '12px 0 20px'
    }
  }, p.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9,
      flex: 1
    }
  }, p.feats.map(x => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      display: 'flex',
      gap: 8,
      font: 'var(--type-ui)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "var(--brand)"
  }), x))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    variant: p.variant,
    style: {
      marginTop: 24
    },
    onClick: onCta
  }, p.cta))))));
}
Object.assign(window, {
  PricingSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-web/PricingSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-web/SiteFooter.jsx
try { (() => {
const FOOTER_COLS = [['Platform', ['Bases and views', 'Automations', 'Interfaces', 'MyBiz AI', 'Integrations']], ['Solutions', ['Revenue operations', 'Marketing', 'Product', 'Finance', 'People']], ['Resources', ['Templates', 'Guides', 'Community', 'Developer docs', 'Support']], ['Company', ['About', 'Careers', 'Newsroom', 'Security', 'Contact']]];
function SiteFooter({
  onCta
}) {
  const {
    Button,
    Input
  } = window.MyBizDesignSystem_c77ec7;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '84px 40px',
      background: 'var(--gradient-brand)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-display)',
      fontSize: 'var(--text-5xl)',
      lineHeight: 1.1,
      letterSpacing: 'var(--ls-tight)',
      color: '#fff',
      margin: 0
    }
  }, "Put your next workflow in one place"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'rgba(255,255,255,.72)',
      margin: '18px auto 30px',
      maxWidth: 520
    }
  }, "Free to start. No credit card, no implementation project."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onCta
  }, "Get started for free"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    style: {
      color: '#fff',
      border: '1px solid rgba(255,255,255,.32)'
    },
    onClick: onCta
  }, "Book demo")))), /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: '56px 40px 40px',
      background: 'var(--surface-page)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(4,1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    width: "124",
    height: "27",
    alt: "MyBiz"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      maxWidth: 240,
      marginTop: 14
    }
  }, "Product notes and workflow teardowns, once a month."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14,
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "you@company.com",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Subscribe"))), FOOTER_COLS.map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--ls-widest)',
      textTransform: 'uppercase',
      color: 'var(--text-subtle)',
      marginBottom: 14
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, items.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: 'var(--type-ui)',
      color: 'var(--text-body)',
      cursor: 'pointer'
    }
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '38px auto 0',
      paddingTop: 20,
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 20,
      font: 'var(--type-caption)',
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 MyBiz, Inc."), /*#__PURE__*/React.createElement("span", null, "Terms"), /*#__PURE__*/React.createElement("span", null, "Privacy"), /*#__PURE__*/React.createElement("span", null, "Cookie preferences"))));
}
Object.assign(window, {
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-web/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mybiz-web/SiteHeader.jsx
try { (() => {
const HEADER_NAV = ['Platform', 'Solutions', 'Resources', 'Enterprise', 'Pricing'];
function SiteHeader({
  onCta
}) {
  const {
    Button,
    Icon
  } = window.MyBizDesignSystem_c77ec7;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      height: 72,
      padding: '0 40px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-page)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    width: "134",
    height: "29",
    alt: "MyBiz"
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      flex: 1
    }
  }, HEADER_NAV.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      font: 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)',
      letterSpacing: 'var(--ls-tight)',
      color: 'var(--text-strong)',
      cursor: 'pointer'
    }
  }, n, i < 3 && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    color: "var(--text-subtle)"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: onCta
  }, "Book demo"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "inverse",
    onClick: onCta
  }, "Sign up for free"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)',
      color: 'var(--text-strong)',
      cursor: 'pointer'
    }
  }, "Log in")));
}
Object.assign(window, {
  SiteHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mybiz-web/SiteHeader.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.SidebarItem = __ds_scope.SidebarItem;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
