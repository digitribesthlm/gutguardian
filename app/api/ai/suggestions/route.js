import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'AI service not configured' }, { status: 500 });
    }

    const { course, stage, triggerFoods = [], favoriteFoods = [] } = await request.json();

    const ai = new GoogleGenAI({ apiKey });
    
    const triggerWarning = triggerFoods.length > 0
      ? `

CRITICAL DIETARY RESTRICTIONS - MUST FOLLOW:
The user has identified the following as personal trigger foods that cause them health problems:
- ${triggerFoods.join('\n- ')}

You MUST NOT suggest any meal that contains these ingredients or any variation of them.
Do NOT include recipes with ${triggerFoods.join(', ')} or any dishes where these are key ingredients.
This is a medical necessity, not a preference.
`
      : '';

    const favoriteSection = favoriteFoods.length > 0
      ? `

PREFERRED INGREDIENTS - PRIORITIZE THESE:
The user has marked these as their favorite foods. Try to feature them prominently in your suggestions:
- ${favoriteFoods.join('\n- ')}

At least 3 of your 5 suggestions should include one or more of these favorite ingredients.
`
      : '';

    const prompt = `You are a specialized AIP (Autoimmune Protocol) diet chef helping someone with autoimmune digestive issues.

Suggest 5 distinct, delicious and safe AIP diet ${course} meal ideas suitable for the ${stage} phase.
${triggerWarning}${favoriteSection}
IMPORTANT: 
1. Double-check each suggestion does NOT contain any of the user's trigger foods listed above.
2. Prioritize using the user's favorite ingredients when possible.

Return ONLY a valid JSON array of 5 recipe title strings. Example format:
["Turmeric Chicken Soup with Kale", "Herb-Crusted Salmon", "Coconut Curry Shrimp", "Rosemary Lamb Chops", "Ginger Beef Stir-fry"]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return NextResponse.json({ suggestions: JSON.parse(jsonMatch[0]) });
    }
    
    return NextResponse.json({ suggestions: [] });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ message: 'Error getting suggestions' }, { status: 500 });
  }
}
