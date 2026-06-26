import { useState, useEffect } from 'react';
import { artistsData } from '../utils/staticData';

/**
 * Custom hook to load and manage artists data.
 * Leverages local static data rather than Firestore.
 * 
 * @returns {Object} React states: { artists, loading, error }
 */
export const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate minor latency
    const timer = setTimeout(() => {
      setArtists(artistsData);
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  return { artists, loading, error };
};

