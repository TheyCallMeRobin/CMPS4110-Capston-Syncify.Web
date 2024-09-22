import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const notifyError = (message: string) => {
        toast.dismiss();
        toast.error(message);
    };

    const notifySuccess = (message: string) => {
        toast.dismiss();
        toast.success(message);
    };
    const formatPhoneNumber = (value: string) => {
        const phone = value.replace(/[^\d]/g, '');
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const FirstNameMaxLength = 128;
        const LastNameMaxLength = 128;

        if (firstName.length > FirstNameMaxLength) {
            notifyError(`First name cannot exceed ${FirstNameMaxLength} characters!`);
            return;
        }

        if (lastName.length > LastNameMaxLength) {
            notifyError(`Last name cannot exceed ${LastNameMaxLength} characters!`);
            return;
        }

        if (password !== confirmPassword) {
            notifyError('Passwords do not match!');
            return;
        }

        const registerData = {
            UserName: username,
            Email: email,
            Password: password,
            PhoneNumber: phoneNumber,
            FirstName: firstName,
            LastName: lastName,
        };

        try {
            const response = await fetch('/api/users/api/createusers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                notifyError(errorData.message || 'Registration failed');
                return;
            }

            notifySuccess('Registration successful');
            navigate('/login');
        } catch (err) {
            notifyError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="register-form bg-white p-5 rounded shadow">
                <h2 className="text-center text-highlight mb-4">Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label text-dark">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            maxLength={128}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label text-dark">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            maxLength={128}
                            required
                        />
                    </div>
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
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-dark">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label text-dark">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            value={formatPhoneNumber(phoneNumber)}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={14}
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
                    <div className="mb-3 position-relative">
                        <label htmlFor="confirmPassword" className="form-label text-dark">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showConfirmPassword"
                                checked={showConfirmPassword}
                                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                            <label className="form-check-label text-dark" htmlFor="showConfirmPassword">
                                Show Confirm Password
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                    <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};