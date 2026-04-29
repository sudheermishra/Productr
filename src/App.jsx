import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OtpVerify from "./pages/OtpVerify";
import Logout from "./pages/Logout";
import Home, { homeLoader } from "./pages/Home";
import Products, { productsLoader } from "./pages/Products";
import DashboardLayout from "./Layout/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import GuestRoute from "./components/GuestRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Guest-only routes: logged-in users are redirected to home */}
      <Route element={<GuestRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="otp" element={<OtpVerify />} />
      </Route>

      {/* Private routes: unauthenticated users are redirected to /login */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} loader={homeLoader} />
          <Route path="products" element={<Products />} loader={productsLoader} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
