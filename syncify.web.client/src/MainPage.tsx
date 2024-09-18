import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FaUser, FaCalendarAlt, FaBell, FaCog, FaUserPlus, FaBook, FaShoppingCart } from 'react-icons/fa';
import './MainPage.css';

export const MainPage: React.FC = () => {
    return (
        <div className="d-flex min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-column vh-100 sidebar">
                <Link className="navbar-brand text-center mb-4" to="/">Syncify</Link>

                <ul className="navbar-nav flex-column w-100">
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/calendars">
                            <FaCalendarAlt /*className="me-2"*/ /> Calendar
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/reminders">
                            <FaBell /*className="me-2"*/ /> Reminder
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/recipes">
                            <FaBook /*className="me-2"*/ /> Recipes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/shoppinglists">
                            <FaShoppingCart /*className="me-2"*/ /> Shopping List
                        </Link>
                    </li>
                </ul>

                <div className="flex-grow-1"></div>

                <ul className="navbar-nav flex-column w-100 mb-3 bottom-links">
                    <li className="nav-item mb-2">
                        <Link className="nav-link d-flex align-items-center" to="/">
                            <FaCog /*className="me-2"*/ /> Account Settings
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/register">
                            <FaUserPlus /*className="me-2"*/ /> Invite
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
                                    <FaUser size={24} /*className="icon"*/ />
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                    <li><Link className="dropdown-item" to="/register">Register</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Outlet />

                <main className="flex-fill d-flex flex-column justify-content-center align-items-center bg-light">
                    <div className="w-100 text-center">
                        <h1 className="mb-4">
                            <span className="text-dark">Welcome to </span>
                            <span className="text-highlight">Syncify</span>
                        </h1>
                        <p>This is the future main page of your new favorite calendar app!</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
