
'use server';

import { db } from '@/lib/firebase';
import type { Profile, ProfileInput } from '@/lib/types';
import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function addProfile(profileData: ProfileInput): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const profileWithTimestamp = {
      ...profileData,
      chi: profileData.chi || 0,
      stepsToday: profileData.stepsToday || 0,
      avatarUrl: profileData.avatarUrl || `https://placehold.co/100x100.png?text=${profileData.name.substring(0,1)}`,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'profiles'), profileWithTimestamp);
    revalidatePath('/profiles');
    revalidatePath('/'); // For dashboard updates
    return { success: true, id: docRef.id };
  } catch (e: any) {
    console.error('Error adding profile: ', e);
    return { success: false, error: e.message };
  }
}

export async function updateProfile(profileId: string, profileData: Partial<ProfileInput>): Promise<{ success: boolean; error?: string }> {
  try {
    const profileRef = doc(db, 'profiles', profileId);
    await updateDoc(profileRef, {
        ...profileData,
        // Ensure specific fields are handled correctly if needed, e.g. numeric fields
        ...(profileData.chi !== undefined && { chi: Number(profileData.chi) }),
        ...(profileData.stepsToday !== undefined && { stepsToday: Number(profileData.stepsToday) }),
    });
    revalidatePath('/profiles');
    revalidatePath('/'); // For dashboard updates
    revalidatePath(`/profiles/${profileId}`); // If there was a profile detail page
    return { success: true };
  } catch (e: any) {
    console.error('Error updating profile: ', e);
    return { success: false, error: e.message };
  }
}

export async function incrementChi(profileId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    try {
        const profileRef = doc(db, 'profiles', profileId);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists()) {
            return { success: false, error: "Profile not found" };
        }
        const currentChi = profileSnap.data()?.chi || 0;
        await updateDoc(profileRef, {
            chi: currentChi + amount
        });
        revalidatePath('/profiles');
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        console.error('Error incrementing chi: ', e);
        return { success: false, error: e.message };
    }
}
