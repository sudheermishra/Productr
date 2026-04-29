import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("productr_token");
    localStorage.removeItem("productr_user");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="page-loader">
      <div className="spinner"></div>
    </div>
  );
}

export default Logout;
