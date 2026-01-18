import { useShoppingList } from './hooks/useShoppingList';
import { CategoryColumn } from './components/CategoryColumn';
import { AddItemForm } from './components/AddItemForm';
import type { Category } from './types';

function App() {
  const { products, addProduct, updateProduct, removeProduct, clearAll } = useShoppingList();

  const categories: Category[] = ['vegetable', 'meat', 'other'];

  return (
    <div className="container main-layout">
      <header className="header">
        <h1 className="app-title">Shopping List</h1>
      </header>

      <div className="columns-grid">
        {categories.map((category) => (
          <CategoryColumn
            key={category}
            category={category}
            products={products.filter((p) => p.category === category)}
            onUpdate={updateProduct}
            onRemove={removeProduct}
          />
        ))}
      </div>

      <AddItemForm onAdd={addProduct} />

      {products.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            className="btn-secondary"
            onClick={() => {
              const formattedList = categories.map(cat => {
                const catProducts = products.filter(p => p.category === cat);
                if (catProducts.length === 0) return null;
                const items = catProducts.map(p => `- ${p.name} (${p.quantity})`).join('\n');
                return `${cat}\n${items}`;
              }).filter(Boolean).join('\n\n');
              
              navigator.clipboard.writeText(formattedList)
                .then(() => alert('List copied to clipboard!'))
                .catch(err => console.error('Failed to copy list:', err));
            }}
          >
            📋 Copy List
          </button>
          
          <button className="btn-clear" onClick={() => {
            if (confirm('Are you sure you want to clear the entire list?')) {
              clearAll();
            }
          }}>
            Clear All Items
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
