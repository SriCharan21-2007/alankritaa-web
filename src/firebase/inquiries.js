import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from './config';

/**
 * Saves a new booking inquiry to the Firestore database.
 * @param {Object} inquiryData - The raw inquiry details from the contact form.
 * @param {string} inquiryData.name - Full name.
 * @param {string} inquiryData.phone - Phone number.
 * @param {string} inquiryData.eventDate - Date of event (formatted).
 * @param {string} inquiryData.serviceType - Selected service from the dropdown.
 * @param {string} inquiryData.message - Text details.
 * @returns {Promise<Object>} Object containing the saved document ID.
 */
export const createInquiry = async (inquiryData) => {
  if (!isConfigured) {
    console.warn("Firebase is not fully configured. Mocking database write operation.");
    const newInq = {
      id: 'mock-inquiry-' + Date.now(),
      name: inquiryData.name,
      phone: inquiryData.phone,
      eventDate: inquiryData.eventDate,
      serviceType: inquiryData.serviceType,
      message: inquiryData.message,
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };

    const stored = localStorage.getItem('mock_inquiries');
    const list = stored ? JSON.parse(stored) : [];
    const updated = [newInq, ...list];
    localStorage.setItem('mock_inquiries', JSON.stringify(updated));

    // Dispatch custom event for real-time dashboard updates
    window.dispatchEvent(new CustomEvent('inquiry-submitted', { detail: newInq }));
    return { id: newInq.id };
  }

  try {
    const inquiriesRef = collection(db, 'inquiries');
    const docRef = await addDoc(inquiriesRef, {
      name: inquiryData.name,
      phone: inquiryData.phone,
      eventDate: inquiryData.eventDate,
      serviceType: inquiryData.serviceType,
      message: inquiryData.message,
      submittedAt: serverTimestamp(),
      status: 'Pending' // Default status
    });

    return { id: docRef.id };
  } catch (error) {
    console.error("Error writing inquiry to database:", error);
    throw error;
  }
};
