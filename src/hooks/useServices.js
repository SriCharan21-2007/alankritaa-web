import { useState, useEffect } from 'react';
import { servicesData } from '../utils/staticData';

/**
 * Custom hook to load and manage services data.
 * Leverages local static data rather than Firestore.
 * 
 * @returns {Object} React states: { services, loading, error }
 */
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate minor latency
    const timer = setTimeout(() => {
      setServices(servicesData);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { services, loading, error };
};

