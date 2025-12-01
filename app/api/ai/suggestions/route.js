import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'AI service not configured' }, { status: 500 });
    }

    const { course, stage, triggerFoods = [] } = await request.json();

    const ai = new GoogleGenAI({ apiKey });
    
    const triggers = triggerFoods.length > 0
      ? `CRITICAL: Exclude these trigger foods: ${triggerFoods.join(', ')}.`
      : '';

    const prompt = `Suggest 5 distinct, delicious and safe AIP diet ${course} meal ideas suitable for the ${stage} phase.
    ${triggers}
    Return ONLY a JSON array of 5 recipe title strings, like:
    ["Turmeric Chicken Soup with Kale", "Herb-Crusted Salmon", ...]`;

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
