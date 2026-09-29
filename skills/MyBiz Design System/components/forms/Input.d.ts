/**
 * Single-line text field with optional label, leading icon and help text.
 */
export interface InputProps {
  label?: React.ReactNode;
  /** Help text below the field. Hidden when `error` is set. */
  hint?: React.ReactNode;
  /** Error message; also turns the border red. */
  error?: React.ReactNode;
  /** Lucide icon name inside the field. */
  iconLeft?: string;
  /** Trailing static text, e.g. a shortcut or unit. */
  suffix?: React.ReactNode;
  /** md = 32px app density, lg = 44px auth/marketing. */
  size?: 'md' | 'lg';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
