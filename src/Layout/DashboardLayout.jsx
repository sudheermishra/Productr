import { useState } from "react";
import { NavLink, Outlet, useNavigation, useLocation } from "react-router-dom";
import logoImg from "../assets/Vector.png";
import avatarImg from "../assets/front.jpg";
import "../cssmodule/Dashboard.css";
import "../cssmodule/Responsive.css";
import "../cssmodule/Misc.css";

function DashboardLayout() {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.state === "loading";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pageName =
    location.pathname === "/"
      ? "Home"
      : location.pathname.replace("/", "").charAt(0).toUpperCase() +
        location.pathname.slice(2);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h1>
            <span>Productr</span>
            <img src={logoImg} alt="Productr" />
          </h1>
        </div>

        <div className="sidebar-search">
          <div className="sidebar-search-box">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end onClick={() => setSidebarOpen(false)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setSidebarOpen(false)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Products
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="top-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            {location.pathname !== "/" && (
              <div className="header-breadcrumb">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>{pageName}</span>
              </div>
            )}
          </div>

          <div className="header-right">
            {location.pathname !== "/" && (
              <div className="header-search">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input type="text" placeholder="Search Services, Products" />
              </div>
            )}

            <div className="user-avatar-container" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-avatar-letter">
                U
              </div>
              <svg
                className={`user-dropdown-icon ${dropdownOpen ? "rotate" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <NavLink to="/logout" onClick={() => setDropdownOpen(false)}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="page-loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

    </div>
  );
}

export default DashboardLayout;
