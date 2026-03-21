import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";


export function LoginForm({ setAuth }) {
    const navigate = useNavigate();



    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })

    const authLogin = async () => {
        try {

            const response = await axios.post("http://localhost:3000/auth/login", {
                email: userInfo.email,
                password: userInfo.password
            })

            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
                navigate("/dashboard")
            }
        } catch (err) {
            console.log("Eroare la login:", err.response?.data || err.message);
        }


    }

    return (
        <div className="auth-form">

            <div className="titles-container-login">
                <p className="title">Welcome back</p>
                <p className="subtitle">Sign in to access your dashboard</p>
            </div>

            <div className="form-container">
                <input placeholder="Email address" value={userInfo.email} onChange={(input) => {
                    setUserInfo({ ...userInfo, email: input.target.value })
                }} />
                <input placeholder="Password" type="password" value={userInfo.password} onChange={(input) => {
                    setUserInfo({ ...userInfo, password: input.target.value })
                }} />
                <button onClick={()=>{authLogin()}}>Sign in</button>
            </div>

            <div className="switch-auth">
                <p>Don't have an account?</p>
                <span onClick={() => { setAuth("signup")}}>Sign up</span>
            </div>

        </div>
    );
}