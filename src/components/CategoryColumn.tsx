import type { Product, Category } from '../types';
import { ProductItem } from './ProductItem';

interface CategoryColumnProps {
  category: Category;
  products: Product[];
  onUpdate: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  onRemove: (id: string) => void;
}

export const CategoryColumn = ({
  category,
  products,
  onUpdate,
  onRemove,
}: CategoryColumnProps) => {
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="card category-card">
      <div className="category-header">
        <span className="category-title">{category}</span>
        <span className="category-total">Total: {totalQuantity}</span>
      </div>
      
      {products.length === 0 ? (
        <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
          No items
        </div>
      ) : (
        <ul className="item-list">
          {products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
