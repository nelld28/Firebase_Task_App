
'use server';

import { db } from '@/lib/firebase';
import type { ChoreInput } from '@/lib/types';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, Timestamp, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { getProfileByIdFS } from '@/lib/firebase'; // Using this to fetch profile for denormalization

export async function addChore(choreData: ChoreInput): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    console.log('Attempting to fetch profile for assignee ID:', choreData.assignedTo);
    const assigneeProfile = await getProfileByIdFS(choreData.assignedTo);
    console.log('Fetched assignee profile:', assigneeProfile);

    const choreWithDetails = {
      ...choreData,
      dueDate: Timestamp.fromDate(new Date(choreData.dueDate)), // Convert string to Date then to Timestamp
      isCompleted: false,
      assigneeName: assigneeProfile?.name || 'Unknown',
      assigneeAvatarUrl: assigneeProfile?.avatarUrl || 'https://placehold.co/40x40.png',
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'chores'), choreWithDetails);
    revalidatePath('/chores');
    revalidatePath('/'); // For dashboard updates
    return { success: true, id: docRef.id };
  } catch (e: any) {    console.error('Error adding chore:', e.message, 'Chore data:', choreData);
    console.error('Error adding chore: ', e);
    return { success: false, error: e.message };
  }
}

export async function updateChore(choreId: string, choreData: Partial<ChoreInput & { isCompleted?: boolean }>): Promise<{ success: boolean; error?: string }> {
  try {
    const choreRef = doc(db, 'chores', choreId);
    
    const updatePayload: any = { ...choreData };

    if (choreData.dueDate) {
      updatePayload.dueDate = Timestamp.fromDate(new Date(choreData.dueDate));
    }
    
    if (choreData.assignedTo) {
        console.log('Attempting to fetch profile for assignee ID:', choreData.assignedTo);
        const assigneeProfile = await getProfileByIdFS(choreData.assignedTo);
        console.log('Fetched assignee profile:', assigneeProfile);
        updatePayload.assigneeName = assigneeProfile?.name || 'Unknown';
        updatePayload.assigneeAvatarUrl = assigneeProfile?.avatarUrl || 'https://placehold.co/40x40.png';
    }
    
    // Explicitly handle isCompleted if present
    if (typeof choreData.isCompleted === 'boolean') {
        updatePayload.isCompleted = choreData.isCompleted;
    }


    await updateDoc(choreRef, updatePayload);
    revalidatePath('/chores');
    revalidatePath('/'); // For dashboard updates
    return { success: true };
  } catch (e: any) {
    console.error('Error updating chore: ', e);
    return { success: false, error: e.message };
  }
}

export async function toggleChoreComplete(choreId: string, isCompleted: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const choreRef = doc(db, 'chores', choreId);
    await updateDoc(choreRef, { isCompleted });

    if(isCompleted) {
        // Award Chi to assignee if chore is completed
        const choreSnap = await getDoc(choreRef);
        if (choreSnap.exists()) {
            const chore = choreSnap.data();
            const assigneeId = chore.assignedTo;
            if (assigneeId) {
                const profileRef = doc(db, 'profiles', assigneeId);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    const currentChi = profileSnap.data()?.chi || 0;
                    // Award 50 Chi for completing a chore, for example
                    await updateDoc(profileRef, { chi: currentChi + 50 });
                }
            }
        }
    }

    revalidatePath('/chores');
    revalidatePath('/');
    return { success: true };
  } catch (e: any)    {
    console.error('Error toggling chore completion: ', e);
    return { success: false, error: e.message };
  }
}

export async function deleteChore(choreId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const choreRef = doc(db, 'chores', choreId);
    await deleteDoc(choreRef);
    revalidatePath('/chores');
    revalidatePath('/'); // For dashboard updates
    return { success: true };
  } catch (e: any) {
    console.error('Error deleting chore: ', e);
    return { success: false, error: e.message };
  }
}
