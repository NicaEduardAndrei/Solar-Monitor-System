import { useState } from "react"
import "./FaqPage.css"

export function FaqPage() {
    const [openSection, setOpenSection] = useState(null)

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    return (
        <>
            <div className="faq-container">
                <div className="faq-content-wrapper">
                    <p className="faq-title">User Manual</p>
                    <p className="faq-subtitle">Everything you need to know about using the solar monitoring system</p>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("pairing")}>
                            <span>How to Pair Your Device</span>
                            <span className="faq-icon">{openSection === "pairing" ? "−" : "+"}</span>
                        </div>
                        {openSection === "pairing" && (
                            <div className="faq-text">
                                <p>When you first create your account, you will be automatically redirected to the Link Device page. You cannot access any other pages until you pair a device.</p>
                                <p>Your ESP32 device has a physical screen that displays two important values: <strong>Device ID</strong> and <strong>Claim Secret</strong> (password). These are generated when the device is powered on for the first time.</p>
                                <p>Enter both values on the Link Device page and click <strong>Link</strong>. Once paired successfully, you will be redirected to the Dashboard Overview page where you can start monitoring your solar system in real time.</p>
                                <p>Each device can only be linked to one account. If you want to pair a different device, you must first unlink the current one from Account Settings.</p>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("overview")}>
                            <span>Dashboard Overview</span>
                            <span className="faq-icon">{openSection === "overview" ? "−" : "+"}</span>
                        </div>
                        {openSection === "overview" && (
                            <div className="faq-text">
                                <p>The Overview page is the main dashboard. It shows a live energy flow diagram that updates approximately every second. If your internet connection is slow, updates may take slightly longer.</p>
                                <p><strong>Energy Flow Diagram:</strong> The diagram visualizes how energy moves through your system. Each component displays its current power in Watts (W), Voltage (V), and Amperes (A).</p>
                                <p><strong>Solar</strong> — Shows how much power your solar panels are currently producing. The green animated line from Solar to MPPT indicates active solar energy flow.</p>
                                <p><strong>Grid</strong> — Shows how much power is being drawn from the electrical grid. The green animated line from Grid to MPPT indicates active grid energy flow.</p>
                                <p><strong>MPPT</strong> — The Maximum Power Point Tracker combines energy from both solar and grid sources. The value shown is the total combined input.</p>
                                <p><strong>Battery</strong> — Shows your battery status. The green animated line points toward the battery when it is charging (storing energy) and away from the battery when it is discharging (supplying energy). You can also see:</p>
                                <ul>
                                    <li><strong>Battery SOC</strong> — State of Charge, the battery percentage (e.g., 73% means the battery is 73% full)</li>
                                    <li><strong>Battery State</strong> — Shows whether the battery is currently "charging" or "discharging"</li>
                                    <li><strong>Battery Temp</strong> — The current battery temperature in Celsius</li>
                                </ul>
                                <p><strong>Internal Load</strong> — Shows how much power is being consumed by internal systems connected to your setup.</p>
                                <p><strong>External Load / Out</strong> — Shows how much power is being consumed by external devices or your house. This represents the energy going out to power your appliances.</p>
                                <p><strong>Connection Status:</strong> At the bottom left of the diagram, you can see the status of each connection:</p>
                                <ul>
                                    <li><strong>Grid</strong> — Shows "Open" or "Closed" (whether the grid connection is active)</li>
                                    <li><strong>Solar</strong> — Shows "Open" or "Closed" (whether the solar connection is active)</li>
                                    <li><strong>Battery</strong> — Shows "Open" or "Closed" (whether the battery connection is active)</li>
                                    <li><strong>External Load</strong> — Shows "Open" or "Closed" (whether the external load connection is active)</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("history")}>
                            <span>History & Charts</span>
                            <span className="faq-icon">{openSection === "history" ? "−" : "+"}</span>
                        </div>
                        {openSection === "history" && (
                            <div className="faq-text">
                                <p>The History page displays detailed charts for each component of your system: Solar, Grid, Battery, Internal Load, and External Load. There is also a Battery Info chart showing temperature and state of charge over time.</p>
                                <p><strong>Time Ranges:</strong> Each chart has a time range selector at the top:</p>
                                <ul>
                                    <li><strong>24h</strong> — Shows data from the last 24 hours, with readings every 5 minutes</li>
                                    <li><strong>7d</strong> — Shows data from the last 7 days, with readings every 5 minutes</li>
                                    <li><strong>30d</strong> — Shows data from the last 30 days, with readings aggregated hourly</li>
                                    <li><strong>1y</strong> — Shows data from the last year, with readings aggregated daily</li>
                                    <li><strong>All</strong> — Shows all available data since you started using the system, with readings aggregated weekly</li>
                                </ul>
                                <p><strong>Metrics:</strong> For each chart, you can choose to view Voltage (V), Amperes (A), Power (W), or All (which shows all three lines on the same chart).</p>
                                <p><strong>Hovering over the chart:</strong> When you hover over any point on a chart, you will see three values:</p>
                                <ul>
                                    <li><strong>MED</strong> — The average value for that time period (e.g., the average power for that day)</li>
                                    <li><strong>MIN</strong> — The minimum value recorded during that time period</li>
                                    <li><strong>MAX</strong> — The maximum value recorded during that time period</li>
                                </ul>
                                <p><strong>Energy Summary:</strong> At the bottom of the History page, you will find the Energy Summary table. This shows the total energy across all time ranges:</p>
                                <ul>
                                    <li><strong>Solar</strong> — Total energy produced by your solar panels</li>
                                    <li><strong>Grid</strong> — Total energy drawn from the electrical grid</li>
                                    <li><strong>Consumption</strong> — Total energy consumed by your system (both internal and external loads combined)</li>
                                </ul>
                                <p>Note: This system does not inject energy back into the grid. All solar energy is either stored in the battery or consumed by your loads.</p>
                                <p><strong>Understanding gaps in charts:</strong></p>
                                <ul>
                                    <li>If you see <strong>values of 0</strong> across all metrics, it means your device was offline (no internet connection) during that period</li>
                                    <li>If you see <strong>complete gaps with no lines at all</strong>, it means the server was offline during that period</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("account")}>
                            <span>Account Settings</span>
                            <span className="faq-icon">{openSection === "account" ? "−" : "+"}</span>
                        </div>
                        {openSection === "account" && (
                            <div className="faq-text">
                                <p>In Account Settings you can manage your profile and device:</p>
                                <ul>
                                    <li><strong>Change Username</strong> — Enter a new username and click Change Username. Your username will update immediately and the change will be reflected in the sidebar.</li>
                                    <li><strong>Change Email</strong> — Enter a new email address and click Change Email. The email must not already be in use by another account.</li>
                                    <li><strong>Change Password</strong> — Enter your current password and your new password, then click Change Password. Your new password must be at least 8 characters and include at least one number.</li>
                                    <li><strong>Unlink Device</strong> — Click the red Unlink Device button to remove the connection between your account and your ESP32 device. After unlinking, you will be redirected to the Link Device page to pair a new device.</li>
                                </ul>
                                <p>When you change your username, email, or password, you will remain logged in. Only unlinking a device will redirect you away from the current page.</p>
                                <p>Your historical data is preserved even after unlinking a device. If you pair the same device again later, all previous data will still be available.</p>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("weather")}>
                            <span>Weather Widget</span>
                            <span className="faq-icon">{openSection === "weather" ? "−" : "+"}</span>
                        </div>
                        {openSection === "weather" && (
                            <div className="faq-text">
                                <p>The weather widget in the sidebar shows the current temperature and weather conditions at the location where your solar panel system is installed. This helps you understand how weather conditions may affect your solar energy production.</p>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("troubleshooting")}>
                            <span>Troubleshooting</span>
                            <span className="faq-icon">{openSection === "troubleshooting" ? "−" : "+"}</span>
                        </div>
                        {openSection === "troubleshooting" && (
                            <div className="faq-text">
                                <p><strong>Overview page shows "Connecting..." for too long:</strong></p>
                                <ul>
                                    <li>Make sure your ESP32 device has power</li>
                                    <li>Make sure your device is connected to the internet</li>
                                    <li>Make sure the server is running</li>
                                    <li>Try refreshing the page</li>
                                </ul>
                                <p><strong>No live data on the Overview page:</strong> Check that your ESP32 device is powered on and connected to WiFi. The WebSocket connection will automatically attempt to reconnect when the device comes back online.</p>
                                <p><strong>Charts show 0 values:</strong> This means your device was offline (no internet connection) during that time period. The data was not collected.</p>
                                <p><strong>Charts have gaps with no lines:</strong> This means the server was offline during that period. No data was processed.</p>
                                <p><strong>"Invalid token" error:</strong> Your session expires after 1 hour of inactivity. Simply log in again to continue.</p>
                                <p><strong>Device not pairing:</strong> Make sure you are entering the Device ID and Claim Secret exactly as shown on your ESP32 screen. These values are case-sensitive.</p>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("coming-soon")}>
                            <span>Coming Soon</span>
                            <span className="faq-icon">{openSection === "coming-soon" ? "−" : "+"}</span>
                        </div>
                        {openSection === "coming-soon" && (
                            <div className="faq-text">
                                <p>The following features are planned for future updates:</p>
                                <ul>
                                    <li><strong>Manual Calibration Mode</strong> — Switch between automatic and manual control of your system. In manual mode, you will be able to control each relay individually, set solar panel angles (left/right, up/down), and view your device's GPS location on a map for sun tracking. In automatic mode, the system handles everything on its own including solar tracking and relay control.</li>
                                    <li><strong>Data Buffer System</strong> — A buffer will be implemented so that brief internet outages on the device side will not result in missing data. Similarly, server-side buffering will prevent data gaps during brief server restarts.</li>
                                    <li><strong>Multiple Device Support</strong> — Future updates will allow a single user account to manage multiple ESP32 devices simultaneously.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}