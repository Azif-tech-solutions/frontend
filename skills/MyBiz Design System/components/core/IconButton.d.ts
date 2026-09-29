/** Square icon-only control for toolbars, row affordances and shell chrome. */
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label — required; also the tooltip. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  /** onShell = light-on-burgundy variant for the app shell / sidebar. */
  variant?: 'ghost' | 'outline' | 'onShell';
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
