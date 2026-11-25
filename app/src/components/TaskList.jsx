import { useEffect, useState } from 'react';
import { createCareLogEntry, fetchTasksForPet } from '../api/pet-care-api.js';

export default function TaskList({
  pet = null,
  tasks: tasksProp,
  loading: loadingProp,
  error: errorProp,
  onCompleteTask,
  refreshKey = 0,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingTaskId, setPendingTaskId] = useState('');

  const useExternalTasks = Array.isArray(tasksProp);

  useEffect(() => {
    if (!pet || useExternalTasks) {
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchTasksForPet(pet.id);
        if (!active) {
          return;
        }
        setTasks(data);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err.message || 'Failed to load tasks');
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
  }, [pet, useExternalTasks, refreshKey]);

  const renderedTasks = useExternalTasks ? tasksProp : tasks;
  const renderedLoading = useExternalTasks ? Boolean(loadingProp) : loading;
  const renderedError = useExternalTasks ? errorProp : error;

  const completeTask = async (taskId) => {
    if (!pet) {
      return;
    }

    setPendingTaskId(taskId);
    try {
      if (!useExternalTasks) {
        await createCareLogEntry(pet.id, { taskId });
      }
      onCompleteTask?.(taskId);
    } catch (err) {
      setError(err.message || 'Failed to complete task');
    } finally {
      setPendingTaskId('');
    }
  };

  if (!pet) {
    return (
      <section aria-label="Task list" data-testid="task-list">
        <h2 className="text-xl font-semibold">Care Tasks</h2>
        <p>Select a pet to see tasks.</p>
      </section>
    );
  }

  return (
    <section aria-label="Task list" data-testid="task-list" className="space-y-3">
      <h2 className="text-xl font-semibold">Care Tasks</h2>
      {renderedLoading && <p>Loading tasks...</p>}
      {renderedError && (
        <div role="alert" className="alert alert-error">
          <span>{renderedError}</span>
        </div>
      )}
      {!renderedLoading && !renderedError && !renderedTasks.length && (
        <p>No care tasks found for this pet.</p>
      )}
      {!renderedLoading && !renderedError && renderedTasks.length > 0 && (
        <div className="space-y-2">
          {renderedTasks.map((task) => (
            <article key={task.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="card-title text-base">{task.title}</h3>
                  <p className="text-sm opacity-75">Due: {task.dueTime || 'N/A'}</p>
                  {task.notes ? <p className="text-sm">{task.notes}</p> : null}
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => completeTask(task.id)}
                  disabled={pendingTaskId === task.id}
                >
                  {pendingTaskId === task.id ? 'Saving...' : 'Complete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {pendingTaskId ? (
        <p className="text-sm opacity-80">Completing task...</p>
      ) : null}
      {pet ? (
        <p className="text-sm opacity-80">Viewing tasks for: {pet.name}</p>
      ) : null}
    </section>
  );
}
