import React, { createContext, useContext, useEffect, useState } from "react";

interface AppInfo {
  appId: string;
  appName: string;
  role: string;
  domainUrl?: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user?: UserInfo;
  selectedApp?: AppInfo;
  login: (payload: any) => void; // Accept raw payload (manual or Zoho)
  setSelectedApp: (app: AppInfo) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const MAX_SESSION_DURATION = 3 * 60 * 60 * 1000; // 3h in ms
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30m in ms

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserInfo | undefined>(undefined);
  const [selectedApp, setSelectedAppState] = useState<AppInfo | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUserState(undefined);
    setSelectedAppState(undefined);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedApp");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActivity");
  };

  // Normalize payload from any login source
  const normalizeAuthPayload = (
    payload: any
  ): { user: UserInfo; selectedApp?: AppInfo } => {
    if (payload.user && payload.app) {
      return { user: payload.user, selectedApp: payload.app };
    }

    if (payload.user) {
      const user: UserInfo = {
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        email: payload.user.email,
      };

      let selectedApp: AppInfo | undefined;
      if (payload.user.userRoles?.length > 0) {
        const firstRole = payload.user.userRoles[0];
        selectedApp = {
          appId: firstRole.app.id,
          appName: firstRole.app.name,
          role: firstRole.role.name,
          domainUrl: firstRole.app.domain_url,
        };
      }

      return { user, selectedApp };
    }

    throw new Error("Unknown payload format");
  };

  // Login method: accepts manual or Zoho payload
  const login = (payload: any) => {
    try {
      const { user, selectedApp } = normalizeAuthPayload(payload);

      setUserState(user);
      localStorage.setItem("userInfo", JSON.stringify(user));

      if (selectedApp) {
        setSelectedAppState(selectedApp);
        localStorage.setItem("selectedApp", JSON.stringify(selectedApp));
      }

      const now = Date.now();
      localStorage.setItem("loginTime", now.toString());
      localStorage.setItem("lastActivity", now.toString());
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  const setSelectedApp = (app: AppInfo) => {
    setSelectedAppState(app);
    localStorage.setItem("selectedApp", JSON.stringify(app));
  };

  // Load user + validate session
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const storedApp = localStorage.getItem("selectedApp");
    const loginTime = localStorage.getItem("loginTime");
    const lastActivity = localStorage.getItem("lastActivity");
    const now = Date.now();

    if (storedUser && loginTime) {
      const sessionDuration = now - parseInt(loginTime);
      const inactivityDuration = lastActivity
        ? now - parseInt(lastActivity)
        : 0;

      if (
        sessionDuration > MAX_SESSION_DURATION ||
        inactivityDuration > INACTIVITY_LIMIT
      ) {
        logout(); // Expired
      } else {
        try {
          setUserState(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse userInfo:", e);
        }
        if (storedApp) {
          try {
            setSelectedAppState(JSON.parse(storedApp));
          } catch (e) {
            console.error("Failed to parse selectedApp:", e);
          }
        }
      }
    }

    setLoading(false);
  }, []);

  // Track activity
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, [user]);

  // Optional: auto-check timer (so logout happens while user is idle on screen)
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      const lastActivity = localStorage.getItem("lastActivity");
      const now = Date.now();

      if (loginTime) {
        const sessionDuration = now - parseInt(loginTime);
        const inactivityDuration = lastActivity
          ? now - parseInt(lastActivity)
          : 0;

        if (
          sessionDuration > MAX_SESSION_DURATION ||
          inactivityDuration > INACTIVITY_LIMIT
        ) {
          logout();
        }
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        selectedApp,
        login,
        setSelectedApp,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
