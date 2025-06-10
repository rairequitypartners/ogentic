
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sparkles, User, LogOut, Folder, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  onStartFresh?: () => void;
}

export const Header = ({ onStartFresh }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNewStack = () => {
    if (onStartFresh) {
      onStartFresh();
    } else {
      // Navigate to fresh chat by adding URL param
      navigate("/?fresh=true");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={handleNewStack} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gradient">Ogentic</span>
        </button>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/discovery" className="text-foreground hover:text-primary transition-colors">
            Discovery
          </Link>
          <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
            Marketplace
          </Link>
          {user && (
            <>
              <Link to="/my-stacks" className="text-foreground hover:text-primary transition-colors">
                My Stacks
              </Link>
              <Link to="/settings" className="text-foreground hover:text-primary transition-colors">
                Settings
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* New Stack Button */}
          <Button 
            onClick={handleNewStack}
            variant="outline" 
            size="sm" 
            className="hidden sm:flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Stack
          </Button>

          {user ? (
            <>
              <Link to="/my-stacks">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Folder className="h-4 w-4 mr-2" />
                  My Stacks
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="sm:hidden"
                    onClick={handleNewStack}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Stack</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="sm:hidden"
                    onClick={() => navigate("/my-stacks")}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    <span>My Stacks</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
