import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchPlan } from '../api/pet-care-api.js';

export default function PlanDetail() {
  // :id comes from the /plans/:id route
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlan(id);
        if (active) {
          setPlan(data);
        }
      } catch (err) {
        if (active) {
          setPlan(null);
          setError(err.message || 'Failed to load plan');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    // Ignore a slow response if the user has already clicked another plan
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <p>Loading plan...</p>;
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  const tasks = plan.tasks || [];

  return (
    <article className="space-y-3">
      <div>
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        {plan.description ? <p className="opacity-75">{plan.description}</p> : null}
      </div>

      <h3 className="text-lg font-semibold">Tasks</h3>

      {tasks.length === 0 && <p>No tasks found for this plan.</p>}

      {tasks.length > 0 && (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title text-base">{task.title}</h4>
                <p className="text-sm opacity-75">Due: {task.dueTime || 'N/A'}</p>
                {task.notes ? <p className="text-sm">{task.notes}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
