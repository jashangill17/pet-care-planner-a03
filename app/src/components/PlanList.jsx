import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { usePlans } from '../hooks/usePlans.js';

export default function PlanList() {
  const { plans, loading, error, fetchPlans } = usePlans();

  // Load the plans once when the list first renders
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <section aria-label="Plan list" className="space-y-3">
      <h2 className="text-xl font-semibold">Care Plans</h2>

      {loading && (
        <p className="flex items-center gap-2">
          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          Loading plans...
        </p>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
          <button type="button" className="btn btn-sm" onClick={fetchPlans}>
            Try again
          </button>
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
