import { useEffect, useMemo, useState } from 'react';
import { fetchLogsForPet } from '../api/pet-care-api.js';

export default function CareLog({
  pet = null,
  logs: logsProp,
  loading: loadingProp,
  error: errorProp,
  onRefresh,
  refreshKey = 0,
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const useExternalLogs = Array.isArray(logsProp);

  useEffect(() => {
    if (!pet || useExternalLogs) {
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchLogsForPet(pet.id);
        if (!active) {
          return;
        }
        setLogs(data);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err.message || 'Failed to load care logs');
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
  }, [pet, useExternalLogs, refreshKey]);

  const renderedLogs = useExternalLogs ? logsProp : logs;
  const renderedLoading = useExternalLogs ? Boolean(loadingProp) : loading;
  const renderedError = useExternalLogs ? errorProp : error;

  const hasLogs = useMemo(() => renderedLogs.length > 0, [renderedLogs]);

  if (!pet) {
    return (
      <section aria-label="Care log" data-testid="care-log">
        <h2 className="text-xl font-semibold">Recent Care Log</h2>
        <p>Select a pet to see the care log.</p>
      </section>
    );
  }

  return (
    <section aria-label="Care log" data-testid="care-log" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Recent Care Log</h2>
        {onRefresh ? (
          <button type="button" className="btn btn-outline btn-xs" onClick={onRefresh}>
            Refresh
          </button>
        ) : null}
      </div>
      {renderedLoading && <p>Loading care logs...</p>}
      {renderedError && (
        <div role="alert" className="alert alert-error">
          <span>{renderedError}</span>
        </div>
      )}
      {!renderedLoading && !renderedError && !hasLogs && <p>No care logged yet.</p>}
      {!renderedLoading && !renderedError && hasLogs && (
        <ul className="list rounded-box border border-base-300 bg-base-100">
          {renderedLogs.map((log) => (
            <li key={log.id} className="list-row px-4 py-3">
              <p className="font-semibold">
                {new Date(log.completedAt).toLocaleString()}
              </p>
              <p className="text-sm opacity-80">Task: {log.taskId}</p>
              {log.note ? <p className="text-sm">{log.note}</p> : null}
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm opacity-80">Viewing log for: {pet.name}</p>
    </section>
  );
}
