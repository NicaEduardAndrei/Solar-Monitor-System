import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IP } from "../../config";

export function SignUpForm({ setAuth }) {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [error , setError] = useState("")

    const isValidEmail = (email)=>{
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const isValidUsername = (username)=>{
        return /^(?![0-9]+$)[a-zA-Z0-9_. ]{3,20}$/.test(username)
    }

    const isValidPassword = (password)=>{
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)
    }

    const authSignup = async () => {

        setError("")

        if (!userInfo.username){
            setError("Username required")
            return;
        }
        if (!isValidUsername(userInfo.username)){
            setError("Username can only contain letters, numbers, underscores, and dots.")
            return;
        }
        

        if(!userInfo.email){
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
        if (!isValidPassword(userInfo.password)){
            setError("Password must be at least 8 characters and include a number")
            return;
        }

        try {

            const response = await axios.post(`http://${IP}:3000/auth/register`, {
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
            if ( err.response?.status === 409 ){
                setError("An account with this email already exists. Try signing in.")
            } else {
                setError("Server error. Please try again later")
            }
        }
    }


    return (
        <div className="auth-form" onKeyDown={(e)=>{if(e.key === "Enter"){authSignup()}}}>

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
                <span className="error-message">{error}</span>
                <button onClick={authSignup}>Sign up</button>
            </div>

            <div className="switch-auth">
                <p>Already have an account?</p>
                <span onClick={() => setAuth("login")}>Sign in</span>
            </div>

        </div>
    );
}