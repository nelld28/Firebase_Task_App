
import type { Timestamp } from 'firebase/firestore';

export type ElementType = 'air' | 'water' | 'earth' | 'fire';

export interface Profile {
  id: string; // Firestore document ID
  name: string;
  element: ElementType;
  chi: number;
  stepsToday: number;
  avatarUrl?: string;
  createdAt?: Timestamp; // Optional: for sorting or tracking
}

export interface Chore {
  id: string; // Firestore document ID
  name: string;
  description: string;
  assignedTo: string; // Profile ID
  assigneeName?: string; // Denormalized for easier display, optional
  assigneeAvatarUrl?: string; // Denormalized, optional
  dueDate: Date; // Stored as Timestamp in Firestore, converted to Date in app
  isCompleted: boolean;
  elementType: ElementType;
  createdAt?: Timestamp; // Optional: for sorting or tracking
}

// Input types for forms/actions, excluding Firestore-generated fields like 'id' or 'createdAt'
export interface ProfileInput extends Omit<Profile, 'id' | 'createdAt' | 'chi' | 'stepsToday' | 'avatarUrl'> {
  chi?: number;
  stepsToday?: number;
  avatarUrl?: string;
}
export interface ChoreInput extends Omit<Chore, 'id' | 'createdAt' | 'dueDate' | 'assigneeName' | 'assigneeAvatarUrl'> {
  dueDate: string; // Use string for form input, convert to Date/Timestamp in action
}
