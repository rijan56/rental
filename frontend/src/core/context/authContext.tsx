import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { getUserProfile, login } from "../services/authService";
import { clearAccessToken, setAccessToken } from "@/lib/tokenHelper";
import { getCookie } from "@/lib/cookieHelper";

interface Ilogin {
  username: string;
  password: string;
  type: "tenant" | "landlord";
}

// interface AuthContextType {
//   user: any | null;
//   login: (data: Ilogin) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = async ({ username, password, type }: Ilogin) => {
    const result = await login({ username, password, type });
    console.log(result);
    const token = result.token;
    setAccessToken(result.token);
    document.cookie = `token=${token};Path=/;Max-Age=${60 * 60 * 24 * 7}`;

    const userProfile = await getUserProfile(result.token);
    console.log("token from cookie : ", getCookie("token"));
    setUser(userProfile);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    clearAccessToken();
    document.cookie = `token=; Max-age=0; Path=/;`;
    console.log("logged out");
    setUser(null);
  };

  const refreshUserStatus = useCallback(async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        console.error("no token found");
        setIsLoading(false);
        return;
      }
      console.log("refresh status token : ", token);
      const userProfile = await getUserProfile(token);
      console.log("USER AFTER FETCH : ", userProfile);

      setUser(userProfile);
    } catch (error) {
      console.log("ERROR FETCHING USER : ", error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = useMemo(() => !!user, [user]);

  useEffect(() => {
    refreshUserStatus();
  }, []);

  useEffect(() => {
    console.log("rerender user : ", user);
    console.log(isAuthenticated);
    console.log(isLoading);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        isAuthenticated,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.log("useAuth must be used within an auth Provider");
    return;
  }
  return context;
};
