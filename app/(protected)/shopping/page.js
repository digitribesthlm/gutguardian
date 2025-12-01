'use client';

import { useState } from 'react';
import { Trash2, Plus, CheckSquare, Square, ShoppingCart } from 'lucide-react';
import { useAppState } from '@/lib/useAppState';

export default function ShoppingPage() {
  const { shoppingList, addToShoppingList, toggleShoppingItem, removeShoppingItem, clearCheckedItems } =
    useAppState();
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      addToShoppingList([newItem.trim()]);
      setNewItem('');
    }
  };

  const sortedItems = [...shoppingList].sort((a, b) => {
    if (a.checked === b.checked) return b.addedAt - a.addedAt;
    return a.checked ? 1 : -1;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shopping List</h1>
          <p className="text-slate-500 text-sm">Check off items as you shop</p>
        </div>
        {shoppingList.some((i) => i.checked) && (
          <button
            onClick={clearCheckedItems}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium px-3 py-1 bg-rose-50 rounded-lg transition-colors"
          >
            Clear Bought
          </button>
        )}
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAdd} className="relative">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="w-full pl-4 pr-12 py-3 bg-white rounded-xl shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="absolute right-2 top-2 p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {shoppingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
            <p>Your list is empty</p>
            <p className="text-xs">Add ingredients from recipes or type them above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 transition-colors ${
                  item.checked ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                }`}
              >
                <button
                  onClick={() => toggleShoppingItem(item.id)}
                  className="flex items-center flex-1 text-left group"
                >
                  {item.checked ? (
                    <CheckSquare className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-300 mr-3 flex-shrink-0 group-hover:text-teal-400 transition-colors" />
                  )}
                  <span className={`${item.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {item.name}
                  </span>
                </button>
                <button
                  onClick={() => removeShoppingItem(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

