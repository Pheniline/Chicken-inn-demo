import { useState } from "react";
import axios from "axios";
import "./App.css";

function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const requestData = isLogin
        ? { email, password }
        : {
            fullName: name,
            email,
            phone,
            password,
          };

      const response = await axios.post(endpoint, requestData);

      const { customer, token } = response.data;

      onLogin(customer, token);

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button
          className="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Close authentication window"
        >
          &times;
        </button>

        <div className="auth-header">
          <p className="auth-eyebrow">WELCOME TO CHICKEN INN</p>

          <h2>{isLogin ? "Welcome Back!" : "Create Your Account"}</h2>

          <p>
            {isLogin
              ? "Sign in to continue with your order."
              : "Join us and enjoy a delicious experience."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="auth-field">
                <label htmlFor="customer-name">Full Name</label>
                <input
                  id="customer-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="customer-phone">Phone Number</label>
                <input
                  id="customer-phone"
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="auth-field">
            <label htmlFor="customer-email">Email Address</label>
            <input
              id="customer-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="customer-password">Password</label>
            <input
              id="customer-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
            }}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
