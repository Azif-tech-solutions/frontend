/** Toolbar chip describing one filter condition on a view. */
export interface FilterChipProps {
  /** Field name, e.g. "Risk level". */
  field: React.ReactNode;
  /** Comparator word, set in subtle grey — "is", "is any of". */
  operator?: React.ReactNode;
  /** Chosen value; usually a `Tag` or an Icon. */
  value?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function FilterChip(props: FilterChipProps): JSX.Element;
