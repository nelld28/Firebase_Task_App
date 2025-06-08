
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocsFromServer, doc, getDocFromServer } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // If you need auth later

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// const auth = getAuth(app); // If you need auth later

export { app, db /*, auth */ };

// Helper function to convert Firestore Timestamps to JS Dates in nested objects
export const convertTimestampsToDates = (data: any): any => {
  if (!data) return data;

  if (typeof data.toDate === 'function') { // Check if it's a Firestore Timestamp
    return data.toDate();
  }

  if (Array.isArray(data)) {
    return data.map(convertTimestampsToDates);
  }

  if (typeof data === 'object') {
    const res: { [key: string]: any } = {};
    for (const key in data) {
      res[key] = convertTimestampsToDates(data[key]);
    }
    return res;
  }
  return data;
};

// Example usage (you might not need these specific functions if using onSnapshot)
export const getProfilesFS = async () => {
  const profilesCol = collection(db, 'profiles');
  const profileSnapshot = await getDocsFromServer(profilesCol);
  const profileList = profileSnapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) }));
  return profileList;
};

export const getChoresFS = async () => {
  const choresCol = collection(db, 'chores');
  const choreSnapshot = await getDocsFromServer(choresCol);
  const choreList = choreSnapshot.docs.map(doc => ({ id: doc.id, ...convertTimestampsToDates(doc.data()) }));
  return choreList;
};

export const getProfileByIdFS = async (id: string) => {
  if (!id) return null;
  const profileDocRef = doc(db, 'profiles', id);
  const profileSnap = await getDocFromServer(profileDocRef);
  if (profileSnap.exists()) {
    return { id: profileSnap.id, ...convertTimestampsToDates(profileSnap.data()) };
  } else {
    return null;
  }
};
