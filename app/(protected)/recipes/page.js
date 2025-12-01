'use client';

import { useState, useEffect } from 'react';
import {
  ChefHat,
  Loader2,
  Clock,
  AlertOctagon,
  Utensils,
  Moon,
  ShoppingBag,
  Plus,
  ArrowRight,
  Check,
  Star,
} from 'lucide-react';
import { useAppState } from '@/lib/useAppState';
import { generateAIPRecipe, generateMealSuggestions } from '@/lib/geminiService';

export default function RecipesPage() {
  const { settings, addToShoppingList } = useAppState();
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [addedToList, setAddedToList] = useState(false);

  useEffect(() => {
    if (recipe) {
      setSelectedIngredients([]);
      setAddedToList(false);
    }
  }, [recipe]);

  const handleGenerate = async (input = ingredients) => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setRecipe(null);
    setSuggestions([]);
    setActiveCourse(null);

    try {
      const result = await generateAIPRecipe(input, settings.currentStage, settings.triggerFoods, settings.favoriteFoods || []);
      setRecipe(result);
    } catch (e) {
      setError('Could not generate recipe. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = async (course) => {
    setSuggestionsLoading(true);
    setRecipe(null);
    setActiveCourse(course);
    setSuggestions([]);
    setError('');

    try {
      const results = await generateMealSuggestions(course, settings.currentStage, settings.triggerFoods, settings.favoriteFoods || []);
      setSuggestions(results);
    } catch (e) {
      setError(`Could not get ${course} suggestions.`);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleAddSelectedToList = () => {
    if (selectedIngredients.length === 0) return;
    addToShoppingList(selectedIngredients);
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 3000);
    setSelectedIngredients([]);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AIP Kitchen</h1>
          <p className="text-slate-600 text-sm">
            Recipes compliant with your <strong>{settings.currentStage}</strong> phase.
          </p>
        </div>
      </div>

      {/* Main Control Panel */}
      <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Cook with what you have
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Chicken breast, Spinach..."
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !ingredients}
              className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <ChefHat className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400">OR GET INSPIRED</span>
          </div>
        </div>

        {/* Suggestions Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGetSuggestions('Lunch')}
            disabled={suggestionsLoading || loading}
            className={`flex items-center justify-center space-x-2 p-4 rounded-xl border transition-all ${
              activeCourse === 'Lunch'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {suggestionsLoading && activeCourse === 'Lunch' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Utensils className="w-5 h-5" />
            )}
            <span className="font-medium">Lunch Ideas</span>
          </button>

          <button
            onClick={() => handleGetSuggestions('Dinner')}
            disabled={suggestionsLoading || loading}
            className={`flex items-center justify-center space-x-2 p-4 rounded-xl border transition-all ${
              activeCourse === 'Dinner'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {suggestionsLoading && activeCourse === 'Dinner' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="font-medium">Dinner Ideas</span>
          </button>
        </div>

        {/* Favorite foods info */}
        {settings.favoriteFoods?.length > 0 && (
          <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
            <Star className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-amber-800">
              <strong>Prioritizing:</strong>{' '}
              <span className="font-medium">{settings.favoriteFoods.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Trigger warning info */}
        {settings.triggerFoods.length > 0 && (
          <div className="flex items-start p-3 bg-rose-50 rounded-lg border border-rose-100">
            <AlertOctagon className="w-4 h-4 text-rose-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-rose-800">
              <strong>Excluding:</strong>{' '}
              <span className="font-medium">{settings.triggerFoods.join(', ')}</span>
            </div>
          </div>
        )}

        {error && <p className="text-rose-500 text-xs">{error}</p>}
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && !recipe && (
        <div className="animate-fade-in space-y-3">
          <h3 className="text-lg font-bold text-slate-800 ml-1">Select a meal to get the recipe</h3>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerate(suggestion)}
              className="w-full text-left bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-teal-300 hover:shadow-md transition-all group flex justify-between items-center"
            >
              <span className="font-medium text-slate-700 group-hover:text-teal-700">{suggestion}</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500" />
            </button>
          ))}
        </div>
      )}

      {/* Recipe Display */}
      {recipe && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fade-in">
          <div className="bg-teal-50 p-6 border-b border-teal-100">
            <h2 className="text-xl font-bold text-teal-900 leading-tight">{recipe.title}</h2>
            <div className="flex items-center space-x-4 mt-3 text-xs font-medium text-teal-700">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" /> {recipe.prepTime}
              </span>
              <span className="bg-white px-2 py-1 rounded-full border border-teal-200">
                {recipe.phase} Compliant
              </span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-teal-600" /> Ingredients
                </h3>
                <button
                  onClick={handleAddSelectedToList}
                  disabled={selectedIngredients.length === 0}
                  className={`text-xs px-3 py-1.5 rounded-lg flex items-center transition-all ${
                    addedToList
                      ? 'bg-emerald-100 text-emerald-700'
                      : selectedIngredients.length > 0
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {addedToList ? <Check className="w-3 h-3 mr-1.5" /> : <Plus className="w-3 h-3 mr-1.5" />}
                  {addedToList
                    ? 'Added!'
                    : `Add ${selectedIngredients.length > 0 ? selectedIngredients.length : ''} to List`}
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-3 italic">Select items you need to buy:</p>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const isSelected = selectedIngredients.includes(ing);
                    return (
                      <li key={idx} className="flex items-start text-sm text-slate-700">
                        <div className="relative flex items-center h-5 mr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleIngredient(ing)}
                            className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                        <span
                          onClick={() => toggleIngredient(ing)}
                          className={`cursor-pointer ${isSelected ? 'font-medium text-teal-800' : ''}`}
                        >
                          {ing}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-teal-600" /> Instructions
              </h3>
              <ol className="space-y-6">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex group">
                    <span className="font-bold text-slate-300 mr-4 text-lg group-hover:text-teal-500 transition-colors">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

