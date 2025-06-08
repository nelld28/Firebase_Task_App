import type { ElementType } from '@/components/icons/element-icon';

export interface Profile {
  id: string;
  name: string;
  element: ElementType;
  chi: number;
  stepsToday: number;
  avatarUrl?: string; 
}

export interface Chore {
  id: string;
  name: string;
  description: string;
  assignedTo: string; // Profile ID
  dueDate: Date;
  isCompleted: boolean;
  elementType: ElementType; 
}

export const mockProfiles: Profile[] = [
  { id: '1', name: 'Aang', element: 'air', chi: 1200, stepsToday: 8500, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '2', name: 'Katara', element: 'water', chi: 950, stepsToday: 6200, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '3', name: 'Toph', element: 'earth', chi: 1100, stepsToday: 4300, avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '4', name: 'Zuko', element: 'fire', chi: 800, stepsToday: 7100, avatarUrl: 'https://placehold.co/100x100.png' },
];

export const mockChores: Chore[] = [
  { id: 'c1', name: 'Clean the Living Room', description: 'Vacuum, dust, and tidy up the common area.', assignedTo: '1', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), isCompleted: false, elementType: 'air' },
  { id: 'c2', name: 'Wash Dishes', description: 'All dishes from sink and load/unload dishwasher.', assignedTo: '2', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), isCompleted: true, elementType: 'water' },
  { id: 'c3', name: 'Take out Trash & Recycling', description: 'Empty all trash cans and sort recycling.', assignedTo: '3', dueDate: new Date(new Date().setDate(new Date().getDate() + 0)), isCompleted: false, elementType: 'earth' },
  { id: 'c4', name: 'Cook Dinner (Mon)', description: 'Prepare Monday night dinner for the household.', assignedTo: '4', dueDate: new Date(new Date().setDate(new Date().getDate() + 0)), isCompleted: false, elementType: 'fire' },
  { id: 'c5', name: 'Water Plants', description: 'Water all indoor and outdoor plants thoroughly.', assignedTo: '2', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), isCompleted: false, elementType: 'water' },
  { id: 'c6', name: 'Sweep Floors', description: 'Sweep kitchen, dining area, and hallways.', assignedTo: '1', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), isCompleted: false, elementType: 'air' },
  { id: 'c7', name: 'Organize Bookshelf', description: 'Sort and dust the main bookshelf in the study.', assignedTo: '3', dueDate: new Date(new Date().setDate(new Date().getDate() + 4)), isCompleted: false, elementType: 'earth' },
  { id: 'c8', name: 'Clean Bathroom', description: 'Clean toilet, sink, shower, and floor in the main bathroom.', assignedTo: '4', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), isCompleted: false, elementType: 'fire' },
];

// Helper to get profile by ID
export const getProfileById = (id: string): Profile | undefined => mockProfiles.find(p => p.id === id);
