import type { Product, Category } from '../types';
import { ProductItem } from './ProductItem';
import { Droppable } from '@hello-pangea/dnd';

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
      
      <Droppable droppableId={category}>
        {(provided) => (
          <ul
            className="item-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ minHeight: '100px' }} // Ensure there is drop space if empty
          >
            {products.length === 0 && (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
                No items
              </div>
            )}
            {products.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                onUpdate={onUpdate}
                onRemove={onRemove}
                index={index}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};
