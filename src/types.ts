export type Category = 'meat' | 'vegetable' | 'other';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  category: Category;
}
