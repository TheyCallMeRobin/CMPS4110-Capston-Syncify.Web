import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegisterPage.css';
import './../../index.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateUserDto, LoginDto } from '../../api/generated/index.defs.ts';
import { useAsyncFn } from 'react-use';
import { UsersService } from '../../api/generated/UsersService.ts';
import { AuthenticationService } from '../../api/generated/AuthenticationService.ts';

const defaultValues: CreateUserDto = {
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    roles: ['Member'],
};

const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
};

export const RegisterPage: React.FC = () => {
    const [newUser, setNewUser] = useState<CreateUserDto>(defaultValues);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const notifyError = (message: string) => {
        toast.dismiss();
        toast.error(message);
    };

    const loginUser = async (username: string, password: string) => {
        const loginData: LoginDto = { username: username, password: password };
        const loginResponse = await AuthenticationService.login({ body: loginData });

        if (loginResponse.hasErrors) {
            loginResponse.errors.forEach((err) => notifyError(err.errorMessage));
            return false;
        }
        return true;
    };

    const [, handleRegister] = useAsyncFn(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const response = await UsersService.create({ body: newUser });
            if (response.hasErrors) {
                response.errors.forEach((err) => notifyError(err.errorMessage));
                return;
            }

            const loggedIn = await loginUser(newUser.userName, newUser.password);
            if (loggedIn) {
                toast.success('Registration successful, you are now logged in! Redirecting to home page...', {
                    onClose: () => navigate('/'),
                });
            }
        },
        [navigate, newUser]
    );

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="register-form bg-white p-5 rounded shadow">
                <h2 className="text-center text-highlight mb-4">Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label text-dark">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                value={newUser.firstName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, firstName: e.target.value })
                                }
                                maxLength={128}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label text-dark">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                value={newUser.lastName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, lastName: e.target.value })
                                }
                                maxLength={128}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-dark">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label text-dark">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            value={formatPhoneNumber(newUser.phoneNumber)}
                            onChange={(e) =>
                                setNewUser({ ...newUser, phoneNumber: e.target.value })
                            }
                            maxLength={14}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-dark">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={newUser.userName}
                            onChange={(e) =>
                                setNewUser({ ...newUser, userName: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="password" className="form-label text-dark">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            value={newUser.password}
                            onChange={(e) =>
                                setNewUser({ ...newUser, password: e.target.value })
                            }
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
                            <label
                                className="form-check-label text-dark"
                                htmlFor="showPassword"
                            >
                                Show Password
                            </label>
                        </div>
                    </div>
                    <div className="mb-3 position-relative">
                        <label htmlFor="confirmPassword" className="form-label text-dark">
                            Confirm Password
                        </label>
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
                            <label
                                className="form-check-label text-dark"
                                htmlFor="showConfirmPassword"
                            >
                                Show Confirm Password
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                    </div>
                    <p className="text-center mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};
