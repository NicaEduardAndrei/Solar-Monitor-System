import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { IP } from "../../config";
import { weatherAPI } from "../../config";

import "./DashboardLayout.css"

import overview from "../assets/dashboard/sidebar/overview.png";
import manualCalibration from "../assets/dashboard/sidebar/manualCalibration.png";
import faq from "../assets/dashboard/sidebar/faq.png";
import solarPanel from "../assets/dashboard/sidebar/solarPanel.png"
import settings from "../assets/dashboard/sidebar/settings.png"


export function DashboardLayout() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log(token)
        const isUser = async () => {
            try {
                const response = await axios.get(`http://${IP}:3000/dashboard`, {
                    headers: {
                        Authorization: token
                    }
                })
                setUser(response.data.user)
            } catch (err) {
                console.log("Token invalid:", err.response?.data || err.message);
                localStorage.removeItem("token")
                navigate("/")
            }
        }
        isUser()

        const getWeather = async () => {
            const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherAPI}&q=44.96,26.03`)
            setWeather(response.data)
        }
        getWeather()
    }, [navigate])


    return (
        <>
            <div className="dashboard-layout">
                {console.log(JSON.stringify(user))}
                <div className="sidebar-container">
                    <div className="profile-container">
                        {user?.username}
                        <div className="weather-info">
                            <img className="weather-img" src={"https:" + weather?.current?.condition?.icon}/>
                        <span>{weather?.current?.temp_c}°C {weather?.location?.name}</span>
                        </div>
                    </div>
                    <div className="sidebar-title">
                        <span>Solar Panel</span>
                        <img src={solarPanel} />
                    </div>
                    <div className="buttons-container">
                        <NavLink
                            to="/dashboard"
                            className="side-button">
                            <img src={overview} />
                            Overview
                        </NavLink>
                        <NavLink
                            to="manualcalibration"
                            className="side-button">
                            <img src={manualCalibration} />
                            Manual Calibration
                        </NavLink>
                        <NavLink
                            to="linkdevice"
                            className="side-button">
                            <img src={faq} />
                            F.A.Q
                        </NavLink>
                    </div>
                    <div className="sidebar-title">
                        <span>Settings</span>
                        <img src={settings} />
                    </div>
                    <div className="buttons-container">
                        <NavLink
                            to="/dashboard"
                            className="side-button">
                            <img src={overview} />
                            Overview
                        </NavLink>
                        <NavLink
                            to="manualcalibration"
                            className="side-button">
                            <img src={manualCalibration} />
                            Manual Calibration
                        </NavLink>
                        <NavLink
                            to="linkdevice"
                            className="side-button">
                            <img src={faq} />
                            F.A.Q
                        </NavLink>
                    </div>
                    <div>
                    </div>
                </div>
                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>
        </>
    )
}