import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRoles } from "@/roles/useRoles";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavBar = () => {
  const { user, signoutRedirect, signinRedirect, isAuthenticated } = useAuth();
  const { isOrganizer, isAttendee } = useRoles();

  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (isOrganizer) navigate("/organizers");
    else if (isAttendee) navigate("/");
    else navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-950/95 backdrop-blur-lg border-b border-gray-800 text-white sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex gap-12 items-center">
          <a
            href="#"
            onClick={handleBrandClick}
            className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            Ticketa
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex text-gray-300 gap-8">
            {isOrganizer && (
              <Link to="/dashboard/events" className="hover:text-cyan-400 transition-colors">
                Events
              </Link>
            )}
          </div>
        </div>

        {/* Authentication Actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Button onClick={() => signinRedirect()} className="hidden md:inline-flex">
              Log in
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar className="h-10 w-10 border border-cyan-400/50 shadow-md shadow-cyan-500/20 cursor-pointer">
                    <AvatarFallback className="bg-gray-800 text-cyan-300 font-bold">
                      {user?.profile?.preferred_username?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-60 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl shadow-cyan-500/10"
                align="end"
              >
                <DropdownMenuLabel className="font-normal space-y-1">
                  <p className="text-sm font-semibold text-cyan-300">
                    {user?.profile?.preferred_username || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.profile?.email || "No email"}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-700" />

                <DropdownMenuItem
                  className="hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                  onClick={() => signoutRedirect()}
                >
                  <LogOut className="h-4 w-4 text-red-400" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;
