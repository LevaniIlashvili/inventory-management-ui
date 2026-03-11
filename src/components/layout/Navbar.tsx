import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MyApp
        </Link>

        <form className="d-flex ms-auto me-3">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search..."
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>

        {auth?.user ? (
          <>
            <span className="me-2">
              Hi, {auth.user.firstName || auth.user.userName}
            </span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-secondary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
