import { Navigate, Outlet, useLocation } from "react-router";

export function ProtectedRoute({
  isAuthenticated,
  user,
}: Readonly<{ isAuthenticated: boolean; user: any; isLoading: boolean }>) {
  const location = useLocation();

  if (!isAuthenticated) {
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (user.user.type === "landlord" && location.pathname == "/properties") {
    return <Navigate to="/" replace />;
  }

  const redirectPath = sessionStorage.getItem("redirectPath");
  if (redirectPath && redirectPath != "/login" && location.pathname !== "/") {
    sessionStorage.removeItem("redirectPath");
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
