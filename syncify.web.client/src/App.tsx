import React, { useContext, useEffect, useState } from 'react';
import './api/generated/config';
import './App.css';
import './syncfusion-styles.css';
import logo from './assets/Syncify.png';
import { AuthContext, useUser } from './auth/auth-context.tsx';
import { ROUTES } from './routes.tsx';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaAlignJustify,
  FaBell,
  FaBook,
  FaCalendarAlt,
  FaHome,
  FaShoppingCart,
  FaUser,
} from 'react-icons/fa';
import { useAsyncFn } from 'react-use';
import { AuthenticationService } from './api/generated/AuthenticationService.ts';

export const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const authContext = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [{ loading: signingOut, error }, handleSignOut] =
    useAsyncFn(async () => {
      await AuthenticationService.logout();

      authContext.clearUser();

      navigate('/login');
    }, [authContext, navigate]);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LoginPage.path);
    }
  }, [navigate, user]);

  const noNavBarPages = [ROUTES.LoginPage.path, ROUTES.RegisterPage.path];
  const shouldHideNavBar = noNavBarPages.includes(location.pathname);

  return (
    <div className="d-flex min-vh-100">
      {!shouldHideNavBar && (
        <nav
          className={`sidebar-navbar navbar navbar-expand-lg navbar-dark flex-column vh-100 sidebar position-fixed overflow-y-auto  ${
            isSidebarCollapsed ? 'collapsed' : ''
          }`}
          style={{ zIndex: '999' }}
        >
          <ul className="navbar-nav flex-column w-100 icon-list">
            <button
              className="btn btn-link nav-item text-light toggle-btn"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? (
                <FaAlignJustify size={24} />
              ) : (
                <img src={logo} alt="Syncify" className="sidebar-logo" />
              )}
            </button>
            <li className="nav-item align-text-">
              <Link className="nav-link" to="/">
                <FaHome /> {!isSidebarCollapsed && ' Home'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendars">
                <FaCalendarAlt /> {!isSidebarCollapsed && ' Calendar'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reminders">
                <FaBell /> {!isSidebarCollapsed && ' Reminder'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recipes">
                <FaBook /> {!isSidebarCollapsed && ' Recipes'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shopping-lists">
                <FaShoppingCart /> {!isSidebarCollapsed && ' Shopping List'}
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex-grow-1 d-flex flex-column">
        {!shouldHideNavBar && (
          <nav className="header-navbar navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid justify-content-between">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="/"
                    id="userMenu"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser size={24} />
                  </Link>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenu"
                  >
                    {user ? (
                      <>
                        <li className="dropdown-item">
                          {`${user.firstName} ${user.lastName}`}
                        </li>
                        <li>
                          <button
                            className="dropdown-item signout-button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                          >
                            {signingOut ? 'Signing Out...' : 'Sign Out'}
                          </button>
                        </li>
                        {error && (
                          <li className="dropdown-item text-danger">
                            Error signing out: {error.message}
                          </li>
                        )}
                      </>
                    ) : null}
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        )}
        <main
          className={'px-5'}
          style={{ marginLeft: isSidebarCollapsed ? '80px' : '180px' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
