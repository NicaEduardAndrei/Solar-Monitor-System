import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUpForm({ setAuth }) {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        password: ""
    })

    const authSignup = async () => {
        try {

            const response = await axios.post("http://localhost:3000/auth/register", {
                username: userInfo.username,
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

            <div className="titles-container-signup">
                <p className="title">Create your account</p>
                <p className="subtitle">Start monitoring your solar system</p>
            </div>

            <div className="form-container">
                <input placeholder="Username" value={userInfo.username} onChange={(input)=>{
                    setUserInfo({...userInfo, username: input.target.value})
                }} />
                <input placeholder="Email address" value={userInfo.email} onChange={(input)=>{
                    setUserInfo({...userInfo, email: input.target.value})
                }}/>
                <input placeholder="Password" type="password" value={userInfo.password} onChange={(input)=>{
                    setUserInfo({...userInfo, password: input.target.value})
                }} />
                <button onClick={authSignup}>Sign up</button>
            </div>

            <div className="switch-auth">
                <p>Already have an account?</p>
                <span onClick={() => setAuth("login")}>Sign in</span>
            </div>

        </div>
    );
}