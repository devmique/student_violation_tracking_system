import { Search,  LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import logo from "@/assets/DON-BOSCO-COLLEGE-LOGO.png"

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}
const handleLogout = () =>{
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"
}
const storedUser = localStorage.getItem("user");
const currentUser = storedUser ? JSON.parse(storedUser) : { username: "Guest" };


export const Header = ({ onSearch, searchQuery }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img src={logo} alt="logo" />
      
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DBC Violation Tracker</h1>
                <p className="text-sm text-muted-foreground">Academic Tracking System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative">
             
        
            </Button>
            
            <ThemeToggle />
            
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2 pl-3 border-l">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                    <DropdownMenuContent>
              
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                     
                    </DropdownMenuContent>
                  </DropdownMenu>
                </User>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">Vice Dean of Student Affairs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};