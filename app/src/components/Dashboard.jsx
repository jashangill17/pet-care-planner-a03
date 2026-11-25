import { Link, NavLink, Outlet } from 'react-router-dom';

// Shared style for the nav links. NavLink tells us when its route is active,
// so the current page is highlighted (same idea as the Header in Lesson 17).
const navLinkClass = ({ isActive }) =>
  `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`;

export default function Dashboard() {
  return (
    <div
      data-testid="pet-care-dashboard"
      className="container mx-auto min-h-screen bg-base-200 px-4 py-4 sm:px-6"
    >
      <div className="rounded-box bg-base-100 shadow-sm">
        <header className="navbar flex-wrap gap-2 border-b border-base-300 px-4">
          <div className="flex-1">
            <Link to="/pets" className="text-xl font-semibold">
              Pet Care Planner
            </Link>
          </div>
          <nav aria-label="Main navigation" className="flex gap-2">
            <NavLink to="/pets" className={navLinkClass}>
              Pets
            </NavLink>
            <NavLink to="/plans" className={navLinkClass}>
              Plans
            </NavLink>
          </nav>
        </header>

        {/* The page that matches the current route renders here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
