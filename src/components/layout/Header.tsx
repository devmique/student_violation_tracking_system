import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/DON-BOSCO-COLLEGE-LOGO.png"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Header = ({ onSearch, searchQuery }: HeaderProps) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : { username: "Guest", profilePic: "" };
  const profilePicUrl = currentUser.profilePic
    ? `${API_BASE.replace("/api", "")}${currentUser.profilePic}`
    : null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                aria-label="Go to home"
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.location.reload();
                  } else {
                    navigate("/");
                  }
                }}
              >
                <img src={logo} alt="Don Bosco College logo" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">DBC Violation Tracker</h1>
                <p className="text-sm text-muted-foreground">Academic Tracking System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students by name or ID..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 transition-smooth focus:shadow-medium"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <div className="flex items-center space-x-2 pl-3 border-l">
              <Link
                to="/accounts/profile"
                aria-label="Go to your profile"
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center gradient-primary hover:opacity-90 transition-opacity"
              >
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-primary-foreground" />
                )}
              </Link>

              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.role === "admin" ? "Administrator" : "Staff"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
