import React from 'react';
import { Link } from 'react-router-dom';

import { FaUser, FaCalendarAlt, FaBell, FaCog, FaUserPlus, FaBook, FaShoppingCart } from 'react-icons/fa';
import './MainPage.css';

export const MainPage: React.FC = () => {
    return (
        <div className="d-flex min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex-column vh-100 sidebar">
                <a className="navbar-brand text-center mb-4" href="#">Syncify</a>

                <ul className="navbar-nav flex-column w-100">
                    <li className="nav-item">
                        <a className="nav-link d-flex align-items-center" href="#">
                            <FaCalendarAlt className="me-2" /> Calendar
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link d-flex align-items-center" href="#">
                            <FaBell className="me-2" /> Reminder
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link d-flex align-items-center" href="#">
                            <FaBook className="me-2" /> Recipes
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link d-flex align-items-center" href="#">
                            <FaShoppingCart className="me-2" /> Shopping List
                        </a>
                    </li>
                </ul>

                <div className="flex-grow-1"></div>

                <ul className="navbar-nav flex-column w-100 mb-3 bottom-links">
                    <li className="nav-item mb-2">
                        <a className="nav-link d-flex align-items-center" href="#">
                            <FaCog className="me-2" /> Account Settings
                        </a>
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
