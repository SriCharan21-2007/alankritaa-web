import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, isConfigured } from './config';

/**
 * Fetches services from Firestore sorted by displayOrder.
 * @returns {Promise<Array>} Array of service documents.
 */
export const getServices = async () => {
  if (!isConfigured) {
    console.warn("Firebase not configured. Returning empty services list.");
    return [];
  }

  try {
    const q = query(
      collection(db, 'services'),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
