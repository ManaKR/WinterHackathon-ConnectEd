import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isNewUser ? "Create Account" : "Login"}</h2>
        <form>
          {isNewUser && <input type="text" placeholder="Username" required />}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">{isNewUser ? "Sign Up" : "Login"}</button>
        </form>
        <p onClick={() => setIsNewUser(!isNewUser)} className="toggle">
          {isNewUser
            ? "Already have an account? Login"
            : "New user? Create account"}
        </p>
      </div>
    </div>
  );
}

export default Login;
