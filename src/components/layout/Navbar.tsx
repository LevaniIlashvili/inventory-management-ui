import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GlobalSearchBar from "../GlobalSearchBar";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm py-2 mb-4">
      <div className="container">
        <Link
          className="navbar-brand fw-bold text-primary"
          to="/"
          onClick={closeMenu}
        >
          InventoryManagement
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarResponsive"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarResponsive"
        >
          <div
            className="me-auto my-2 my-lg-0 w-100 ps-lg-3"
            style={{ maxWidth: "500px" }}
          >
            <GlobalSearchBar />
          </div>

          <div className="d-flex align-items-center mt-2 mt-lg-0">
            {auth?.user ? (
              <>
                <span className="navbar-text me-3 d-none d-lg-block">
                  Hi,{" "}
                  <strong>{auth.user.firstName || auth.user.userName}</strong>
                </span>

                <Link
                  className="btn btn-primary btn-sm me-2 fw-semibold shadow-sm"
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  My Dashboard
                </Link>

                {auth.user.roles?.includes("Admin") && (
                  <Link
                    className="btn btn-outline-dark btn-sm me-2"
                    to="/admin"
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-primary btn-sm me-2 px-3"
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary btn-sm shadow-sm px-3"
                  to="/register"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
