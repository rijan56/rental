import { Routes, Route, Navigate } from "react-router";
import "./App.css";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { Signup } from "./pages/signup";
import { Toaster } from "./components/ui/sonner";
import { Login } from "./pages/signin";
import { Properties } from "./pages/properties";
import { ProtectedRoute } from "./ProtectedRoutes";
import { ListProperty } from "./pages/listProperty";
import { MyProperty } from "./pages/myProperty";
import { PropertyViewPage } from "./pages/propertyID";
import { useAuth } from "./core/context/authContext";
import { AgreementsPage } from "./pages/agreements";
import { AgreementID } from "./pages/agreementID";
import { PaymentPage } from "./pages/payments";
import PaymentVerdict from "./pages/payments/PaymentVerdict";
import PaymentsPage from "./pages/payments/PaymentsPage";
import { ComplaintsPage } from "./pages/complaints";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  console.log("trigger");
  console.log(isAuthenticated);
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <main className="">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route
            path="/signup"
            element={
              isLoading ? (
                <div>Loading...</div>
              ) : isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Signup />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLoading ? (
                <div>Loading...</div>
              ) : isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />{" "}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                user={user}
                isLoading={isLoading}
              />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyViewPage />} />
            <Route path="/listproperty" element={<ListProperty />} />
            <Route path="/myProperty" element={<MyProperty />} />
            <Route path="/agreements" element={<AgreementsPage />} />
            <Route path="/agreements/:id" element={<AgreementID />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/complaints" element={<ComplaintsPage />} />
          </Route>
          <Route path="/payment/verdict/:uuid" element={<PaymentVerdict />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
