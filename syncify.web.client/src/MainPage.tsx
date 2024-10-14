import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaBook, FaShoppingCart, FaHome, FaAlignJustify } from 'react-icons/fa';
import { useUser } from './auth/auth-context.tsx';
import { useAsyncFn } from 'react-use';
import './MainPage.css';
import { AuthenticationService } from "./api/generated/AuthenticationService.ts";

export const MainPage: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = useUser();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const [{ loading: signingOut, error }, handleSignOut] = useAsyncFn(async () => {
        await AuthenticationService.logout();
        navigate('/login');
    }, []);

    return (
        <div className="d-flex min-vh-100">
            {/* Sidebar */}
            <nav className={`navbar navbar-expand-lg navbar-dark bg-dark flex-column vh-100 sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <button className="btn btn-link nav-link text-light toggle-btn" onClick={toggleSidebar}>
                        {isSidebarCollapsed ? <FaAlignJustify size={24} /> : "Syncify"}
                    </button>
                </div>

                <ul className="navbar-nav flex-column w-100 icon-list">
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/calendars">
                            <FaCalendarAlt className={'p-1'}/> {!isSidebarCollapsed && " Calendar"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/recipes">
                            <FaBook className={'p-1'}/> {!isSidebarCollapsed && " Recipes"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/shoppinglist">
                            <FaShoppingCart className={'p-1'}/> {!isSidebarCollapsed && " Shopping List"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/">
                            <FaHome className={'p-1'}/> {!isSidebarCollapsed && " Home"}
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="flex-grow-1 d-flex flex-column">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container-fluid justify-content-between">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaUser size={24} />
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
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

                {location.pathname === '/' && (
                    <main className="flex-fill d-flex flex-column justify-content-center align-items-center bg-light">
                        <div className="w-100 text-center">
                            <h1 className="mb-4">
                                <span className="text-dark">Welcome to </span>
                                <span className="text-highlight">Syncify</span>
                            </h1>
                            <p>This is the future main page of your new favorite calendar app!</p>
                        </div>
                    </main>
                )}
                <Outlet />
            </div>
        </div>
    );
};
