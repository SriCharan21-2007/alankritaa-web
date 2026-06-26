import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isConfigured } from './config';

/**
 * Fetches artists from Firestore sorted by displayOrder.
 * @returns {Promise<Array>} Array of artist documents.
 */
export const getArtists = async () => {
  if (!isConfigured) {
    console.warn("Firebase not configured. Returning empty artists list.");
    return [];
  }

  try {
    const q = query(
      collection(db, 'artists'),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
};
