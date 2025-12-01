'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Leaf, 
  Ban, 
  Apple, 
  Fish, 
  Beef, 
  Carrot,
  Droplets,
  Flame,
  AlertTriangle,
  CheckCircle,
  Info,
  Heart,
  Star
} from 'lucide-react';
import { useAppState } from '@/lib/useAppState';

const goodFoods = [
  {
    category: 'Vegetables',
    icon: Carrot,
    color: 'emerald',
    description: 'Non-nightshade vegetables are the foundation of AIP. Aim for variety and color.',
    items: [
      { name: 'Leafy Greens', examples: 'Spinach, kale, arugula, lettuce, chard', benefit: 'Rich in vitamins A, C, K and folate' },
      { name: 'Cruciferous', examples: 'Broccoli, cauliflower, Brussels sprouts, cabbage', benefit: 'Support detoxification and gut health' },
      { name: 'Root Vegetables', examples: 'Sweet potato, carrots, beets, parsnips, turnips', benefit: 'Good source of fiber and complex carbs' },
      { name: 'Squash', examples: 'Butternut, acorn, zucchini, spaghetti squash', benefit: 'Anti-inflammatory and easy to digest' },
      { name: 'Alliums (Reintro)', examples: 'Garlic, onion, leeks (reintroduce carefully)', benefit: 'Prebiotic fiber, but high FODMAP' },
      { name: 'Sea Vegetables', examples: 'Nori, kelp, dulse, wakame', benefit: 'Rich in iodine and minerals' },
    ]
  },
  {
    category: 'Proteins',
    icon: Beef,
    color: 'rose',
    description: 'Quality matters. Choose grass-fed, pasture-raised, and wild-caught when possible.',
    items: [
      { name: 'Grass-fed Beef', examples: 'Steaks, ground beef, organ meats', benefit: 'Higher omega-3s and CLA than grain-fed' },
      { name: 'Pasture-raised Poultry', examples: 'Chicken, turkey, duck', benefit: 'Lean protein, versatile cooking options' },
      { name: 'Wild-caught Fish', examples: 'Salmon, sardines, mackerel, cod', benefit: 'Omega-3 fatty acids reduce inflammation' },
      { name: 'Shellfish', examples: 'Shrimp, crab, lobster, oysters, mussels', benefit: 'Zinc and B12 for immune function' },
      { name: 'Lamb & Game', examples: 'Lamb, venison, bison, elk', benefit: 'Often grass-fed, nutrient-dense' },
      { name: 'Organ Meats', examples: 'Liver, heart, kidney', benefit: 'Most nutrient-dense foods available' },
    ]
  },
  {
    category: 'Fruits',
    icon: Apple,
    color: 'amber',
    description: 'Fruits provide vitamins and antioxidants. Moderate intake due to sugar content.',
    items: [
      { name: 'Berries', examples: 'Blueberries, strawberries, raspberries, blackberries', benefit: 'High antioxidants, lower sugar' },
      { name: 'Citrus', examples: 'Oranges, lemons, limes, grapefruit', benefit: 'Vitamin C for immune support' },
      { name: 'Tropical', examples: 'Mango, papaya, pineapple, coconut', benefit: 'Digestive enzymes (papaya, pineapple)' },
      { name: 'Stone Fruits', examples: 'Peaches, plums, cherries, apricots', benefit: 'Fiber and potassium' },
      { name: 'Apples & Pears', examples: 'Various varieties', benefit: 'Pectin fiber supports gut bacteria' },
      { name: 'Avocado', examples: 'Technically a fruit!', benefit: 'Healthy fats, potassium, fiber' },
    ]
  },
  {
    category: 'Healthy Fats',
    icon: Droplets,
    color: 'sky',
    description: 'Quality fats are essential for hormone production and reducing inflammation.',
    items: [
      { name: 'Olive Oil', examples: 'Extra virgin, cold-pressed', benefit: 'Polyphenols and oleic acid' },
      { name: 'Coconut Oil', examples: 'Virgin, unrefined', benefit: 'MCTs for energy, antimicrobial' },
      { name: 'Avocado Oil', examples: 'High smoke point for cooking', benefit: 'Monounsaturated fats' },
      { name: 'Animal Fats', examples: 'Tallow, lard, duck fat (from quality sources)', benefit: 'Stable for high-heat cooking' },
      { name: 'Coconut Products', examples: 'Coconut milk, cream, butter', benefit: 'Dairy-free fat source' },
      { name: 'Fatty Fish', examples: 'Salmon, sardines, mackerel', benefit: 'EPA and DHA omega-3s' },
    ]
  },
  {
    category: 'Fermented Foods',
    icon: Flame,
    color: 'purple',
    description: 'Introduce slowly. These support gut microbiome diversity.',
    items: [
      { name: 'Sauerkraut', examples: 'Raw, unpasteurized', benefit: 'Probiotics and vitamin C' },
      { name: 'Kimchi (modified)', examples: 'Without nightshades or additives', benefit: 'Diverse probiotic strains' },
      { name: 'Coconut Yogurt', examples: 'Unsweetened, live cultures', benefit: 'Dairy-free probiotic source' },
      { name: 'Kombucha', examples: 'Low sugar varieties', benefit: 'Probiotics and organic acids' },
      { name: 'Kvass', examples: 'Beet or fruit-based', benefit: 'Traditional probiotic drink' },
      { name: 'Fermented Vegetables', examples: 'Carrots, beets, pickles (no vinegar)', benefit: 'Easy to make at home' },
    ]
  },
];

const badFoods = [
  {
    category: 'Grains & Gluten',
    icon: Ban,
    color: 'red',
    severity: 'Always Avoid',
    description: 'Grains contain proteins and compounds that can damage the gut lining and trigger immune responses.',
    items: [
      { name: 'Wheat', examples: 'Bread, pasta, cereals, flour', reason: 'Gluten triggers intestinal permeability' },
      { name: 'Barley & Rye', examples: 'Beer, rye bread, malt', reason: 'Contains gluten proteins' },
      { name: 'Oats', examples: 'Even gluten-free oats', reason: 'Cross-reactive proteins, often contaminated' },
      { name: 'Corn', examples: 'Corn flour, tortillas, popcorn', reason: 'Inflammatory, often GMO' },
      { name: 'Rice', examples: 'White, brown, wild rice', reason: 'Can be reintroduced later for some' },
      { name: 'Pseudo-grains', examples: 'Quinoa, buckwheat, amaranth', reason: 'Saponins irritate gut lining' },
    ]
  },
  {
    category: 'Dairy',
    icon: Ban,
    color: 'red',
    severity: 'Always Avoid',
    description: 'Dairy proteins (casein, whey) and lactose are common triggers for autoimmune flares.',
    items: [
      { name: 'Milk', examples: 'Cow, goat, sheep milk', reason: 'Casein and lactose intolerance' },
      { name: 'Cheese', examples: 'All varieties', reason: 'Concentrated casein protein' },
      { name: 'Yogurt', examples: 'Regular dairy yogurt', reason: 'Use coconut yogurt instead' },
      { name: 'Butter', examples: 'Regular butter', reason: 'Ghee may be tolerated (clarified)' },
      { name: 'Cream', examples: 'Heavy cream, sour cream', reason: 'High in dairy proteins' },
      { name: 'Ice Cream', examples: 'All dairy-based', reason: 'Dairy + sugar combination' },
    ]
  },
  {
    category: 'Nightshades',
    icon: AlertTriangle,
    color: 'orange',
    severity: 'Eliminate First',
    description: 'Nightshades contain alkaloids (solanine, capsaicin) that can increase intestinal permeability.',
    items: [
      { name: 'Tomatoes', examples: 'Fresh, canned, sauce, paste', reason: 'High in lectins and alkaloids' },
      { name: 'Peppers', examples: 'Bell, chili, jalapeño, paprika', reason: 'Capsaicin irritates gut lining' },
      { name: 'Potatoes', examples: 'White, red (sweet potato OK)', reason: 'Glycoalkaloids in skin' },
      { name: 'Eggplant', examples: 'All varieties', reason: 'High solanine content' },
      { name: 'Goji Berries', examples: 'Often in health foods', reason: 'Nightshade family member' },
      { name: 'Spices', examples: 'Paprika, cayenne, chili powder', reason: 'Hidden nightshade sources' },
    ]
  },
  {
    category: 'Legumes',
    icon: Ban,
    color: 'red',
    severity: 'Always Avoid',
    description: 'Legumes contain lectins, phytates, and saponins that can damage the intestinal barrier.',
    items: [
      { name: 'Beans', examples: 'Black, kidney, pinto, navy', reason: 'High lectin content' },
      { name: 'Lentils', examples: 'All varieties', reason: 'Phytates block mineral absorption' },
      { name: 'Peanuts', examples: 'Peanut butter, oil', reason: 'Legume, not a nut; highly allergenic' },
      { name: 'Soy', examples: 'Tofu, soy sauce, edamame', reason: 'Phytoestrogens, GMO concerns' },
      { name: 'Chickpeas', examples: 'Hummus, falafel', reason: 'Saponins and lectins' },
      { name: 'Peas', examples: 'Green peas, snap peas', reason: 'May be reintroduced later' },
    ]
  },
  {
    category: 'Nuts & Seeds',
    icon: AlertTriangle,
    color: 'orange',
    severity: 'Eliminate First',
    description: 'Nuts and seeds contain phytic acid and enzyme inhibitors. Often reintroduced successfully.',
    items: [
      { name: 'Tree Nuts', examples: 'Almonds, walnuts, cashews, pecans', reason: 'Phytic acid, common allergen' },
      { name: 'Seeds', examples: 'Sunflower, pumpkin, sesame, chia', reason: 'Omega-6 heavy, enzyme inhibitors' },
      { name: 'Seed Spices', examples: 'Cumin, coriander, fennel, mustard', reason: 'Often overlooked seed sources' },
      { name: 'Cocoa/Chocolate', examples: 'All chocolate products', reason: 'Seed-based, often has dairy/sugar' },
      { name: 'Coffee', examples: 'All coffee', reason: 'Seed of coffee cherry, stimulant' },
      { name: 'Nut Butters', examples: 'Almond, cashew butter', reason: 'Concentrated nut proteins' },
    ]
  },
  {
    category: 'Eggs',
    icon: AlertTriangle,
    color: 'orange',
    severity: 'Eliminate First',
    description: 'Egg whites contain lysozyme which can cross the gut barrier. Yolks are often tolerated.',
    items: [
      { name: 'Whole Eggs', examples: 'Chicken, duck eggs', reason: 'Lysozyme in whites crosses gut barrier' },
      { name: 'Egg Whites', examples: 'Meringue, egg white products', reason: 'Most problematic part' },
      { name: 'Mayonnaise', examples: 'Regular mayo', reason: 'Contains eggs and seed oils' },
      { name: 'Baked Goods', examples: 'Cakes, cookies, breading', reason: 'Hidden egg sources' },
      { name: 'Egg Yolks', examples: 'May be tolerated alone', reason: 'Try reintroducing separately' },
      { name: 'Egg Replacers', examples: 'Flax eggs, chia eggs', reason: 'These are seed-based too!' },
    ]
  },
  {
    category: 'Processed & Additives',
    icon: Ban,
    color: 'red',
    severity: 'Always Avoid',
    description: 'Processed foods contain additives, preservatives, and refined ingredients that harm gut health.',
    items: [
      { name: 'Refined Sugar', examples: 'White sugar, corn syrup, HFCS', reason: 'Feeds harmful gut bacteria' },
      { name: 'Artificial Sweeteners', examples: 'Aspartame, sucralose, saccharin', reason: 'Disrupts microbiome' },
      { name: 'Seed Oils', examples: 'Canola, soybean, corn, sunflower oil', reason: 'High omega-6, inflammatory' },
      { name: 'Emulsifiers', examples: 'Carrageenan, polysorbate 80', reason: 'Directly damage gut lining' },
      { name: 'Alcohol', examples: 'Beer, wine, spirits', reason: 'Increases intestinal permeability' },
      { name: 'NSAIDs', examples: 'Ibuprofen, aspirin (when possible)', reason: 'Damage stomach lining' },
    ]
  },
];

export default function FoodsPage() {
  const { settings, updateSettings } = useAppState();
  const [expandedGood, setExpandedGood] = useState(null);
  const [expandedBad, setExpandedBad] = useState(null);

  const favoriteFoods = settings?.favoriteFoods || [];

  const toggleFavorite = (foodName) => {
    const newFavorites = favoriteFoods.includes(foodName)
      ? favoriteFoods.filter(f => f !== foodName)
      : [...favoriteFoods, foodName];
    
    updateSettings({ favoriteFoods: newFavorites });
  };

  const isFavorite = (foodName) => favoriteFoods.includes(foodName);

  const toggleGood = (idx) => {
    setExpandedGood(expandedGood === idx ? null : idx);
  };

  const toggleBad = (idx) => {
    setExpandedBad(expandedBad === idx ? null : idx);
  };

  const getColorClasses = (color, type) => {
    const colors = {
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500', header: 'bg-emerald-100' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: 'text-rose-500', header: 'bg-rose-100' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500', header: 'bg-amber-100' },
      sky: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', icon: 'text-sky-500', header: 'bg-sky-100' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: 'text-purple-500', header: 'bg-purple-100' },
      red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500', header: 'bg-red-100' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500', header: 'bg-orange-100' },
    };
    return colors[color]?.[type] || '';
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Food Guide</h1>
        <p className="text-slate-500 text-sm">
          Educational reference for AIP-compliant foods. Mark your favorites to prioritize them in recipe suggestions.
        </p>
      </div>

      {/* Favorites Summary */}
      {favoriteFoods.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-semibold text-amber-800">Your Favorite Foods ({favoriteFoods.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {favoriteFoods.map((food, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-amber-700 border border-amber-200"
              >
                <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                {food}
              </span>
            ))}
          </div>
          <p className="text-xs text-amber-600 mt-3">
            These foods will be prioritized when AI generates recipe suggestions for you.
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-800">
          <strong>Tip:</strong> Click the <Heart className="w-4 h-4 inline text-slate-400" /> icon on any food to mark it as a favorite. 
          The AI will prioritize these ingredients when suggesting recipes for you.
        </div>
      </div>

      {/* Good Foods Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Foods to Enjoy</h2>
        </div>
        <p className="text-sm text-slate-600 ml-10">
          These foods support gut healing. Click the heart to add to your favorites.
        </p>

        <div className="space-y-3">
          {goodFoods.map((category, idx) => {
            const Icon = category.icon;
            const isExpanded = expandedGood === idx;
            const categoryFavorites = category.items.filter(item => isFavorite(item.name)).length;
            
            return (
              <div 
                key={idx} 
                className={`rounded-xl border ${getColorClasses(category.color, 'border')} overflow-hidden`}
              >
                <button
                  onClick={() => toggleGood(idx)}
                  className={`w-full px-4 py-4 flex items-center justify-between ${getColorClasses(category.color, 'header')} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${getColorClasses(category.color, 'icon')}`} />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${getColorClasses(category.color, 'text')}`}>
                          {category.category}
                        </h3>
                        {categoryFavorites > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {categoryFavorites}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{category.description}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className={`${getColorClasses(category.color, 'bg')} p-4`}>
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx} 
                          className={`bg-white rounded-lg p-3 shadow-sm transition-all ${
                            isFavorite(item.name) ? 'ring-2 ring-amber-300' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-slate-800">{item.name}</h4>
                            <button
                              onClick={() => toggleFavorite(item.name)}
                              className={`p-1.5 rounded-full transition-all ${
                                isFavorite(item.name)
                                  ? 'bg-amber-100 text-amber-500'
                                  : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-400'
                              }`}
                              title={isFavorite(item.name) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite(item.name) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{item.examples}</p>
                          <p className="text-xs text-emerald-600 mt-2 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {item.benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bad Foods Section */}
      <div className="space-y-4 mt-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <Ban className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Foods to Avoid</h2>
        </div>
        <p className="text-sm text-slate-600 ml-10">
          These foods can trigger inflammation and damage the gut lining. Eliminate during the healing phase.
        </p>

        <div className="space-y-3">
          {badFoods.map((category, idx) => {
            const Icon = category.icon;
            const isExpanded = expandedBad === idx;
            
            return (
              <div 
                key={idx} 
                className={`rounded-xl border ${getColorClasses(category.color, 'border')} overflow-hidden`}
              >
                <button
                  onClick={() => toggleBad(idx)}
                  className={`w-full px-4 py-4 flex items-center justify-between ${getColorClasses(category.color, 'header')} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${getColorClasses(category.color, 'icon')}`} />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${getColorClasses(category.color, 'text')}`}>
                          {category.category}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          category.severity === 'Always Avoid' 
                            ? 'bg-red-200 text-red-800' 
                            : 'bg-orange-200 text-orange-800'
                        }`}>
                          {category.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{category.description}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className={`${getColorClasses(category.color, 'bg')} p-4`}>
                    <div className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-slate-800">{item.name}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              category.severity === 'Always Avoid' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {category.severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{item.examples}</p>
                          <p className="text-xs text-rose-600 mt-2 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-600 mt-8">
        <strong>Remember:</strong> AIP is a temporary elimination protocol. After healing, many foods can be 
        systematically reintroduced. Work with a healthcare provider to personalize your approach.
      </div>
    </div>
  );
}
