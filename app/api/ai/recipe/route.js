import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'AI service not configured' }, { status: 500 });
    }

    const { input, stage, triggerFoods = [] } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    const triggers = triggerFoods.length > 0
      ? `CRITICAL: You MUST EXCLUDE these known trigger foods: ${triggerFoods.join(', ')}.`
      : '';

    const prompt = `Create a delicious, strict AIP (Autoimmune Protocol) diet recipe suitable for the ${stage} phase. 
    Focus on anti-inflammatory ingredients. 
    Recipe Request / Primary Ingredients: "${input}".
    
    ${triggers}
    
    Ensure it contains NO gluten, dairy, nightshades, soy, eggs, nuts, or seeds if in the Elimination phase.
    If in Reintroduction or Maintenance, only include non-AIP ingredients if explicitly requested, otherwise stick to safe AIP foods.
    
    Return ONLY valid JSON in this exact format:
    {
      "title": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": "30 minutes",
      "phase": "${stage}"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json({ recipe: JSON.parse(jsonMatch[0]) });
    }
    
    return NextResponse.json({ message: 'Could not generate recipe' }, { status: 500 });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return NextResponse.json({ message: 'Error generating recipe' }, { status: 500 });
  }
}
