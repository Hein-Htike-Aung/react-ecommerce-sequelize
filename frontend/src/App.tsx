import { ThemeProvider } from "@emotion/react";
import { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Mui_Theme from "./assets/mui-theme";
import Layout from "./components/layout/layout/Layout";
import { ThemeContext } from "./context/themeContext";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import "./assets/app.scss";

const App = () => {
  const currentUser = true;
  const { themeMode } = useContext(ThemeContext);

  const ProtectedRoute = ({ children }: any) => {
    if (!currentUser) return <Navigate to={"/login"} />;
    return children;
  };

  const PublicRoute = ({ children }: any) => {
    if (currentUser) return <Navigate to={"/"} />;
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider theme={Mui_Theme(themeMode)}>
      <div className={`theme-${themeMode ? "dark" : "light"}`}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
};

export default App;
