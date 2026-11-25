import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import PetPicker from '../../src/components/PetPicker.jsx';

test('1) renders pet picker container', async () => {
  const { getByTestId } = await render(
    <PetPicker pets={[]} loading={false} error="" value="" onChange={() => {}} />,
  );
  await expect.element(getByTestId('pet-picker')).toBeInTheDocument();
});

test('2) renders pet cards and click selects pet', async () => {
  const onChange = vi.fn();
  const { getByRole, getByText } = await render(
    <PetPicker
      pets={[
        { id: 'pet-1', name: 'Mochi', species: 'dog', breed: 'Shiba Inu' },
        { id: 'pet-2', name: 'Luna', species: 'cat', breed: 'DSH' },
      ]}
      loading={false}
      error=""
      value=""
      onChange={onChange}
    />,
  );

  await expect.element(getByText('Mochi')).toBeInTheDocument();
  await expect.element(getByText('Luna')).toBeInTheDocument();

  await getByRole('button', { name: /Luna/i }).click();
  expect(onChange).toHaveBeenCalledWith('pet-2');
});
