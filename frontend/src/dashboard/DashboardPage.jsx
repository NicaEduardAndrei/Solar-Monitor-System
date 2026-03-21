import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { IP } from "../../config";

export function DashboardPage() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(null)

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

                setUserInfo(response.data.user)

            } catch (err) {
                console.log("Token invalid:", err.response?.data || err.message);
                navigate("/")
            }
        }

        isUser()

    }, [navigate])

    return (
        <>
            <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </>
    )
}