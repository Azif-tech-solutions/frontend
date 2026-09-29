/**
 * In-page announcement or upsell block, dismissible.
 */
export interface BannerProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  tone?: 'brand' | 'info' | 'success' | 'warning' | 'danger';
  /** Lucide icon name shown at the left. */
  icon?: string;
  /** Action row — usually a Button plus a text link. */
  actions?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Banner(props: BannerProps): JSX.Element;
