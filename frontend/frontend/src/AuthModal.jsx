import { useState } from "react";
import "./App.css";

function AuthModal({ isOpen, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    if (!isLogin && !name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    // Temporary demo authentication.
    // Real authentication will be connected to our backend later.
    const customer = {
      name: isLogin ? email.split("@")[0] : name,
      email,
    };

    onLogin(customer);

    setName("");
    setEmail("");
    setPassword("");
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

          <button className="auth-submit" type="submit">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>

          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create Account" : "Sign In"}
          </button>
        </div>

        <p className="auth-demo-note">
          This is a demonstration account flow. Secure authentication will be
          implemented with our backend.
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
