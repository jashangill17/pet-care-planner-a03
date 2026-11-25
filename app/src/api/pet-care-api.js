const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const normalizeUrl = (value) => {
  if (!value) {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${API_URL}${value}`;
  }

  return `${API_URL}/${value}`;
};

const parseResponse = async (response, fallbackMessage) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.error || fallbackMessage || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export const fetchPets = async () => {
  try {
    const response = await fetch(`${API_URL}/pets`);
    const data = await parseResponse(response, 'Failed to fetch pets');
    return (data.pets || []).map((pet) => ({
      ...pet,
      avatarUrl: normalizeUrl(pet.avatarUrl),
    }));
  } catch (error) {
    throw new Error(`Error fetching pets: ${error.message}`);
  }
};

export const fetchTasksForPet = async (petId) => {
  try {
    const response = await fetch(`${API_URL}/pets/${petId}/tasks`);
    const data = await parseResponse(response, 'Failed to fetch tasks');
    return data.tasks || [];
  } catch (error) {
    throw new Error(`Error fetching tasks: ${error.message}`);
  }
};

export const fetchLogsForPet = async (petId) => {
  try {
    const response = await fetch(`${API_URL}/pets/${petId}/logs`);
    const data = await parseResponse(response, 'Failed to fetch logs');
    return data.logs || [];
  } catch (error) {
    throw new Error(`Error fetching logs: ${error.message}`);
  }
};

export const createCareLogEntry = async (petId, payload) => {
  try {
    const response = await fetch(`${API_URL}/pets/${petId}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(
      response,
      'Failed to create care log entry',
    );
    return data.log;
  } catch (error) {
    throw new Error(`Error creating care log entry: ${error.message}`);
  }
};
