import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser } from 'react-icons/fa';
import './MainPage.css';
const MainPage: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="#">Syncify</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Calendar</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Recipes</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Reminders</a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="btn btn-light icon-button">
                                    <FaUser size={24} className="icon" />
                                </button>
                            </li>
                        </ul>
                    </div>
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
    );
};

export default MainPage;