import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, isConfigured } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin_auth') === 'true'
  );
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);

  // Authenticate login
  const login = async (email, password) => {
    if (email === 'admin@alankrita.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  // Sign out
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  // Set up inquiries loading
  useEffect(() => {
    let unsubscribe = () => {};

    if (isConfigured) {
      // Firebase Live mode
      try {
        const q = query(collection(db, 'inquiries'), orderBy('submittedAt', 'desc'));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // normalize timestamp if it's firestore timestamp
            submittedAt: doc.data().submittedAt?.toDate
              ? doc.data().submittedAt.toDate().toISOString()
              : doc.data().submittedAt || new Date().toISOString()
          }));
          setInquiries(items);
          setInquiriesLoading(false);
        }, (err) => {
          console.error("Firestore onSnapshot error:", err);
          loadMockInquiries();
        });
      } catch (e) {
        console.error("Firestore connection failed:", e);
        loadMockInquiries();
      }
    } else {
      // Mock mode
      loadMockInquiries();
    }

    function loadMockInquiries() {
      localStorage.removeItem('mock_inquiries_v3');
      const defaultInquiries = [];
      setInquiries(defaultInquiries);
      setInquiriesLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Listen to custom local submissions event (handles instant updates)
  useEffect(() => {
    const handleNewInquiry = (e) => {
      setInquiries(prev => {
        if (prev.some(inq => inq.id === e.detail.id)) return prev;
        const updated = [e.detail, ...prev];
        if (!isConfigured) {
          localStorage.setItem('mock_inquiries_v3', JSON.stringify(updated));
        }
        return updated;
      });
    };

    window.addEventListener('inquiry-submitted', handleNewInquiry);
    return () => window.removeEventListener('inquiry-submitted', handleNewInquiry);
  }, []);

  // Update enquiry status
  const updateInquiryStatus = async (id, newStatus) => {
    // Update local state first for immediate UI update
    setInquiries(prev => {
      const updated = prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
      if (!isConfigured) {
        localStorage.setItem('mock_inquiries_v3', JSON.stringify(updated));
      }
      return updated;
    });

    if (isConfigured) {
      try {
        const docRef = doc(db, 'inquiries', id);
        await updateDoc(docRef, { status: newStatus });
      } catch (err) {
        console.error("Firestore update error:", err);
      }
    }
  };

  // Update enquiry notes
  const updateInquiryNotes = async (id, notes) => {
    setInquiries(prev => {
      const updated = prev.map(inq => inq.id === id ? { ...inq, notes: notes } : inq);
      if (!isConfigured) {
        localStorage.setItem('mock_inquiries_v3', JSON.stringify(updated));
      }
      return updated;
    });

    if (isConfigured) {
      try {
        const docRef = doc(db, 'inquiries', id);
        await updateDoc(docRef, { notes: notes });
      } catch (err) {
        console.error("Firestore update notes error:", err);
      }
    }
  };

  // Delete enquiry
  const deleteInquiry = async (id) => {
    // Update local state first
    setInquiries(prev => {
      const updated = prev.filter(inq => inq.id !== id);
      if (!isConfigured) {
        localStorage.setItem('mock_inquiries_v3', JSON.stringify(updated));
      }
      return updated;
    });

    if (isConfigured) {
      try {
        const docRef = doc(db, 'inquiries', id);
        await deleteDoc(docRef);
      } catch (err) {
        console.error("Firestore delete error:", err);
      }
    }
  };

  // Helper to trigger dynamic simulated submission for visual tests
  const simulateIncomingEnquiry = () => {
    const names = ['Kiara Advani', 'Alia Bhatt', 'Deepika Padukone', 'Katrina Kaif'];
    const phones = ['9988776655', '9876543210', '9550123456', '9100998877'];
    const servicesList = ['Bridal Mehendi', 'Premium Saree Draping', 'Family & Guest Mehendi'];
    const messages = [
      'Hi, I would like to make a booking for my sangeet program in Gachibowli.',
      'Requesting a quote for premium Bengali style saree draping for 5 members.',
      'Intricate Arabic designs needed for hand and feet. Please get back with availability.'
    ];

    const randomVal = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const testInq = {
      id: 'mock-simulated-' + Date.now(),
      name: randomVal(names),
      phone: randomVal(phones),
      eventDate: new Date(Date.now() + 3600000 * 24 * 30).toISOString().split('T')[0], // 30 days from now
      serviceType: randomVal(servicesList),
      message: randomVal(messages),
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };

    const stored = localStorage.getItem('mock_inquiries_v3');
    const list = stored ? JSON.parse(stored) : [];
    const updated = [testInq, ...list];
    localStorage.setItem('mock_inquiries_v3', JSON.stringify(updated));

    // Dispatch event
    window.dispatchEvent(new CustomEvent('inquiry-submitted', { detail: testInq }));
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      inquiries,
      inquiriesLoading,
      updateInquiryStatus,
      updateInquiryNotes,
      deleteInquiry,
      isFirebaseActive: isConfigured,
      simulateIncomingEnquiry
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
