/** User or workspace identity chip. Falls back to coloured initials. */
export interface AvatarProps {
  /** Used for initials and for the deterministic colour. */
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Rounded square — use for workspaces/bases, circles for people. */
  square?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
