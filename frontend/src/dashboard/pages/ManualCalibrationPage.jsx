import Switch from "react-switch";
import { useState, useEffect, useRef } from "react";
import { connectWebSocket, onTelemetry, sendCommand } from "../../services/websocket"
import axios from "axios";
import { IP } from "../../../config.js"
import animationLoading from "../../assets/dashboard/animation/loading-animations/loading-animation.gif"
import "./ManualCalibrationPage.css"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const greenIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="
    
    width:16px;
    height:16px;
    background:rgb(21, 255, 0);
    border-radius:50%;
    border:2px solid rgb(0, 255, 21);
    box-shadow:0 0 10px rgb(0, 255, 136);
    
    "></div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
})

export function ManualCalibrationPage() {

    const [deviceId, setDeviceId] = useState(null)
    const [liveData, setLiveData] = useState(null)
    const servoAzRef = useRef(null)
    const servoElRef = useRef(null)

    useEffect(() => {
        const fetchDevice = async () => {
            const token = localStorage.getItem("token")
            const res = await axios.get(`http://${IP}:3000/dashboard`, {
                headers: { Authorization: token }
            })
            if (res.data.user.devices.length > 0) {
                setDeviceId(res.data.user.devices[0].deviceId)
            }
        }
        fetchDevice()
    }, [])

    useEffect(() => {
        connectWebSocket()
        const unsubscribe = onTelemetry((data) => {
            setLiveData(data);
        })
        return () => unsubscribe()
    }, [])

    if (!liveData) return (
        <>
            <div className="loading-screen">
                <div className="connecting">Connecting...</div>
                <div className="scene">
                    <img src={animationLoading} className="animation" />
                </div>
                <div className="info">
                    <h2>If this takes too long, please check :</h2>
                    <p className="info-text">• System has power</p>
                    <p className="info-text">• System is connected to internet</p>
                    <p className="info-text">• Server is running</p>
                    <p className="info-text">• Try refreshing the page</p>
                </div>
            </div>
        </>
    )

    const handleSwitchChange = (key, value) => {
        if (!deviceId) return
        const payload = {
            manual: key === "manual" ? value : liveData.manual,
            relay1: key === "relay1" ? value : liveData.relay1,
            relay2: key === "relay2" ? value : liveData.relay2,
            relay3: key === "relay3" ? value : liveData.relay3,
            relay4: key === "relay4" ? value : liveData.relay4,
            servoAz: key === "servoAz" ? value : liveData.servoAz,
            servoEl: key === "servoEl" ? value : liveData.servoEl,
        }
        sendCommand(deviceId, payload)
    }

    return (
        <div className="calibration-container">
            <div className="calibration-form">
                <h2 className="calibration-title">Manual Calibration</h2>
                <div className="calibration-body">
                    <div className="calibration-options">
                        <div className="switch-row">
                            <span>Manual Mode</span>
                            <Switch
                                onChange={(value) => handleSwitchChange("manual", value)}
                                checked={liveData.manual}
                                onColor="#1b9c4b"
                                offColor="#888"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </div>
                        <div className="switch-row">
                            <span>Relay 1</span>
                            <Switch
                                onChange={(value) => handleSwitchChange("relay1", value)}
                                checked={liveData.relay1}
                                onColor="#1b9c4b"
                                offColor="#888"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </div>
                        <div className="switch-row">
                            <span>Relay 2</span>
                            <Switch
                                onChange={(value) => handleSwitchChange("relay2", value)}
                                checked={liveData.relay2}
                                onColor="#1b9c4b"
                                offColor="#888"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </div>
                        <div className="switch-row">
                            <span>Relay 3</span>
                            <Switch
                                onChange={(value) => handleSwitchChange("relay3", value)}
                                checked={liveData.relay3}
                                onColor="#1b9c4b"
                                offColor="#888"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </div>
                        <div className="switch-row">
                            <span>Relay 4</span>
                            <Switch
                                onChange={(value) => handleSwitchChange("relay4", value)}
                                checked={liveData.relay4}
                                onColor="#1b9c4b"
                                offColor="#888"
                                uncheckedIcon={false}
                                checkedIcon={false}
                            />
                        </div>
                        <div className="servo-row">
                            <p>Servo 1 (azimuth){"\u00A0"}{"\u00A0"}{"\u00A0"}</p>
                            <input ref={servoAzRef} placeholder={liveData.servoAz?.toFixed(2) ?? "0.00"} />
                            <button onClick={() => {
                                const value = parseFloat(servoAzRef.current.value)
                                if (!isNaN(value)) handleSwitchChange("servoAz", value)
                            }}>SET</button>
                        </div>
                        <div className="servo-row">
                            <p>Servo 2 (elevation)</p>
                            <input ref={servoElRef} placeholder={liveData.servoEl?.toFixed(2) ?? "0.00"} />
                            <button onClick={() => {
                                const value = parseFloat(servoElRef.current.value)
                                if (!isNaN(value)) handleSwitchChange("servoEl", value)
                            }}>SET</button>
                        </div>
                    </div>

                    <div className="calibration-map">
                        <MapContainer center={[liveData.lat, liveData.long]} zoom={14} className="map-container">
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker position={[liveData.lat, liveData.long]} icon={greenIcon} />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}