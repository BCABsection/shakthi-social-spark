
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  if (!currentUser) return null;
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container flex items-center justify-between h-16 max-w-screen-lg mx-auto px-4">
        <div className="hidden md:block">
          <Link to="/" className="text-xl font-bold tracking-tighter shakthi-gradient bg-clip-text text-transparent">
            Shakthi
          </Link>
        </div>
        
        <div className="flex items-center justify-around w-full md:w-auto md:justify-end md:space-x-6">
          <Link to="/" className={`${location.pathname === '/' ? 'text-shakthi-purple' : 'text-gray-600'}`}>
            <Home className="nav-icon" />
          </Link>
          <Link to="/explore" className={`${location.pathname === '/explore' ? 'text-shakthi-purple' : 'text-gray-600'}`}>
            <Search className="nav-icon" />
          </Link>
          <Link to="/create" className={`${location.pathname === '/create' ? 'text-shakthi-purple' : 'text-gray-600'}`}>
            <PlusSquare className="nav-icon" />
          </Link>
          <Link to="/activity" className={`${location.pathname === '/activity' ? 'text-shakthi-purple' : 'text-gray-600'}`}>
            <Heart className="nav-icon" />
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.profileImage} alt={currentUser.username} />
                  <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-500">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
