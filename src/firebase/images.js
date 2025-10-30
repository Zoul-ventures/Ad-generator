import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './client.js';

const dataUrlPattern = /^data:(?<mime>.+?);base64,/;

const inferExtension = (mimeType = '') => {
  if (!mimeType) {
    return 'png';
  }
  const normalized = mimeType.toLowerCase();
  if (normalized.includes('png')) {
    return 'png';
  }
  if (normalized.includes('jpeg') || normalized.includes('jpg')) {
    return 'jpg';
  }
  if (normalized.includes('webp')) {
    return 'webp';
  }
  return 'png';
};

const fetchBlob = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  return response.blob();
};

export const persistGeneratedImage = async ({
  userId,
  title,
  prompt,
  imageDataUrl,
  externalUrl,
  metadata = {}
}) => {
  if (!userId) {
    throw new Error('persistGeneratedImage: userId is required.');
  }

  const generatedRef = collection(db, 'users', userId, 'generatedImages');
  let storagePath = null;
  let downloadUrl = null;

  try {
    if (imageDataUrl) {
      const match = imageDataUrl.match(dataUrlPattern);
      const extension = inferExtension(match?.groups?.mime);
      const objectRef = ref(storage, `users/${userId}/generated/${Date.now()}.${extension}`);
      await uploadString(objectRef, imageDataUrl, 'data_url');
      downloadUrl = await getDownloadURL(objectRef);
      storagePath = objectRef.fullPath;
    } else if (externalUrl) {
      try {
        const blob = await fetchBlob(externalUrl);
        const extension = inferExtension(blob.type);
        const objectRef = ref(storage, `users/${userId}/generated/${Date.now()}.${extension}`);
        await uploadBytes(objectRef, blob);
        downloadUrl = await getDownloadURL(objectRef);
        storagePath = objectRef.fullPath;
      } catch (fetchError) {
        console.warn('Failed to mirror external image into Firebase Storage, using source URL.', fetchError);
      }
    }
  } catch (uploadError) {
    console.warn('Error while uploading generated image to Firebase Storage.', uploadError);
  }

  const docRef = await addDoc(generatedRef, {
    title: title || 'Generated creative',
    prompt: prompt || '',
    imageUrl: downloadUrl || externalUrl || '',
    storagePath: storagePath || null,
    sourceUrl: externalUrl || null,
    meta: metadata,
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, imageUrl: downloadUrl || externalUrl || '', storagePath };
};

export const listenToGeneratedImages = (userId, callback, options = {}) => {
  if (!userId) {
    return () => {};
  }

  const { limitTo = 10 } = options;
  const generatedRef = collection(db, 'users', userId, 'generatedImages');
  const q = query(generatedRef, orderBy('createdAt', 'desc'), limit(limitTo));

  return onSnapshot(q, callback);
};
