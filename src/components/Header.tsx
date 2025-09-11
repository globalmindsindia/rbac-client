import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/auth/auth";
import { useNavigate } from "react-router-dom";
import { getApi } from "@/api/api";
import StudentDashboardHeader from "./student/StudentDashboardHeader";

const Header = () => {
  const { logout, user } = useAuth(); // get user from auth context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await getApi().post("/v1/users/logout", {}, { withCredentials: true });
      logout(); // clear frontend state
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 h-12 xs:h-14 sm:h-16 flex items-center justify-between">
        {/* Left side: StudentDashboardHeader */}
        <div className="flex flex-1 justify-start pl-0">
          <StudentDashboardHeader studentName={user ? `${user.firstName} ${user.lastName}` : "Student"} />
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs xs:text-sm sm:text-base px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5"
        >
          <LogOut className="h-3 xs:h-4 w-3 xs:w-4" />
          <span className="hidden xs:inline">Logout</span>
          <span className="inline xs:hidden">Log Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;