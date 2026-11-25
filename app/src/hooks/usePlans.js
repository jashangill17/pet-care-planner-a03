import { useCallback, useState } from 'react';

import { fetchPlan, fetchPlans as fetchAllPlans } from '../api/pet-care-api.js';

// Custom hook that keeps all the plans fetching logic in one place.
// Components only call fetchPlans() / fetchPlanById() and read the state.
export function usePlans() {
  const [plans, setPlans] = useState([]);
  // Starts as true because every component that uses this hook fetches on mount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetches all plans and stores them in `plans`
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllPlans();
      setPlans(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load plans');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches one plan (with its tasks) and returns it.
  // Memoized with useCallback so it can safely be a useEffect dependency.
  const fetchPlanById = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      return await fetchPlan(planId);
    } catch (err) {
      setError(err.message || 'Failed to load plan');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { plans, loading, error, fetchPlans, fetchPlanById };
}

export default usePlans;
