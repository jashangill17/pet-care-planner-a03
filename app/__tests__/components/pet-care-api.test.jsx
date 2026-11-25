import { afterEach, describe, expect, test, vi } from 'vitest';

const loadApiModule = async () => {
  vi.resetModules();
  return import('../../src/api/pet-care-api.js');
};

describe('Pet Care API Module (React)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('1) fetchPets should use VITE_API_URL (port 3000), not a hardcoded URL', async () => {
    const { fetchPets } = await loadApiModule();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pets: [] }),
      text: async () => '',
    });

    await fetchPets();

    expect(fetch).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetch.mock.calls[0][0]);
    expect(calledUrl).toContain('http://localhost:3000/pets');
  });

  test('2) fetchPets should normalize relative avatarUrl to absolute using API base', async () => {
    const { fetchPets } = await loadApiModule();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pets: [{ id: 'pet-1', name: 'Mochi', avatarUrl: '/images/pet-1-mochi.jpg' }] }),
      text: async () => '',
    });

    const pets = await fetchPets();
    expect(pets[0].avatarUrl).toBe('http://localhost:3000/images/pet-1-mochi.jpg');
  });
});
