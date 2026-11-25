import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { MemoryRouter } from 'react-router-dom';

import App from '../../src/App.jsx';

test('1) should contain Pet Care Planner title', async () => {
  const { getByText } = await render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  await expect.element(getByText('Pet Care Planner')).toBeInTheDocument();
});
