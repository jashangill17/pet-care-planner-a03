import { expect, test } from 'playwright/test';

const pets = [
  {
    id: 'pet-1',
    name: 'Mochi',
    species: 'dog',
    breed: 'Shiba Inu',
    avatarUrl: '/images/pet-1-mochi.jpg',
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Domestic Shorthair',
    avatarUrl: '/images/pet-2-luna.jpg',
  },
];

const tasksByPet = {
  'pet-1': [
    { id: 'task-1', petId: 'pet-1', title: 'Morning feed', dueTime: '08:00', notes: '1 cup kibble' },
  ],
  'pet-2': [
    { id: 'task-3', petId: 'pet-2', title: 'Refresh water', dueTime: '09:00', notes: 'Clean bowl first' },
  ],
};

const plans = [
  { id: 'plan-1', title: 'Daily Routine', description: 'Standard weekday routine' },
  { id: 'plan-2', title: 'Weekly Grooming', description: 'Coat and hygiene maintenance' },
];

const planDetailById = {
  'plan-1': {
    id: 'plan-1',
    title: 'Daily Routine',
    description: 'Standard weekday routine',
    tasks: [{ id: 'task-1', title: 'Morning feed', dueTime: '08:00', notes: '1 cup kibble' }],
  },
  'plan-2': {
    id: 'plan-2',
    title: 'Weekly Grooming',
    description: 'Coat and hygiene maintenance',
    tasks: [],
  },
};

test('assignment 3 flow: pet route params plus plans navigation', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });

  await page.route('**/pets', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { status: 'ok', pets },
    });
  });

  await page.route('**/pets/*/tasks', async (route) => {
    const url = new URL(route.request().url());
    const parts = url.pathname.split('/');
    const petId = parts[2];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { status: 'ok', tasks: tasksByPet[petId] || [] },
    });
  });

  await page.route('**/pets/*/logs', async (route) => {
    const req = route.request();
    if (req.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: {
          status: 'ok',
          log: {
            id: 'log-1',
            petId: 'pet-1',
            taskId: 'task-1',
            completedAt: '2026-01-01T09:00:00.000Z',
            note: '',
          },
        },
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { status: 'ok', logs: [] },
    });
  });

  await page.route('**/plans', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { status: 'ok', plans },
    });
  });

  await page.route('**/plans/*', async (route) => {
    const url = new URL(route.request().url());
    const id = url.pathname.split('/')[2];
    const plan = planDetailById[id];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: { status: 'ok', plan },
    });
  });

  await page.goto('/pets/pet-1');

  await expect(page.getByTestId('pet-care-dashboard')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pets' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Plans' })).toBeVisible();

  // Pets route param controls selected pet data.
  await expect(page.getByTestId('pet-picker')).toBeVisible();
  await expect(page.getByTestId('task-list')).toContainText('Morning feed');

  // Clicking a pet updates the bookmarkable URL.
  await page.getByTestId('pet-picker').getByRole('button', { name: /Luna/i }).click();
  await expect(page).toHaveURL(/\/pets\/pet-2$/);
  await expect(page.getByTestId('task-list')).toContainText('Refresh water');

  // Navigate to Plans and verify list + detail flow.
  await page.getByRole('link', { name: 'Plans' }).click();
  await expect(page.getByText('Daily Routine')).toBeVisible();
  await expect(page.getByText('Weekly Grooming')).toBeVisible();

  await page.getByRole('link', { name: 'Daily Routine' }).click();
  await expect(page.getByRole('heading', { name: 'Daily Routine' })).toBeVisible();
  await expect(page.getByText('Due: 08:00')).toBeVisible();
});
