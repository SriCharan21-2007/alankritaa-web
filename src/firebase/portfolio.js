import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, isConfigured } from './config';

/**
 * Fetches portfolio items from Firestore filtered by category and sorted by displayOrder.
 * @param {string} category - The category to filter by ('mehendi' | 'saree').
 * @returns {Promise<Array>} Array of portfolio documents.
 */
export const getPortfolioItems = async (category) => {
  if (!isConfigured) {
    console.warn("Firebase not configured. Returning empty portfolio list.");
    return [];
  }

  try {
    const q = query(
      collection(db, 'portfolio_items'),
      where('category', '==', category),
      orderBy('displayOrder', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    throw error;
  }
};
