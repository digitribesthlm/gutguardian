// All AI calls go through server-side API routes
// API key stays on the server, never exposed to the browser

export const generateAIPRecipe = async (input, stage, triggerFoods = [], favoriteFoods = []) => {
  const response = await fetch('/api/ai/recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, stage, triggerFoods, favoriteFoods }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate recipe');
  }

  const data = await response.json();
  return data.recipe;
};

export const generateMealSuggestions = async (course, stage, triggerFoods = [], favoriteFoods = []) => {
  const response = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course, stage, triggerFoods, favoriteFoods }),
  });

  if (!response.ok) {
    throw new Error('Failed to get suggestions');
  }

  const data = await response.json();
  return data.suggestions || [];
};

export const analyzeTriggers = async (logs) => {
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logs }),
  });

  if (!response.ok) {
    return { error: 'Error analyzing logs. Please try again.' };
  }

  const data = await response.json();
  
  // Return structured data if available, otherwise raw text
  if (data.analysis) {
    return { structured: data.analysis };
  }
  
  return { raw: data.raw || 'Could not analyze logs.' };
};
