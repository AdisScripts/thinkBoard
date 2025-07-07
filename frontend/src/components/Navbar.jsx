import { useEffect, useState } from "react";
import { PlusIcon, SunIcon, MoonIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ isLoggedIn, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  return (
    <header className="bg-base-300 border-b border-base-content/10 w-full">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            QuickNoteX 🗒️
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {/*Auth Buttons */}
            {isLoggedIn ? (
              <>
                <Link to="/create" className="btn btn-primary">
                  <PlusIcon className="size-5" />
                  <span>New Note</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-error"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {currentPath === "/login" && (
                  <Link to="/register" className="btn btn-outline">
                    Register
                  </Link>
                )}
                {currentPath === "/register" && (
                  <Link to="/login" className="btn btn-outline">
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className="btn btn-square btn-sm"
              title="Toggle Theme"
            >
              {isDark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
