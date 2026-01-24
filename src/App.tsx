import { useShoppingList } from './hooks/useShoppingList';
import { CategoryColumn } from './components/CategoryColumn';
import { AddItemForm } from './components/AddItemForm';
import type { Category } from './types';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

function App() {
  const { products, addProduct, updateProduct, removeProduct, clearAll, setProducts } = useShoppingList();

  const categories: Category[] = ['vegetable', 'meat', 'other'];

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCategory = source.droppableId as Category;
    const destCategory = destination.droppableId as Category;

    // specific lists for manipulation
    const sourceList = products.filter(p => p.category === sourceCategory);
    const destList = sourceCategory === destCategory 
      ? sourceList 
      : products.filter(p => p.category === destCategory);

    // remove from source
    const [movedItem] = sourceList.splice(source.index, 1);

    // update category if changed
    if (sourceCategory !== destCategory) {
      movedItem.category = destCategory;
    }

    // add to destination
    destList.splice(destination.index, 0, movedItem);

    // reconstruct the full list
    // iterate over all categories to strictly maintain category grouping order in storage
    const newProducts = categories.flatMap(cat => {
      if (cat === sourceCategory) return sourceList;
      if (cat === destCategory) return destList;
      return products.filter(p => p.category === cat);
    });

    setProducts(newProducts);
  };

  return (
    <div className="container main-layout">
      <header className="header">
        <h1 className="app-title">Shopping List</h1>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
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
      </DragDropContext>

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
