/** Underlined tab strip for switching views within a page. */
export interface TabDef { value: string; label: string; icon?: string; count?: number }
export interface TabsProps {
  tabs?: (TabDef | string)[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
