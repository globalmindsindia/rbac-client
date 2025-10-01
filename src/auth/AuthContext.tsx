import React, { createContext, useContext, useEffect, useState } from "react";

interface AppInfo {
  appId: string;
  appName: string;
  role: string;
  domainUrl?: string;
}
interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user?: UserInfo;
  selectedApp?: AppInfo;
  apps?: AppInfo[];
  permissions?: string[];
  login: (payload: any) => string; // returns redirect path
  setSelectedApp: (app: AppInfo) => void;
  logout: () => void;
  loading: boolean;

  // ✅ RBAC helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const MAX_SESSION_DURATION = 3 * 60 * 60 * 1000; // 3 hours
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserInfo | undefined>(undefined);
  const [selectedApp, setSelectedAppState] = useState<AppInfo | undefined>(
    undefined
  );
  const [apps, setAppsState] = useState<AppInfo[] | undefined>(undefined);
  const [permissions, setPermissionsState] = useState<string[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUserState(undefined);
    setSelectedAppState(undefined);
    setAppsState(undefined);
    setPermissionsState(undefined);
    localStorage.clear();
  };

  const normalizeAuthPayload = (payload: any) => {
    if (payload?.data) {
      const d = payload.data;
      const user: UserInfo = {
        id: d.user.id,
        email: d.user.email,
        firstName: d.user.firstName,
        lastName: d.user.lastName,
      };
      const app: AppInfo | undefined = d.app
        ? {
            appId: d.app.appId,
            appName: d.app.appName,
            role: d.app.role,
            domainUrl: d.app.domainUrl,
          }
        : undefined;
      return {
        user,
        selectedApp: app,
        permissions: d.permissions,
        apps: d.apps,
        redirect: d.redirect,
      };
    }
    if (payload?.user) {
      const user: UserInfo = {
        id: payload.user.id,
        email: payload.user.email,
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
      };
      const app: AppInfo | undefined = payload.app
        ? {
            appId: payload.app.appId,
            appName: payload.app.appName,
            role: payload.app.role,
            domainUrl: payload.app.domainUrl,
          }
        : undefined;
      return {
        user,
        selectedApp: app,
        permissions: payload.permissions,
        apps: payload.apps,
        redirect: payload.redirect,
      };
    }
    throw new Error("Unknown payload format");
  };

  const decideRedirect = (permissions?: string[]): string | null => {
    if (!permissions) return null;
    if (permissions.includes("manage:users")) return "/admin/dashboard";
    if (permissions.includes("manage:students")) return "/employee/dashboard";
    if (permissions.includes("read:students")) return "/student/dashboard";
    return null;
  };

  const login = (raw: any): string => {
    const { user, selectedApp, apps, permissions, redirect } =
      normalizeAuthPayload(raw);
    setUserState(user);
    localStorage.setItem("userInfo", JSON.stringify(user));
    if (selectedApp) {
      setSelectedAppState(selectedApp);
      localStorage.setItem("selectedApp", JSON.stringify(selectedApp));
    }
    if (apps) {
      setAppsState(apps);
      localStorage.setItem("apps", JSON.stringify(apps));
    }
    if (permissions) {
      setPermissionsState(permissions);
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    const now = Date.now();
    localStorage.setItem("loginTime", now.toString());
    localStorage.setItem("lastActivity", now.toString());
    return redirect && redirect.startsWith("/")
      ? redirect
      : decideRedirect(permissions) || "/";
  };

  // Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const storedApp = localStorage.getItem("selectedApp");
    const storedApps = localStorage.getItem("apps");
    const storedPermissions = localStorage.getItem("permissions");
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
        logout();
      } else {
        try {
          setUserState(JSON.parse(storedUser));
          if (storedApp) setSelectedAppState(JSON.parse(storedApp));
          if (storedApps) setAppsState(JSON.parse(storedApps));
          if (storedPermissions)
            setPermissionsState(JSON.parse(storedPermissions));
        } catch {
          logout();
        }
      }
    }
    setLoading(false);
  }, []);

  // Track activity
  useEffect(() => {
    if (!user) return;
    const update = () =>
      localStorage.setItem("lastActivity", Date.now().toString());
    window.addEventListener("mousemove", update);
    window.addEventListener("keydown", update);
    window.addEventListener("click", update);
    return () => {
      window.removeEventListener("mousemove", update);
      window.removeEventListener("keydown", update);
      window.removeEventListener("click", update);
    };
  }, [user]);

  // ✅ RBAC helpers
  const hasRole = (role: string) => selectedApp?.role === role;
  const hasAnyRole = (roles: string[]) =>
    roles.includes(selectedApp?.role || "");
  const hasPermission = (perm: string) => !!permissions?.includes(perm);
  const hasAnyPermission = (perms: string[]) =>
    !!permissions?.some((p) => perms.includes(p));

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        selectedApp,
        apps,
        permissions,
        login,
        setSelectedApp: (app) => {
          setSelectedAppState(app);
          localStorage.setItem("selectedApp", JSON.stringify(app));
        },
        logout,
        loading,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
