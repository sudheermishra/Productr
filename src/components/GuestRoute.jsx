import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
  const token = localStorage.getItem("productr_token");
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

export default GuestRoute;
