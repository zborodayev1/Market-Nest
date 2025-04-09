import { UserProfile } from '../types/auth.type';

export interface Product {
  saveAmount: number;
  discount: number | null;
  save: number;
  oldPrice: number;
  _id: string;
  name: string;
  tags: string[];
  price: number;
  description?: string;
  viewsCount: number;
  createdAt: string;
  image: null | string;
  user: UserProfile | null;
  favorite: boolean;
  status: string;
}
