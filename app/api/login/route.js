import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log('[LOGIN] Attempting login for:', email);

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Debug: List all users in the collection
    const allUsers = await db.collection('users').find({}).toArray();
    console.log('[LOGIN] Users in database:', allUsers.map(u => ({ email: u.email, name: u.name })));
    
    // Try exact match first, then lowercase
    let user = await db.collection('users').findOne({ email: email });
    if (!user) {
      user = await db.collection('users').findOne({ email: email.toLowerCase() });
    }
    
    console.log('[LOGIN] Found user:', user ? { email: user.email, name: user.name } : 'NOT FOUND');

    if (!user) {
      return NextResponse.json(
        { message: 'No account found with that email.' },
        { status: 401 }
      );
    }

    // Plain string comparison (as per your DB structure)
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Incorrect password.' },
        { status: 401 }
      );
    }

    // Return user without password
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    };

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

