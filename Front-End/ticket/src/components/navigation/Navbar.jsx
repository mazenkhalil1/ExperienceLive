import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              TicketsMarche
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/events"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600"
                    >
                      Manage Events
                    </Link>
                  </>
                )}
                {user?.role === 'organizer' && (
                  <Link
                    to="/organizer/events"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    My Events
                  </Link>
                )}
                {/* Desktop Menu - Change this condition */}
                {user?.role === 'user' && (
                  <Link
                    to="/bookings"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    My Bookings
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/events"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600"
                    >
                      Manage Events
                    </Link>
                  </>
                )}
                {user?.role === 'organizer' && (
                  <Link
                    to="/organizer/events"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    My Events
                  </Link>
                )}
                {/* Mobile Menu - Change this condition */}
                {user?.role === 'user' && (
                  <Link
                    to="/bookings"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    My Bookings
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;