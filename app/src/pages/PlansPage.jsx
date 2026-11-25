import { Outlet, useParams } from 'react-router-dom';

import PlanList from '../components/PlanList.jsx';

export default function PlansPage() {
  const { id } = useParams();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
      <aside className="sm:col-span-4">
        <PlanList />
      </aside>
      <section className="rounded-box bg-base-200 p-3 sm:col-span-8">
        {/* The plan detail route (/plans/:id) renders here */}
        <Outlet />
        {!id && <p className="opacity-75">Select a plan to see its tasks.</p>}
      </section>
    </div>
  );
}
