/**
 * Hairline surface container — action cards, panels, empty states.
 */
export interface CardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Lucide icon name shown above the title. */
  icon?: string;
  iconColor?: string;
  children?: React.ReactNode;
  /** Adds hover lift + pointer. */
  interactive?: boolean;
  onClick?: () => void;
  padding?: number | string;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
