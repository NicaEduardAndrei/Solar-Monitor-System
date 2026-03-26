import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { IP } from "../../config";
import "./DashboardLayout.css"

import overview from "../assets/dashboard/sidebar/overview.png";
import manualCalibration from "../assets/dashboard/sidebar/manualCalibration.png";
import faq from "../assets/dashboard/sidebar/faq.png";


export function DashboardLayout() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

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
                navigate("/")
            }
        }
        isUser()

    }, [navigate])

    return (
        <>
            <div className="dashboard-layout">
                {console.log(JSON.stringify(user))}
                <div className="sidebar-container">
                    <div className="profile-container">
                        profile
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
                            to="FAQ"
                            className="side-button">
                            <img src={faq} />
                            F.A.Q
                        </NavLink>
                    </div>

                </div>
                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>
        </>
    )
}