import { NextResponse } from 'next/server';
import User from '../../../../lib/models/user.model';  // Make sure this path is correct
import { connect } from '../../../../lib/mongodb/mongoose'; // Ensure this is correctly importing the MongoDB connection

export async function PUT(req) {
  try {
    const { userId, isAdmin } = await req.json();

    // Validate the input
    if (!userId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    // Connect to MongoDB
    await connect();  // Use the correct connection method

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user's isAdmin status
    user.isAdmin = isAdmin;
    await user.save();

    // Respond with the updated user data
    return NextResponse.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error('Error updating role:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
