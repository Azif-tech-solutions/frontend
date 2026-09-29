/** Transient confirmation on the ink surface; bottom-left of the viewport. */
export interface ToastProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'success' | 'danger' | 'info';
  /** Optional inline undo/view affordance. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
