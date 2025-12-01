import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch user settings
export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    let settings = await db.collection('gutguardian_settings').findOne({ userId });

    // Return default settings if none exist
    if (!settings) {
      settings = {
        userId,
        name: 'Guest',
        currentStage: 'Elimination',
        startDate: Date.now(),
        triggerFoods: [],
        favoriteFoods: [],
      };
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT - Update user settings
export async function PUT(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('gutguardian_settings').findOneAndUpdate(
      { userId },
      { 
        $set: { ...updates, updatedAt: new Date() },
        $setOnInsert: { userId, createdAt: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ settings: result });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

