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
import { Sparkles, User, LogOut, Plus, Settings, Info, Home, MessageSquare } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onStartFresh?: () => void;
  showHomeButton?: boolean;
  onGoHome?: () => void;
  showNewStackButton?: boolean;
}

export const Header = ({ onStartFresh, showHomeButton, onGoHome, showNewStackButton = true }: HeaderProps) => {
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNewStack = () => {
    if (onStartFresh) {
      onStartFresh();
    } else {
      navigate("/welcome");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gradient">ZingGPT</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {showHomeButton && (
             <Button 
                onClick={onGoHome}
                variant="outline" 
                size="sm" 
                className="hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
            </Button>
          )}
          {showNewStackButton && (
            <Button 
              onClick={handleNewStack}
              variant="outline" 
              size="sm" 
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          )}

          {!isSupabaseConfigured ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Demo Mode</span>
              </div>
              <Button variant="outline" size="sm" disabled>
                Sign In
              </Button>
            </div>
          ) : user ? (
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
                  <span className="truncate">{user.email}</span>
                </DropdownMenuItem>
                {showNewStackButton && (
                  <DropdownMenuItem 
                    className="sm:hidden"
                    onClick={handleNewStack}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Conversation</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/conversations")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>My Conversations</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/stacks")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>My Stacks</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
