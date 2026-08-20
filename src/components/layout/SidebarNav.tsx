import { LayoutDashboard, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
];

export const SidebarNav = () => {
  const location = useLocation();

  return (
    <aside className="w-full shrink-0 border-b md:w-44 md:border-b-0 md:border-r bg-background">
      <nav className="flex gap-1 overflow-x-auto py-3 md:sticky md:top-20 md:flex-col md:p-4">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-smooth ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
