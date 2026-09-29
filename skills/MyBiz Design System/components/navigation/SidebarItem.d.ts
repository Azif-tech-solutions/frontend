/** One row in the app sidebar; nests via `level`. */
export interface SidebarItemProps {
  /** Lucide icon name — top-level rows always have one, nested rows usually don't. */
  icon?: string;
  label: React.ReactNode;
  active?: boolean;
  /** 0 = section row (36px), 1+ = nested (30px, indented 20px each). */
  level?: number;
  /** Right-aligned node: count, chevron, IconButton. */
  trailing?: React.ReactNode;
  onClick?: () => void;
  /** Light-on-burgundy treatment for the branded shell. */
  onShell?: boolean;
  style?: React.CSSProperties;
}
export declare function SidebarItem(props: SidebarItemProps): JSX.Element;
