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
      // console.log("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side: StudentDashboardHeader */}
        <StudentDashboardHeader studentName={user ? `${user.firstName} ${user.lastName}` : "Student"} />

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
