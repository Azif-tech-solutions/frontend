/** Renders a single Lucide icon glyph inline. */
export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "chevron-right"). */
  name: string;
  /** Pixel box. MyBiz uses 16 in dense UI, 20 in nav, 24 in marketing. */
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
