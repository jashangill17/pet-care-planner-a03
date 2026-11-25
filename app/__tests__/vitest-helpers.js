import { vi } from 'vitest';

export async function mockPetCareFetch({ delay = 0, status = 200, callback } = {}) {
  const mockPets = {
    pets: [
      { id: 'pet-1', name: 'Mochi', species: 'dog', breed: 'Shiba Inu', avatarUrl: '/images/pet-1-mochi.jpg' },
      { id: 'pet-2', name: 'Luna', species: 'cat', breed: 'DSH', avatarUrl: '/images/pet-2-luna.jpg' },
    ],
  };

  const mockTasks = {
    tasks: [
      { id: 'task-1', petId: 'pet-1', title: 'Feed', frequency: 'daily' },
      { id: 'task-2', petId: 'pet-1', title: 'Water', frequency: 'daily' },
    ],
  };

  const mockLogs = {
    logs: [
      { id: 'log-1', petId: 'pet-1', taskId: 'task-1', completedAt: '2026-01-01T00:00:00.000Z', note: '' },
    ],
  };

  const originalFetch = globalThis.fetch;

  const mockFetch = vi.fn(async (input, init) => {
    globalThis.fetch = originalFetch;
    if (callback) callback(input, init);

    const url = typeof input === 'string' ? input : input?.url;
    if (!url) return { ok: false, status: 404, json: async () => ({}) };

    const sleep = delay > 0 ? new Promise((r) => setTimeout(r, delay)) : null;
    if (sleep) await sleep;

    if (url.includes('/pets') && !url.includes('/tasks') && !url.includes('/logs')) {
      return {
        ok: status >= 200 && status < 300 ? 'ok' : false,
        status,
        json: async () => mockPets,
        text: async () => JSON.stringify(mockPets),
      };
    }

    if (url.includes('/pets/pet-1/tasks')) {
      return {
        ok: status >= 200 && status < 300 ? 'ok' : false,
        status,
        json: async () => mockTasks,
        text: async () => JSON.stringify(mockTasks),
      };
    }

    if (url.includes('/pets/pet-1/logs') && (!init || init.method === 'GET' || !init.method)) {
      return {
        ok: status >= 200 && status < 300 ? 'ok' : false,
        status,
        json: async () => mockLogs,
        text: async () => JSON.stringify(mockLogs),
      };
    }

    if (url.includes('/pets/pet-1/logs') && init && init.method === 'POST') {
      const created = {
        log: { id: 'log-2', petId: 'pet-1', taskId: 'task-2', completedAt: '2026-01-02T00:00:00.000Z', note: '' },
      };
      return {
        ok: status >= 200 && status < 300 ? 'ok' : false,
        status,
        json: async () => created,
        text: async () => JSON.stringify(created),
      };
    }

    return { ok: false, status: 404, json: async () => ({}) };
  });

  globalThis.fetch = mockFetch;
}

