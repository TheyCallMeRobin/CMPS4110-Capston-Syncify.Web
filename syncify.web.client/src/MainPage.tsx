import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Outlet for child route rendering
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FaUser, FaCalendarAlt, FaBell, FaCog, FaUserPlus, FaBook, FaShoppingCart } from 'react-icons/fa';
import './MainPage.css';

export const MainPage: React.FC = () => {
    return (
        <div className="d-flex min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-column vh-100 sidebar">
                <a className="navbar-brand text-center mb-4" href="#">Syncify</a>

                <ul className="navbar-nav flex-column w-100">
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/calendars">
                            <FaCalendarAlt className="me-2" /> Calendar
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/reminders">
                            <FaBell className="me-2" /> Reminder
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/recipes">
                            <FaBook className="me-2" /> Recipes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/shopping-list">
                            <FaShoppingCart className="me-2" /> Shopping List
                        </Link>
                    </li>
                </ul>

                <div className="flex-grow-1"></div>

                <ul className="navbar-nav flex-column w-100 mb-3 bottom-links">
                    <li className="nav-item mb-2">
                        <Link className="nav-link d-flex align-items-center" to="/settings">
                            <FaCog className="me-2" /> Account Settings
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link d-flex align-items-center" to="/register">
                            <FaUserPlus className="me-2" /> Invite
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="flex-grow-1 d-flex flex-column">

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div className="container-fluid justify-content-between">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="familyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Family
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="familyDropdown">
                                    <li><a className="dropdown-item" href="#">Member 1</a></li>
                                    <li><a className="dropdown-item" href="#">Member 2</a></li>
                                    <li><a className="dropdown-item" href="#">Member 3</a></li>
                                </ul>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="userMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FaUser size={24} className="icon" />
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                                    <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                    <li><Link className="dropdown-item" to="/register">Register</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>

                
                <main className="flex-fill d-flex flex-column justify-content-center align-items-center bg-light">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};
