import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import TaskList from '../../src/components/TaskList.jsx';

test('1) prompts when no pet selected', async () => {
  const { getByText } = await render(
    <TaskList pet={null} tasks={[]} loading={false} error="" onCompleteTask={() => {}} />,
  );
  await expect.element(getByText('Select a pet to see tasks.')).toBeInTheDocument();
});

test('2) renders tasks and calls complete handler', async () => {
  const onCompleteTask = vi.fn();
  const { getByText } = await render(
    <TaskList
      pet={{ id: 'pet-1', name: 'Mochi' }}
      tasks={[{ id: 'task-1', title: 'Feed', frequency: 'daily' }]}
      loading={false}
      error=""
      onCompleteTask={onCompleteTask}
    />,
  );

  await expect.element(getByText('Feed')).toBeInTheDocument();
  await getByText('Complete').click();
  expect(onCompleteTask).toHaveBeenCalledWith('task-1');
});

