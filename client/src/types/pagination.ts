export interface PageMeta {
  page: number;
  size: number;
  has_prev: boolean;
  has_next: boolean;
  sort: string[];
  filters: Record<string, any>;
  total?: number;
  pages?: number;
}