/**
 * Grid-view record table: field-typed headers, row numbers, hover select, add-record row.
 */
export interface DataColumn {
  key: string;
  label: string;
  /** Lucide icon standing in for the field type. */
  icon?: string;
  width?: number;
}
export interface DataTableProps {
  columns?: DataColumn[];
  /** Plain objects keyed by column key; values may be nodes (Tag, Avatar). */
  rows?: Record<string, React.ReactNode>[];
  selectable?: boolean;
  showRowNumbers?: boolean;
  /** Shows the trailing "Add record" row when provided. */
  onAddRow?: () => void;
  style?: React.CSSProperties;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
