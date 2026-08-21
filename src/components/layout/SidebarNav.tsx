import { LayoutDashboard, Users, User, UsersRound, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mainItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
];

const handleLogout = () => {
  if (!window.confirm("Are you sure you want to logout?")) return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const SidebarNav = () => {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser?.role === "admin";

  const accountItems = [
    { to: "/accounts/profile", label: "Profile", icon: User },
    ...(isAdmin ? [{ to: "/accounts/users", label: "Manage Accounts", icon: UsersRound }] : []),
  ];

  const linkClass = (to: string) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-smooth ${
      location.pathname === to
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`;

  return (
    <aside className="w-full shrink-0 border-b md:w-52 md:border-b-0 md:border-r bg-background">
      <nav className="flex gap-1 overflow-x-auto py-3 md:sticky md:top-20 md:flex-col md:p-4 md:min-h-[calc(100vh-6rem)]">
        {mainItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-current={location.pathname === to ? "page" : undefined}
            className={linkClass(to)}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        <p className="hidden md:block px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accounts
        </p>

        {accountItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-current={location.pathname === to ? "page" : undefined}
            className={linkClass(to)}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-smooth hover:text-foreground hover:bg-accent md:mt-auto"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </nav>
    </aside>
  );
};
