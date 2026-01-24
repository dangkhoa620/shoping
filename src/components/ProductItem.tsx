import { useState } from 'react';
import type { Product } from '../types';

interface ProductItemProps {
  product: Product;
  onUpdate: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  onRemove: (id: string) => void;
}

import { Draggable } from '@hello-pangea/dnd';

export const ProductItem = ({ product, onUpdate, onRemove, index }: ProductItemProps & { index: number }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editQuantity, setEditQuantity] = useState(product.quantity);

  const handleSave = () => {
    if (!editName.trim() || editQuantity <= 0) return;
    onUpdate(product.id, { name: editName, quantity: editQuantity });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(product.name);
    setEditQuantity(product.quantity);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="product-item">
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
          <input
            className="form-input"
            style={{ flex: 2, padding: '0.25rem 0.5rem' }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
          />
          <input
            className="form-input"
            type="number"
            min="1"
            style={{ width: '60px', padding: '0.25rem 0.5rem' }}
            value={editQuantity}
            onChange={(e) => setEditQuantity(Number(e.target.value))}
          />
        </div>
        <div className="product-actions">
          <button className="btn-icon" onClick={handleSave} title="Save">
            ✓
          </button>
          <button className="btn-icon delete" onClick={handleCancel} title="Cancel">
            ✕
          </button>
        </div>
      </li>
    );
  }

  return (
    <Draggable draggableId={product.id} index={index}>
      {(provided) => (
        <li
          className="product-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '0.5rem',
          }}
        >
          <div className="product-info">
            <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
              {product.quantity}
            </span>
            <span>{product.name}</span>
          </div>
          <div className="product-actions">
            <button
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              ✎
            </button>
            <button
              className="btn-icon delete"
              onClick={() => onRemove(product.id)}
              title="Remove"
            >
              🗑
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
};
