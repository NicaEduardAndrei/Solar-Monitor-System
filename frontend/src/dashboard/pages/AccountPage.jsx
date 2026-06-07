import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE } from "../../../config"
import "./AccountPage.css"

export function AccountPage() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [usernameInput, setUsernameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [passwordInfo, setPasswordInfo] = useState({
        current: "",
        new: ""
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const isValidUsername = (username) => {
        return /^(?![0-9]+$)[a-zA-Z0-9_. ]{3,20}$/.test(username)
    }

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isValidPassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE}/dashboard`, {
                    headers: { Authorization: token }
                })
                setUser(response.data.user)
            } catch{
                localStorage.removeItem("token")
                navigate("/")
            }
        }
        fetchUser()
    }, [navigate])

    const changeUsername = async () => {
        setError("")
        setSuccess("")

        if (!usernameInput) {
            setError("Username required")
            return
        }
        if (!isValidUsername(usernameInput)) {
            setError("Invalid username format")
            return
        }

        try {
            const token = localStorage.getItem("token")
            await axios.put(`${API_BASE}/dashboard/username`,
                { username: usernameInput },
                { headers: { Authorization: token } }
            )
            setSuccess("Username updated successfully")
            setUsernameInput("")
            const response = await axios.get(`${API_BASE}/dashboard`, {
                headers: { Authorization: token }
            })
            setUser(response.data.user)
        } catch (err) {
            if (err.response?.status === 400) {
                setError("Invalid username format")
            } else {
                setError("Server error. Please try again later")
            }
        }
    }

    const changeEmail = async () => {
        setError("")
        setSuccess("")

        if (!emailInput) {
            setError("Email required")
            return
        }
        if (!isValidEmail(emailInput)) {
            setError("Invalid email format")
            return
        }

        try {
            const token = localStorage.getItem("token")
            await axios.put(`${API_BASE}/dashboard/email`,
                { email: emailInput },
                { headers: { Authorization: token } }
            )
            setSuccess("Email updated successfully")
            setEmailInput("")
            const response = await axios.get(`${API_BASE}/dashboard`, {
                headers: { Authorization: token }
            })
            setUser(response.data.user)
        } catch (err) {
            if (err.response?.status === 400) {
                setError("Invalid email format")
            } else if (err.response?.status === 409) {
                setError("Email already in use")
            } else {
                setError("Server error. Please try again later")
            }
        }
    }

    const changePassword = async () => {
        setError("")
        setSuccess("")

        if (!passwordInfo.current) {
            setError("Current password required")
            return
        }
        if (!passwordInfo.new) {
            setError("New password required")
            return
        }
        if (!isValidPassword(passwordInfo.new)) {
            setError("Password must be at least 8 characters and include a number")
            return
        }

        try {
            const token = localStorage.getItem("token")
            await axios.put(`${API_BASE}/dashboard/password`,
                { currentPassword: passwordInfo.current, newPassword: passwordInfo.new },
                { headers: { Authorization: token } }
            )
            setSuccess("Password updated successfully")
            setPasswordInfo({ current: "", new: "" })
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Current password is incorrect")
            } else if (err.response?.status === 400) {
                setError("Invalid password format")
            } else {
                setError("Server error. Please try again later")
            }
        }
    }

    const unlinkDevice = async () => {
        setError("")
        setSuccess("")

        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${API_BASE}/dashboard/delete-paired-device`, {
                headers: { Authorization: token }
            })
            navigate("/dashboard/pair")
        } catch (err) {
            if (err.response?.status === 404) {
                setError("No device linked")
            } else {
                setError("Server error. Please try again later")
            }
        }
    }

    if (!user) return null

    return (
        <>
            <div className="link-container-account">
                <div className="link-form-account">
                    <div className="titles-container-link-account">
                        <p className="title-account">Account settings</p>
                        <p className="subtitle-account">Manage your account and your paired device</p>
                        <div className="account-info">
                            <p>Username: <strong>{user.username}</strong></p>
                            <p>Email: <strong>{user.email}</strong></p>
                            {user.devices?.length > 0 ? (
                                <p>Paired Device ID: <strong>{user.devices[0].deviceId}</strong> Password: <strong>{user.devices[0].claimSecret}</strong></p>
                            ) : (
                                <p>No device linked</p>
                            )}
                            <button className="unlink-button" onClick={unlinkDevice}>Unlink device</button>
                            <div className="error-container">
                                <span className="error-message-account">{error}</span>
                                <span className="success-message-account">{success}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-container-account">
                        <p>Enter the new username in order to update it</p>
                        <input
                            placeholder="New username"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                        <button onClick={changeUsername}>Change username</button>

                        <p>Enter the new email in order to update it</p>
                        <input
                            placeholder="New email"
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <button onClick={changeEmail}>Change email</button>

                        <p>Enter the new password in order to update it</p>
                        <input
                            placeholder="Current password"
                            type="password"
                            value={passwordInfo.current}
                            onChange={(e) => setPasswordInfo({ ...passwordInfo, current: e.target.value })}
                        />
                        <input
                            placeholder="New password"
                            type="password"
                            value={passwordInfo.new}
                            onChange={(e) => setPasswordInfo({ ...passwordInfo, new: e.target.value })}
                        />
                        <button onClick={changePassword}>Change password</button>
                    </div>
                </div>
            </div>
        </>
    )
}