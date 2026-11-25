import { useEffect, useState } from 'react';

const STORAGE_KEY = 'petCare.selectedPetId';

export default function useLocalPetId(defaultValue = '') {
  const [petId, setPetId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (!petId) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, petId);
    } catch {
      // Ignore storage failures in restricted environments.
    }
  }, [petId]);

  return [petId, setPetId];
}
