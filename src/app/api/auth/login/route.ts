// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// TypeScript Explanation:
// NextRequest and NextResponse are Next.js types for handling API routes
// They're similar to standard Request/Response but with extra Next.js features

// Define the shape of our User data from the database
// RowDataPacket is a mysql2 type that represents a row from the database
interface UserRow extends RowDataPacket {
  user_id: number;
  name: string;
  password: string;
  role: string;
}

// POST function handles POST requests to this route
// In Next.js App Router, you export functions named after HTTP methods
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    // request.json() returns a Promise, so we await it
    const body = await request.json();
    const { name, password } = body;

    // Validation: Check if required fields are present
    if (!name || !password) {
      // Return a JSON response with 400 (Bad Request) status
      return NextResponse.json(
        { error: 'Name and password are required' },
        { status: 400 }
      );
    }

    // Query the database for the user
    // pool.execute returns a Promise with [rows, fields]
    // We use destructuring to get just the rows
    // The <UserRow[]> is a type assertion telling TypeScript what type to expect
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE name = ?',
      [name]
    );

    // Check if user exists
    // rows[0] gets the first row (if any)
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }  // 401 means Unauthorized
      );
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    // bcrypt.compare returns a Promise<boolean>
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Success! Return user data (without password)
    // We create a new object without the password for security
    const userResponse = {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
    };

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userResponse 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log the error for debugging
    console.error('Login error:', error);
    
    // Return a generic error message
    // In production, don't expose detailed error messages
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }  // 500 means Internal Server Error
    );
  }
}

// Key TypeScript Concepts Used:
// 1. Type imports: NextRequest, NextResponse, RowDataPacket
// 2. Interface extension: UserRow extends RowDataPacket
// 3. Type assertions: <UserRow[]> tells TypeScript what type we expect
// 4. Async/await: Used with Promises for cleaner asynchronous code
// 5. Destructuring: const [rows] = await pool.execute(...)