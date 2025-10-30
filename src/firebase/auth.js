import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { auth, db } from './client.js';

export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
  phone
}) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    firstName: firstName || '',
    lastName: lastName || '',
    email,
    phone: phone || '',
    isProBanner: false,
    tokenCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return user;
};

export const signInUser = async ({ email, password, remember }) => {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => signOut(auth);

export const listenToAuthChanges = (callback) => onAuthStateChanged(auth, callback);

export const getUserProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateTokenCount = async (uid, delta) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    tokenCount: increment(delta),
    updatedAt: serverTimestamp()
  });
};
