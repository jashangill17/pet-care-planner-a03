import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import CareLog from '../../src/components/CareLog.jsx';

test('1) prompts when no pet selected', async () => {
  const { getByText } = await render(
    <CareLog pet={null} logs={[]} loading={false} error="" onRefresh={() => {}} />,
  );
  await expect.element(getByText('Select a pet to see the care log.')).toBeInTheDocument();
});

test('2) shows "No care logged yet" when selected pet has no logs', async () => {
  const { getByText } = await render(
    <CareLog pet={{ id: 'pet-1', name: 'Mochi' }} logs={[]} loading={false} error="" onRefresh={() => {}} />,
  );
  await expect.element(getByText('No care logged yet.')).toBeInTheDocument();
});

