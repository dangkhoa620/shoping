import { useState, type FormEvent } from 'react';
import type { Category } from '../types';

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, category: Category) => void;
}

export const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Category>('vegetable');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(name, quantity, category);
    setName('');
    setQuantity(1);
    // Keep last selected category for convenience
  };

  return (
    <div className="card add-form-container">
       <h2 style={{marginTop: 0, marginBottom: '1rem', fontSize: '1.5rem'}}>Add Item</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label" htmlFor="name">Product Name</label>
          <input
            id="name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Milk"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            className="form-input"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group" style={{ minWidth: '150px' }}>
          <label className="form-label" htmlFor="category">Category</label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="vegetable">Vegetable</option>
            <option value="meat">Meat</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Add Item
        </button>
      </form>
    </div>
  );
};
