import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import logoImage from "@assets/Gemini_Generated_Image_d86gqtd86gqtd86g_1761457022206.png";

export function Header() {
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src={logoImage} alt="CertAi Logo" className="h-12 md:h-14 w-12 md:w-14 rounded-full object-cover mr-3 bg-white" />
              <div>
                <h1 className="font-bold text-lg md:text-xl text-secondary">CertAi</h1>
                <p className="text-sm text-neutral-600 hidden md:block">Simplifying Certificates & Citizen Services</p>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-neutral-700 hover:text-primary ${location === "/" ? "text-primary font-medium" : ""}`}>
              Home
            </Link>
            <Link href="/apply" className={`text-neutral-700 hover:text-primary ${location.startsWith("/apply") ? "text-primary font-medium" : ""}`}>
              Apply
            </Link>
            <Link href="/track" className={`text-neutral-700 hover:text-primary ${location.startsWith("/track") ? "text-primary font-medium" : ""}`}>
              Track
            </Link>
            <Link href="/certificates" className={`text-neutral-700 hover:text-primary ${location.startsWith("/certificates") ? "text-primary font-medium" : ""}`}>
              Certificates
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/certificates">
                    <DropdownMenuItem className="cursor-pointer">My Certificates</DropdownMenuItem>
                  </Link>
                  <Link href="/applications">
                    <DropdownMenuItem className="cursor-pointer">My Applications</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth">Login / Register</Link>
              </Button>
            )}
          </div>
          
          <button 
            className="md:hidden text-neutral-700"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <i className={`fas ${mobileNavOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`bg-white shadow-sm md:hidden ${mobileNavOpen ? 'block' : 'hidden'}`} id="mobileNav">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col space-y-3">
            <Link href="/" className={`text-neutral-700 hover:text-primary py-2 ${location === "/" ? "text-primary font-medium" : ""}`}>
              Home
            </Link>
            <Link href="/apply" className={`text-neutral-700 hover:text-primary py-2 ${location.startsWith("/apply") ? "text-primary font-medium" : ""}`}>
              Apply
            </Link>
            <Link href="/track" className={`text-neutral-700 hover:text-primary py-2 ${location.startsWith("/track") ? "text-primary font-medium" : ""}`}>
              Track
            </Link>
            <Link href="/certificates" className={`text-neutral-700 hover:text-primary py-2 ${location.startsWith("/certificates") ? "text-primary font-medium" : ""}`}>
              Certificates
            </Link>
            
            {user ? (
              <>
                <div className="py-2 border-t border-neutral-200 mt-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                </div>
                <Link href="/profile" className="text-neutral-700 hover:text-primary py-2">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-left text-neutral-700 hover:text-primary py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition text-center">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
