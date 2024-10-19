import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './api/generated/config';
import './App.css';
import logo from './../public/Syncify.png';
import { useUser } from './auth/auth-context.tsx';
import { ROUTES } from './routes.tsx';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaBell, FaCog, FaUserPlus, FaBook, FaShoppingCart, FaHome, FaAlignJustify, } from 'react-icons/fa';
import { useAsyncFn } from 'react-use';
import { AuthenticationService } from "./api/generated/AuthenticationService.ts";

export const App: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar is collapsed by default
    const user = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const [{ loading: signingOut, error }, handleSignOut] = useAsyncFn(async () => {
        await AuthenticationService.logout();
        navigate('/login');
    }, []);

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
                <nav className={`sidebar-navbar navbar navbar-expand-lg navbar-dark flex-column vh-100 sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="d-flex justify-content-center align-items-center w-100">
                        <button className="btn btn-link nav-link text-light toggle-btn" onClick={toggleSidebar}>
                            {isSidebarCollapsed ? (
                                <FaAlignJustify size={24} /> 
                            ) : (<img src={logo} alt="Syncify" className="sidebar-logo" style={{ maxWidth: '120px', height: 'auto' }} />
                            )}
                        </button>
                    </div>
                    <ul className="navbar-nav flex-column w-100 icon-list">
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/calendars"
                            >
                                <FaCalendarAlt /> {!isSidebarCollapsed && ' Calendar'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/reminders"
                            >
                                <FaBell /> {!isSidebarCollapsed && ' Reminder'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/recipes"
                            >
                                <FaBook /> {!isSidebarCollapsed && ' Recipes'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/shopping-lists"
                            >
                                <FaShoppingCart /> {!isSidebarCollapsed && ' Shopping List'}
                            </Link>
                        </li>
                    </ul>

                    <div className="flex-grow-1"></div>

                    <ul className="navbar-nav flex-column w-100 mb-3 bottom-links icon-list">
                        <li className="nav-item mb-2">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/account-settings"
                            >
                                <FaCog /> {!isSidebarCollapsed && ' Account Settings'}
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/register"
                            >
                                <FaUserPlus /> {!isSidebarCollapsed && ' Invite'}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center justify-content-center"
                                to="/"
                            >
                                <FaHome /> {!isSidebarCollapsed && ' Home'}
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            <div className="flex-grow-1 d-flex flex-column">
                {!shouldHideNavBar && (
                    <nav className="header-navbar navbar navbar-expand-lg navbar-dark">
                        <div className="container-fluid justify-content-between">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="/"
                                        id="familyDropdown"
                                        role="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        Family
                                    </Link>
                                    <ul className="dropdown-menu" aria-labelledby="familyDropdown">
                                        <li>
                                            <Link className="dropdown-item" to="/">
                                                Member 1
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/">
                                                Member 2
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/">
                                                Member 3
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

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
                                        aria-labelledby="userMenu">
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
                                                {error && <li className="dropdown-item text-danger">Error signing out: {error.message}</li>}
                                            </>
                                        ) : null}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                )}

                <Outlet />
            </div>
        </div>
    );
};
