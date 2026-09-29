/** Hover label for icon-only controls; can show a keyboard shortcut. */
export interface TooltipProps {
  label: React.ReactNode;
  /** Mono-set shortcut hint, e.g. "⌘K". */
  shortcut?: string;
  placement?: 'top' | 'bottom';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
