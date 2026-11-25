import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Dashboard from '../../src/components/Dashboard.jsx';

test('1) renders dashboard container', async () => {
  const { getByTestId } = await render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
  await expect.element(getByTestId('pet-care-dashboard')).toBeInTheDocument();
});

test('2) renders Pets and Plans nav links and outlet content', async () => {
  const { getByRole, getByText } = await render(
    <MemoryRouter initialEntries={['/plans']}>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="plans" element={<p>Plans page outlet</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  await expect.element(getByRole('link', { name: 'Pets' })).toBeInTheDocument();
  await expect.element(getByRole('link', { name: 'Plans' })).toBeInTheDocument();
  await expect.element(getByRole('link', { name: 'Pets' })).toHaveAttribute('href', '/pets');
  await expect.element(getByText('Plans page outlet')).toBeInTheDocument();
});
