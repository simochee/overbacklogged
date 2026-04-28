import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen">
      <nav className="flex gap-4 border-b border-gray-200 px-4 py-3">
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 [&.active]:text-black [&.active]:font-bold"
        >
          Home
        </Link>
        <Link
          to="/spaces"
          className="text-sm font-medium text-gray-600 [&.active]:text-black [&.active]:font-bold"
        >
          Spaces
        </Link>
        <Link
          to="/about"
          className="text-sm font-medium text-gray-600 [&.active]:text-black [&.active]:font-bold"
        >
          About
        </Link>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
