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
import CategoryList from "./pages/categories-list/CategoryList";
import NewLetterList from "./pages/newLetter-list/NewLetterList";
import OrderList from "./pages/orders-list/OrderList";
import ProductList from "./pages/product-list/ProductList";
import Settings from "./pages/settings/Settings";
import UserLIst from "./pages/users-list/UserLIst";
import CategoryEdit from "./pages/category-edit/CategoryEdit";

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
        {
          path: "/categories",
          element: <CategoryList />,
        },
        {
          path: "/categories/edit/:id",
          element: <CategoryEdit />,
        },
        {
          path: "/newLetter-list",
          element: <NewLetterList />,
        },
        {
          path: "/orders-list",
          element: <OrderList />,
        },
        {
          path: "/product-list",
          element: <ProductList />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/user-list",
          element: <UserLIst />,
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
