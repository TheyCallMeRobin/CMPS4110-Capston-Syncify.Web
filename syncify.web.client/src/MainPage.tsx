import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaBell, FaCog, FaUserPlus, FaBook, FaShoppingCart, FaHome, FaAlignJustify } from 'react-icons/fa';
import './MainPage.css';

export const MainPage: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

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
                            <FaCalendarAlt /> {!isSidebarCollapsed && " Calendar"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/reminders">
                            <FaBell /> {!isSidebarCollapsed && " Reminder"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/recipes">
                            <FaBook /> {!isSidebarCollapsed && " Recipes"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/shoppinglist">
                            <FaShoppingCart /> {!isSidebarCollapsed && " Shopping List"}
                        </Link>
                    </li>
                </ul>

                <div className="flex-grow-1"></div>

                <ul className="navbar-nav flex-column w-100 mb-3 bottom-links icon-list">
                    <li className="nav-item mb-2">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/account-settings">
                            <FaCog /> {!isSidebarCollapsed && " Account Settings"}
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/register">
                            <FaUserPlus /> {!isSidebarCollapsed && " Invite"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center justify-content-center" to="/">
                            <FaHome /> {!isSidebarCollapsed && " Home"}
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <div className="flex-grow-1 d-flex flex-column">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container-fluid justify-content-between">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/" id="familyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Family
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="familyDropdown">
                                    <li><Link className="dropdown-item" to="/">Member 1</Link></li>
                                    <li><Link className="dropdown-item" to="/">Member 2</Link></li>
                                    <li><Link className="dropdown-item" to="/">Member 3</Link></li>
                                </ul>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="/" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaUser size={24} />
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                    <li><Link className="dropdown-item" to="/register">Register</Link></li>
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