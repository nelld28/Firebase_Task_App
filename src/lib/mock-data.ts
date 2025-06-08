
// This file is no longer the primary source of data for profiles and chores.
// Data is now fetched from and saved to Firebase Firestore.
// You can use the structures in src/lib/types.ts as a reference for your Firestore data.

// If you need to add initial data to your Firestore database,
// you can do so manually through the Firebase Console or by writing a one-time script.

// Example structures (for reference, not used by the app directly anymore):

/*
import type { Profile, Chore, ElementType } from './types';
import { Timestamp } from 'firebase/firestore'; // For example structure

export const exampleProfiles: Profile[] = [
  {
    id: 'example1', // In Firestore, IDs are auto-generated
    name: 'Aang',
    element: 'air',
    chi: 1200,
    stepsToday: 8500,
    avatarUrl: 'https://placehold.co/100x100.png',
    createdAt: Timestamp.now() // Example
  },
  // ... more example profiles
];

export const exampleChores: Chore[] = [
  {
    id: 'example_c1', // In Firestore, IDs are auto-generated
    name: 'Clean the Living Room',
    description: 'Vacuum, dust, and tidy up the common area.',
    assignedTo: 'example1', // Corresponds to a Profile ID
    assigneeName: 'Aang', // Denormalized
    assigneeAvatarUrl: 'https://placehold.co/100x100.png', // Denormalized
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), // Will be a Timestamp in Firestore
    isCompleted: false,
    elementType: 'air',
    createdAt: Timestamp.now() // Example
  },
  // ... more example chores
];
*/

export {}; // Keep this to ensure it's treated as a module
