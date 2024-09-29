import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginDto } from '../../api/generated/index.defs.ts';
import { useAsyncFn } from 'react-use';
import { AuthenticationService } from '../../api/generated/AuthenticationService.ts';

const defaultLoginData: LoginDto = {
  username: '',
  password: '',
};

export const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginDto>(defaultLoginData);

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const notifyError = (message: string) => {
    toast.dismiss();
    toast.error(message);
  };

  const [, handleLogin] = useAsyncFn(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const response = await AuthenticationService.login({ body: loginData });
      if (response.hasErrors) {
        response.errors.forEach((err) => notifyError(err.errorMessage));
        return;
      }

      toast.success('Logged in');
      navigate('/');
    },
    [loginData, navigate]
  );

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="login-form bg-white p-5 rounded shadow">
        <h2 className="text-center text-highlight mb-4">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-dark">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              onChange={(e) =>
                setLoginData((data) => ({ ...data, username: e.target.value }))
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
              onChange={(e) =>
                setLoginData((data) => ({ ...data, password: e.target.value }))
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
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};
