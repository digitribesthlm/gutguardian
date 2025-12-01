import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch all logs for a user
export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const logs = await db
      .collection('gutguardian_logs')
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST - Create a new log entry
export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const log = await request.json();
    const { db } = await connectToDatabase();

    const newLog = {
      ...log,
      userId,
      createdAt: new Date(),
    };

    await db.collection('gutguardian_logs').insertOne(newLog);

    return NextResponse.json({ log: newLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating log');
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

