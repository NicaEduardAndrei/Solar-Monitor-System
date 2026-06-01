import { IP } from "../../../config";
import { useState, useEffect } from "react";
import axios from "axios";
import "./LinkDevicePage.css";
import { useNavigate } from "react-router-dom";

export function LinkDevicePage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [deviceInfo, setDeviceInfo] = useState({
        deviceId: "",
        claimSecret: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token")
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://${IP}:3000/dashboard`, {
                    headers: { Authorization: token }
                })
                setUser(response.data.user)
            } catch {
                localStorage.removeItem("token")
                navigate("/")
            }
        }
        fetchUser()
    }, [navigate])

    if (!user) return null

    if (user.devices?.length > 0) {
        return (
            <div className="link-container">
                <p className="title">You already have a device paired</p>
            </div>
        )
    }

    const deviceLink = async () => {
        const token = localStorage.getItem("token");

        if (!deviceInfo.deviceId) {
            setError("DeviceID required");
            return;
        }

        if (!deviceInfo.claimSecret) {
            setError("Password required");
            return;
        }

        try {
            const response = await axios.post(
                `http://${IP}:3000/dashboard/pair-device`,
                {
                    deviceId: deviceInfo.deviceId,
                    claimSecret: deviceInfo.claimSecret
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            console.log(response.data);
            setError("");
            window.location.href = "/dashboard"
        } catch (err) {
            console.log(err.response?.data);

           if ( err.response?.status === 404 ){
                setError("Invalid Device ID or password")
            } else {
                setError("Server error. Please try again later")
            }
        }
    };

    return (
        <>
            <div className="link-container">
                <div className="link-form">
                    <div className="titles-container-link">
                        <p className="title">Add your first device</p>
                        <p className="subtitle">Link a device to start viewing and managing your data</p>
                    </div>
                    <div className="form-container">
                        <input
                            placeholder="Device ID"
                            value={deviceInfo.deviceId}
                            onChange={(input) => {
                                setDeviceInfo({ ...deviceInfo, deviceId: input.target.value });
                            }}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={deviceInfo.claimSecret}
                            onChange={(input) => {
                                setDeviceInfo({ ...deviceInfo, claimSecret: input.target.value });
                            }}
                        />
                        <span className="error-message">{error}</span>
                        <button onClick={() => { deviceLink(); }}>Link</button>
                    </div>
                </div>
            </div>
        </>
    );
}
