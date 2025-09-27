import { PageMeta } from "./pagination";

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface UserCreate extends Omit<User, "id"> {
  password: string;
}

export interface PaginatedUsers {
  meta: PageMeta;
  data: User[];
}

export type UserFormState = {
  name: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
};