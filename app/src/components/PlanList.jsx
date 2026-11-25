import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { fetchPlans } from '../api/pet-care-api.js';

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlans();
        if (active) {
          setPlans(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load plans');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-label="Plan list" className="space-y-3">
      <h2 className="text-xl font-semibold">Care Plans</h2>

      {loading && <p>Loading plans...</p>}

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && plans.length === 0 && <p>No plans available.</p>}

      {!loading && !error && plans.length > 0 && (
        <ul className="menu w-full gap-1 rounded-box border border-base-300 bg-base-100 p-2">
          {plans.map((plan) => (
            <li key={plan.id}>
              {/* NavLink highlights the plan whose detail is open */}
              <NavLink
                to={`/plans/${plan.id}`}
                className={({ isActive }) => (isActive ? 'menu-active' : '')}
              >
                {plan.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
