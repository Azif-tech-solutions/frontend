/** Boolean control; 16px box, 3px radius, burgundy when on. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  /** Mixed state — used in table header select-all. */
  indeterminate?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
