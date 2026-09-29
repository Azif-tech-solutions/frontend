/** Pill label for record values — single/multi select cells, filters, categories. */
export interface TagProps {
  children?: React.ReactNode;
  /** One of the six MyBiz record-label colours. */
  color?: 'amber' | 'teal' | 'blue' | 'violet' | 'green' | 'rose';
  /** Renders an x affordance and fires on click. */
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
