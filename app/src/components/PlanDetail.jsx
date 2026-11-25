import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePlans } from '../hooks/usePlans.js';

export default function PlanDetail() {
  // :id comes from the /plans/:id route
  const { id } = useParams();
  const { loading, error, fetchPlanById } = usePlans();

  const [plan, setPlan] = useState(null);
  // Bumping this number re-runs the effect (used by "Try again")
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    fetchPlanById(id).then((data) => {
      // Ignore a slow response if the user has already clicked another plan
      if (active) {
        setPlan(data);
      }
    });

    return () => {
      active = false;
    };
  }, [id, attempt, fetchPlanById]);

  if (loading) {
    return (
      <p className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm" aria-hidden="true" />
        Loading plan...
      </p>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>{error}</span>
        <button type="button" className="btn btn-sm" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
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
