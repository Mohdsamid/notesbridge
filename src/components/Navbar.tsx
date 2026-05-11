import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Upload, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out");
    navigate("/");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm transition-smooth ${
      isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
    } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-gradient-hero after:transition-all after:duration-300 ${
      isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5 transition-spring">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-glow transition-spring group-hover:rotate-6 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-gradient-hero opacity-0 blur-md transition-smooth group-hover:opacity-60" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Notes<span className="text-gradient">Bridge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/notes" className={linkCls}>Browse</NavLink>
          <NavLink to="/upload" className={linkCls}>Upload</NavLink>
          {user && <NavLink to="/profile" className={linkCls}>Profile</NavLink>}
          <NavLink to="/about" className={linkCls}>About</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hidden sm:inline-flex">
                <UserIcon className="mr-1.5 h-4 w-4" /> Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                <LogOut className="mr-1.5 h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="hidden sm:inline-flex">
              <LogIn className="mr-1.5 h-4 w-4" /> Login
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => navigate("/upload")}
            className="bg-gradient-hero text-primary-foreground shadow-soft transition-spring hover:shadow-glow hover:-translate-y-0.5"
          >
            <Upload className="mr-1.5 h-4 w-4" /> Share
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
