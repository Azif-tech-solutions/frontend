/** Immediate-effect toggle (settings, view options). Use Checkbox inside forms that submit. */
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
