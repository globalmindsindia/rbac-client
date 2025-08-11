import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import companyLogo from "@/assets/gmi_logo.png";
import { useAuth } from "@/auth/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { logout } = useAuth(); // ✅ use it here (top-level)
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ Now safe to use
    console.log("User logged out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
