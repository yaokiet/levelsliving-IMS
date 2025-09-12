import { PageMeta } from "./pagination";

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface PaginatedUsers {
  meta: PageMeta;
  data: User[];
}