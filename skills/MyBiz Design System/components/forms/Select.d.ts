/** Native-backed dropdown styled to match Input. */
export interface SelectOption { value: string; label: string }
export interface SelectProps {
  label?: React.ReactNode;
  /** Accepts objects or plain strings. */
  options?: (SelectOption | string)[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  size?: 'md' | 'lg';
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
