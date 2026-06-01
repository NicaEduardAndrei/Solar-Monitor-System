import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom"
import { IP } from "../../config"
import { weatherAPI } from "../../config"

import "./DashboardLayout.css"

import overview from "../assets/dashboard/sidebar/overview.png"
import manualCalibration from "../assets/dashboard/sidebar/manualCalibration.png"
import faq from "../assets/dashboard/sidebar/faq.png"
import solarPanel from "../assets/dashboard/sidebar/solarPanel.png"
import settings from "../assets/dashboard/sidebar/settings.png"
import history from "../assets/dashboard/sidebar/charts.png"
import logout from "../assets/dashboard/sidebar/logout.png"
import account from "../assets/dashboard/sidebar/account-settings.png"
import pair from "../assets/dashboard/sidebar/pair.png"

export function DashboardLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUser] = useState(null)
    const [weather, setWeather] = useState(null)
    const [selectedButton, setSelectedButton] = useState("")

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
                console.log("Token invalid:", err.response?.data || err.message)
                localStorage.removeItem("token")
                navigate("/")
            }
        }

        isUser()

        const getWeather = async () => {
            const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${weatherAPI}&q=lipanesti`
            )
            setWeather(response.data)
        }

        getWeather()
    }, [navigate, location.pathname])

    const hasDevice = user?.devices?.length > 0

    useEffect(() => {
        if (!user) return
        if (!hasDevice && location.pathname !== "/dashboard/pair" && location.pathname !== "/dashboard/faq") {
            navigate("/dashboard/pair")
            return
        }
    }, [user, hasDevice, location.pathname, navigate])

    if (!user) {
        return null
    }

    return (
        <>
            <div className="dashboard-layout">
                {console.log(JSON.stringify(user))}
                <div className="sidebar-container">
                    <div className="profile-container">
                        {user?.username}
                        <div className="weather-info">
                            <img
                                className="weather-img"
                                src={"https:" + weather?.current?.condition?.icon}
                            />
                            <span>
                                {weather?.current?.temp_c}°C {weather?.location?.name}
                            </span>
                        </div>
                    </div>

                    <div className="sidebar-title">
                        <span>Solar Panel</span>
                        <img src={solarPanel} />
                    </div>

                    <div className="buttons-container">
                        <NavLink
                            to="/dashboard"
                            className={selectedButton === "overview" ? "side-button-active" : "side-button"}
                            onClick={(e) => {
                                if (!hasDevice) {
                                    e.preventDefault()
                                    return
                                }
                                setSelectedButton("overview")
                            }}
                        >
                            <img src={overview} />
                            Overview
                        </NavLink>

                        <NavLink
                            to="history"
                            className={selectedButton === "history" ? "side-button-active" : "side-button"}
                            onClick={(e) => {
                                if (!hasDevice) {
                                    e.preventDefault()
                                    return
                                }
                                setSelectedButton("history")
                            }}
                        >
                            <img src={history} />
                            History
                        </NavLink>

                        <NavLink
                            to="manualcalibration"
                            className={selectedButton === "manualCalibration" ? "side-button-active" : "side-button"}
                            onClick={(e) => {
                                if (!hasDevice) {
                                    e.preventDefault()
                                    return
                                }
                                setSelectedButton("manualCalibration")
                            }}
                        >
                            <img src={manualCalibration} />
                            Manual Calibration
                        </NavLink>

                    </div>


                    <div className="sidebar-title">
                        <span>Settings</span>
                        <img src={settings} />
                    </div>

                    <div className="buttons-container">
                        <NavLink
                            to="account"
                            className={selectedButton === "account" ? "side-button-active" : "side-button"}
                            onClick={(e) => {
                                if (!hasDevice) {
                                    e.preventDefault()
                                    return
                                }
                                setSelectedButton("account")
                            }}
                        >
                            <img src={account} />
                            Account
                        </NavLink>

                        <NavLink
                            to="pair"
                            className={selectedButton === "pair" ? "side-button-active" : "side-button"}
                            onClick={() => setSelectedButton("pair")}
                        >
                            <img src={pair} />
                            Pair Device
                        </NavLink>



                        <NavLink
                            to="faq"
                            className={selectedButton === "faq" ? "side-button-active" : "side-button"}
                            onClick={() => setSelectedButton("faq")}
                        >
                            <img src={faq} />
                            F.A.Q
                        </NavLink>
                    </div>
                            
                    <div className="logout-sidebar">
                        <p className="logout-text" 
                            onClick={()=>{
                                localStorage.removeItem("token")
                                navigate("/")
                            }}>Log Out</p>
                        <img src={logout} className="logout-image"/>
                    </div>
                </div>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </>
    )
}