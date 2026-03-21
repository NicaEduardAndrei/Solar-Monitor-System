import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import "./AuthPage.css";


export function AuthPage() {
  const [auth, setAuth] = useState("login");







  return (
    <>
      <div className="page">
        <div className="auth-container">
          <div className={`auth-slider ${auth === "signup" ? "move" : ""}`}>
            <LoginForm setAuth={setAuth} />
            <SignUpForm setAuth={setAuth} />
          </div>
        </div>
      </div>
    </>
  );
}