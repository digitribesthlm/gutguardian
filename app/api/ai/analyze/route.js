import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'AI service not configured' }, { status: 500 });
    }

    const { logs } = await request.json();

    const ai = new GoogleGenAI({ apiKey });

    const logSummary = logs
      .map(
        (log) => `
      Date: ${new Date(log.timestamp).toLocaleDateString()}
      Meals: ${log.meals.join(', ')}
      Symptoms: Bloating(${log.symptoms.bloating}), Pain(${log.symptoms.pain}), Fatigue(${log.symptoms.fatigue})
      Stress Level: ${log.stress}/10
    `
      )
      .join('\n---\n');

    const prompt = `Act as a specialized autoimmune dietitian. Analyze these daily logs for potential food triggers affecting the user's gut health.
    
    Logs:
    ${logSummary}
    
    Look for correlations between specific food items and symptom flare-ups (often delayed by 4-24 hours). 
    Also consider stress levels. 
    Provide a concise, empathetic summary of potential triggers and 3 actionable recommendations. 
    Keep it under 200 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    return NextResponse.json({ analysis: text || 'Could not analyze logs.' });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ message: 'Error analyzing logs' }, { status: 500 });
  }
}
