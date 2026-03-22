import { IP } from "../../config";
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";


export function LoginForm({ setAuth }) 
{
    const navigate = useNavigate();
    const [error , setError]  = useState("")
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })

    const isValidEmail = (email)=>{
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const authLogin = async () => {
        setError("")

        if (!userInfo.email){
            setError("Email required")
            return;
        }

        if (!isValidEmail(userInfo.email)){
            setError("Invalid email format")
            return;
        }

        if (!userInfo.password){
            setError("Password required")
            return;
        }

        try {

            const response = await axios.post(`http://${IP}:3000/auth/login`, {
                email: userInfo.email,
                password: userInfo.password
            })

            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
                navigate("/dashboard")
            }
        } catch (err) {
            console.log("Eroare la login:", err.response?.data || err.message);
            if ( err.response?.status === 404 ){
                setError("Invalid email or password")
            } else {
                setError("Server error. Please try again later")
            }
        }


    }

    return (
        <div className="auth-form" onKeyDown={(e)=>{if(e.key === "Enter"){authLogin()}}}>

            <div className="titles-container-login">
                <p className="title">Welcome back</p>
                <p className="subtitle">Sign in to access your dashboard</p>
            </div>

            <div className="form-container">
                <input placeholder="Email address" type="email" value={userInfo.email} onChange={(input) => {
                    setUserInfo({ ...userInfo, email: input.target.value })
                }} />
                <input placeholder="Password" type="password" value={userInfo.password} onChange={(input) => {
                    setUserInfo({ ...userInfo, password: input.target.value })
                }} />
                <span className="error-message">{error}</span>
                <button onClick={()=>{authLogin()}}>Sign in</button>
            </div>

            <div className="switch-auth">
                <p>Don't have an account?</p>
                <span onClick={() => { setAuth("signup")}}>Sign up</span>
            </div>

        </div>
    );
}