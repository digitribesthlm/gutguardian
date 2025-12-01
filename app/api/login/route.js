import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Try exact match first, then lowercase
    let user = await db.collection('users').findOne({ email: email });
    if (!user) {
      user = await db.collection('users').findOne({ email: email.toLowerCase() });
    }

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

