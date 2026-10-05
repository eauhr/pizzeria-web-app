import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Story = lazy(() => import("./pages/Story"));
const Visit = lazy(() => import("./pages/Visit"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const routeTitles = {
  "/": "Picantino | Italian Pizzeria in Plovdiv",
  "/menu": "Menu | Picantino",
  "/cart": "Your Cart | Picantino",
  "/story": "Our Story | Picantino",
  "/visit": "Visit Picantino | Plovdiv",
  "/login": "Log In | Picantino",
  "/register": "Create Account | Picantino",
  "/forgot-password": "Reset Password | Picantino",
  "/reset-password": "Choose a New Password | Picantino",
  "/admin": "Admin Dashboard | Picantino",
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = routeTitles[pathname] || "Page Not Found | Picantino";
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <RouteMetadata />
      <ScrollToTop />
      <Suspense fallback={<div className="p-8 text-center" role="status">Loading page…</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/story" element={<Story />} />
            <Route path="/visit" element={<Visit />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
