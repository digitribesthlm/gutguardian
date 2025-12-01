import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET - Fetch shopping list for a user
export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const items = await db
      .collection('gutguardian_shopping')
      .find({ userId })
      .sort({ addedAt: -1 })
      .toArray();

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST - Add items to shopping list
export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();
    const { db } = await connectToDatabase();

    const newItems = items.map(item => ({
      ...item,
      userId,
      createdAt: new Date(),
    }));

    if (newItems.length > 0) {
      await db.collection('gutguardian_shopping').insertMany(newItems);
    }

    return NextResponse.json({ items: newItems }, { status: 201 });
  } catch (error) {
    console.error('Error adding shopping items:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// PUT - Update a shopping item (toggle checked)
export async function PUT(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, checked } = await request.json();
    const { db } = await connectToDatabase();

    await db.collection('gutguardian_shopping').updateOne(
      { id, userId },
      { $set: { checked, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating shopping item:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove item(s) from shopping list
export async function DELETE(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, clearChecked } = await request.json();
    const { db } = await connectToDatabase();

    if (clearChecked) {
      // Clear all checked items
      await db.collection('gutguardian_shopping').deleteMany({ userId, checked: true });
    } else if (id) {
      // Delete single item
      await db.collection('gutguardian_shopping').deleteOne({ id, userId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shopping item:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

