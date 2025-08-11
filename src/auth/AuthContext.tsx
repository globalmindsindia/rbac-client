import React, { createContext, useContext, useEffect, useState } from "react";

interface AppInfo {
  appId: string;
  appName: string;
  role: string;
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
  login: (user: UserInfo) => void;
  setSelectedApp: (app: AppInfo) => void;
  logout: () => void;
  loading: boolean; // 👈 Add loading state
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserInfo | undefined>(undefined);
  const [selectedApp, setSelectedAppState] = useState<AppInfo | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true); // 👈 Initialize loading

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const storedApp = localStorage.getItem("selectedApp");

    // console.log("AuthProvider - loaded user from localStorage:", storedUser);

    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse userInfo:", e);
      }
    }

    if (storedApp) {
      try {
        setSelectedAppState(JSON.parse(storedApp));
      } catch (e) {
        console.error("Failed to parse selectedApp:", e);
      }
    }

    setLoading(false);
  }, []);

  const login = (user: UserInfo) => {
    setUserState(user);
    localStorage.setItem("userInfo", JSON.stringify(user));
  };

  const setSelectedApp = (app: AppInfo) => {
    setSelectedAppState(app);
    localStorage.setItem("selectedApp", JSON.stringify(app));
  };

  const logout = () => {
    setUserState(undefined);
    setSelectedAppState(undefined);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("selectedApp");
  };

  const isAuthenticated = !!user;

//   console.log("Parsed user object:", user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        selectedApp,
        login,
        setSelectedApp,
        logout,
        loading, // 👈 Provide loading state
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
