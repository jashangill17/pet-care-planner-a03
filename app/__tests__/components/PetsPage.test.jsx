import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const taskListSpy = vi.fn();

vi.mock('../../src/components/PetPicker.jsx', () => ({
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange?.('pet-2')}>
      Pick pet-2
    </button>
  ),
}));

vi.mock('../../src/components/TaskList.jsx', () => ({
  default: ({ pet }) => {
    taskListSpy(pet);
    return <div data-testid="task-list">Task list for {pet?.id || 'none'}</div>;
  },
}));

vi.mock('../../src/components/CareLog.jsx', () => ({
  default: ({ pet }) => <div data-testid="care-log">Care log for {pet?.id || 'none'}</div>,
}));

import PetsPage from '../../src/pages/PetsPage.jsx';

test('1) route param petId drives selected pet state', async () => {
  taskListSpy.mockClear();
  const { getByTestId } = await render(
    <MemoryRouter initialEntries={['/pets/pet-1']}>
      <Routes>
        <Route path="/pets/:petId" element={<PetsPage />} />
      </Routes>
    </MemoryRouter>,
  );

  await expect.element(getByTestId('task-list')).toHaveTextContent('Task list for pet-1');
});

test('2) selecting a pet updates URL route param', async () => {
  const { getByRole, getByTestId } = await render(
    <MemoryRouter initialEntries={['/pets/pet-1']}>
      <Routes>
        <Route path="/pets/:petId" element={<PetsPage />} />
      </Routes>
    </MemoryRouter>,
  );

  await getByRole('button', { name: 'Pick pet-2' }).click();
  await expect.element(getByTestId('task-list')).toHaveTextContent('Task list for pet-2');
});
