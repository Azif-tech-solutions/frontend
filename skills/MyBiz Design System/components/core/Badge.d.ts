/** Small status marker — plan names, counts, states. Not for record labels (use Tag). */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Filled instead of tinted. */
  solid?: boolean;
  /** Eyebrow treatment: 11px bold, tracked, uppercase. */
  uppercase?: boolean;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
