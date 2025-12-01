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

    const triggerWarning = triggerFoods.length > 0
      ? `

CRITICAL DIETARY RESTRICTIONS - MUST FOLLOW:
The user has identified these as personal trigger foods that cause them health problems:
- ${triggerFoods.join('\n- ')}

You MUST NOT use any of these ingredients or any variation/derivative of them.
This is a medical necessity. If the recipe request conflicts with these restrictions, suggest an alternative without the trigger food.
`
      : '';

    const prompt = `You are a specialized AIP (Autoimmune Protocol) diet chef helping someone with autoimmune digestive issues.

Create a delicious, strict AIP diet recipe suitable for the ${stage} phase.
Focus on anti-inflammatory ingredients.
Recipe Request / Primary Ingredients: "${input}".
${triggerWarning}
Standard AIP Rules for ${stage} phase:
- Elimination phase: NO gluten, dairy, nightshades (tomatoes, peppers, potatoes, eggplant), soy, eggs, nuts, seeds, legumes, alcohol, coffee, refined sugars.
- Reintroduction/Maintenance: Only include reintroduced foods if explicitly requested.

IMPORTANT: Before returning, verify NONE of the user's trigger foods listed above are in the ingredients.

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
