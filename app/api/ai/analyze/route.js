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
      Symptoms: Bloating(${log.symptoms.bloating}/3), Pain(${log.symptoms.pain}/3), Fatigue(${log.symptoms.fatigue}/3), BrainFog(${log.symptoms.brainFog}/3)
      Stress Level: ${log.stress}/10
      Mood: ${log.mood}/10
    `
      )
      .join('\n---\n');

    const prompt = `You are a specialized autoimmune dietitian analyzing food logs for potential triggers.

Analyze these daily logs for food triggers affecting gut health:

${logSummary}

Look for correlations between specific foods and symptom flare-ups (often delayed by 4-24 hours).

Return your analysis as valid JSON in this EXACT format:
{
  "triggers": [
    {
      "food": "Food name",
      "confidence": "high|medium|low",
      "category": "FODMAP|Dairy|Gluten|Nightshade|Other",
      "symptoms": ["bloating", "pain"],
      "notes": "Brief explanation"
    }
  ],
  "summary": "2-3 sentence overview of findings",
  "recommendations": [
    "First actionable recommendation",
    "Second actionable recommendation",
    "Third actionable recommendation"
  ],
  "stressImpact": "Brief note on how stress levels correlate with symptoms"
}

Order triggers by confidence level (high first). Include 3-7 potential triggers if found.
If not enough data, return fewer triggers with a note in summary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    
    // Try to parse as JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ analysis: parsed, raw: null });
      } catch (e) {
        // If JSON parsing fails, return raw text
        return NextResponse.json({ analysis: null, raw: text });
      }
    }
    
    return NextResponse.json({ analysis: null, raw: text || 'Could not analyze logs.' });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ message: 'Error analyzing logs' }, { status: 500 });
  }
}
