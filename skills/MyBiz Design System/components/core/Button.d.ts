/**
 * Primary action control for MyBiz surfaces.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = burgundy fill; secondary = white + hairline; ghost = chromeless; inverse = ink fill for marketing CTAs. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse';
  /** sm/md are app density (28/32px); lg (44px) is marketing + auth. */
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  iconRight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
