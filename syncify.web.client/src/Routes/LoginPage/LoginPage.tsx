import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const navigate = useNavigate();

    const notifyError = (message: string) => {
        toast.dismiss();
        toast.error(message);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginData = {
            Username: username,
            Password: password,
        };
        

        try {
            const response = await fetch('/api/authentication/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                notifyError(errorData.message || 'Incorrect username or password: The username or password entered is incorrect.');
                return;
            }
            
            setShowConfetti(true);

            setTimeout(() => {
                navigate('/');
            }, 1400);
        } catch (err) {
            notifyError('Something went wrong. Please try again.');
        }  };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            {showConfetti && <Confetti />}
            <div className="login-form bg-white p-5 rounded shadow">
                <h2 className="text-center text-highlight mb-4">Login to Your Account</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-dark">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label text-dark">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label className="form-check-label text-dark" htmlFor="showPassword">
                                Show Password
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <p className="text-center mt-3">Don't have an account? <Link to="/register">Register</Link></p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};
