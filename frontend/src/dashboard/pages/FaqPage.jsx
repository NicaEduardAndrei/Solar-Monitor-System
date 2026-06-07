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
                                <p>When you first create your account, you will be automatically redirected to the <strong>Link Device</strong> page. You can also access the <strong>User Manual</strong> page from the sidebar without pairing a device first.</p>
                                <p><strong>Step 1 — Connect to your device's WiFi:</strong> When your device powers on, it creates its own WiFi network called <strong>SolarPanel-Config</strong> (password: <strong>12345678</strong>). Connect your phone or laptop to this network.</p>
                                <p><strong>Step 2 — Configure WiFi:</strong> After connecting, open a browser and go to the <strong>IP address displayed on your device screen</strong> (shown after the battery checkup completes). You will see a configuration page where you can enter your home WiFi name and password. Save the settings and the device will restart to connect to your network.</p>
                                <p><strong>Step 3 — Get your Device ID and Password:</strong> Once the device connects to the internet, it will display a <strong>Device ID</strong> and a <strong>Password</strong> on its built-in screen. These are unique to your device. <strong>Note:</strong> If the screen shows "Server: off" (red), the password may not appear yet. This is normal — the device will automatically attempt to reconnect to the server periodically. Once the server comes back online, the password will be generated and displayed. You don't need to do anything, just wait.</p>
                                <p><strong>Step 4 — Link on the website:</strong> Go to the Link Device page on this website, enter the Device ID and Password exactly as shown on the screen, and click <strong>Link</strong>. Once paired, you will be redirected to the Dashboard Overview page.</p>
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
                                    <li><strong>Battery State</strong> — Shows whether the battery is currently "charging", "discharging", or "idle"</li>
                                    <li><strong>Battery Temp</strong> — The current battery temperature in degrees Celsius</li>
                                </ul>
                                <p><strong>Internal Load</strong> — Shows how much power is being consumed by internal systems connected to your setup. This includes the servo motors used for solar panel tracking.</p>
                                <p><strong>External Load / Out</strong> — Shows how much power is being consumed by external devices or your house. This represents the energy going out to power your appliances.</p>
                                <p><strong>Connection Status:</strong> At the bottom left of the diagram, you can see the status of each connection:</p>
                                <ul>
                                    <li><strong>Grid</strong> — Shows "Open" (connected) or "Closed" (disconnected)</li>
                                    <li><strong>Solar</strong> — Shows "Open" (connected) or "Closed" (disconnected)</li>
                                    <li><strong>Battery</strong> — Shows "Open" (connected) or "Closed" (disconnected)</li>
                                    <li><strong>External Load</strong> — Shows "Open" (connected) or "Closed" (disconnected)</li>
                                </ul>
                                <p><strong>Mode indicator:</strong> The device screen also shows the current operating mode: <strong>Hybrid</strong> (both solar and grid active), <strong>Solar</strong> (only solar), <strong>Grid</strong> (only grid), or <strong>Off</strong>.</p>
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
                                    <li><strong>24h</strong> — Shows data from the last 24 hours, with a reading every 5 minutes</li>
                                    <li><strong>7d</strong> — Shows data from the last 7 days, with a reading every 5 minutes</li>
                                    <li><strong>30d</strong> — Shows data from the last 30 days, with one reading per hour (combines all the 5-minute readings into hourly averages)</li>
                                    <li><strong>1y</strong> — Shows data from the last year, with one reading per day (combines all the hourly readings into daily averages)</li>
                                    <li><strong>All</strong> — Shows all available data since you started using the system, with one reading per week (combines all the daily readings into weekly averages)</li>
                                </ul>
                                <p><strong>Metrics:</strong> For each chart, you can choose to view Voltage (V), Amperes (A), Power (W), or All (which shows all three lines on the same chart).</p>
                                <p><strong>Hovering over the chart:</strong> When you hover over any point on a chart, you will see three values:</p>
                                <ul>
                                    <li><strong>MED</strong> — The average value for that time period (e.g., the average power for that day)</li>
                                    <li><strong>MIN</strong> — The minimum value recorded during that time period</li>
                                    <li><strong>MAX</strong> — The maximum value recorded during that time period</li>
                                </ul>
                                <p><strong>Battery Info chart:</strong> This dedicated chart lets you monitor your battery's Temperature and State of Charge (SOC) over time. You can view Temp, SOC, or both at the same time using the "All" option.</p>
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
                        <div className="faq-header" onClick={() => toggleSection("manual-calibration")}>
                            <span>Manual Calibration</span>
                            <span className="faq-icon">{openSection === "manual-calibration" ? "−" : "+"}</span>
                        </div>
                        {openSection === "manual-calibration" && (
                            <div className="faq-text">
                                <p>The Manual Calibration page gives you direct control over your solar system. By default, the system operates in <strong>Automatic Mode</strong>, where it handles solar panel tracking and relay switching on its own.</p>
                                <p><strong>Manual Mode:</strong> Toggle the Manual Mode switch to take full control. When enabled, you can:</p>
                                <ul>
                                    <li><strong>Control each relay individually</strong> — Toggle Solar, Grid, Battery, and Load connections on or off independently. For example, you can disconnect the grid and run purely on solar, or disconnect solar and switch to grid power.</li>
                                    <li><strong>Adjust solar panel position</strong> — Set the horizontal angle (azimuth, 0-180 degrees) and vertical angle (elevation, 20-90 degrees) of your solar panels. This allows you to manually aim the panels toward the sun or any direction you prefer.</li>
                                </ul>
                                <p><strong>GPS Map:</strong> The map on this page shows the real-time GPS location of your device. This is the same location used by the system to calculate the optimal solar panel angles for sun tracking in automatic mode.</p>
                                <p><strong>How automatic mode works:</strong> When Manual Mode is off, the system uses your GPS location (or manual coordinates if configured) and the current date/time from internet time servers to calculate where the sun is in the sky. It then automatically adjusts the solar panels to face the sun throughout the day. When the sun drops below 20 degrees elevation (sunset), the panels return to a resting sunrise position (horizontal 180°, vertical 20°).</p>
                                <p><strong>Note:</strong> Automatic solar tracking requires an internet connection to sync time from internet time servers. If your device loses internet, the panels will stop tracking until the connection is restored.</p>
                                <p><strong>Real-time feedback:</strong> Changes you make on this page are sent to your device through the internet connection. The switches on this page update in real time based on the device's actual state, not just when you click them. If you toggle a switch and it takes a few seconds to reflect the change on screen, this is normal — it simply means that's how long it took for the command to reach your device and for the device to respond.</p>
                            </div>
                        )}
                    </div>

                    <div className="faq-section">
                        <div className="faq-header" onClick={() => toggleSection("hardware")}>
                            <span>Hardware & Physical Switches</span>
                            <span className="faq-icon">{openSection === "hardware" ? "−" : "+"}</span>
                        </div>
                        {openSection === "hardware" && (
                            <div className="faq-text">
                                <p>Your solar system includes physical hardware components that you should be familiar with:</p>
                                <p><strong>Power Connections:</strong></p>
                                <ul>
                                    <li><strong>USB-C Input (15V)</strong> — This is the power input for the Grid connection. Connect your grid power supply here.</li>
                                    <li><strong>8-Pin Connector</strong> — This cable connects to your solar panels and tracking motors.</li>
                                    <li><strong>External Load Output</strong> — Two wires providing 5V at 2.5A maximum (12.5W max). Use this to power small external devices from your solar system.</li>
                                </ul>
                                <p><strong>Emergency Physical Switches:</strong> Your system has <strong>3 physical switches</strong> (one for Solar, one for Grid, and one for Battery) that act as manual emergency overrides. These allow you to physically disconnect a power source even if you have no internet connection or cannot access the website. Use these switches if you need to immediately cut off solar, grid, or battery power for safety reasons.</p>
                                <p><strong>Device Screen:</strong> The built-in screen on your device displays real-time information including:</p>
                                <ul>
                                    <li><strong>WiFi status</strong> — Whether the device is connected to your home network</li>
                                    <li><strong>Server status</strong> — Whether the device is communicating with the cloud server</li>
                                    <li><strong>Solar power</strong> — Current voltage, current, and wattage from your panels</li>
                                    <li><strong>Battery</strong> — Charge percentage, temperature, voltage, current, and wattage</li>
                                    <li><strong>External load</strong> — Power being consumed by connected appliances</li>
                                    <li><strong>Grid</strong> — Power being drawn from the electrical grid</li>
                                    <li><strong>Device ID and Password</strong> — Needed for pairing with the website</li>
                                    <li><strong>Connection status</strong> — Shows which circuits are on or off (Solar, Grid, Battery, Load)</li>
                                    <li><strong>Operating mode</strong> — Shows the current mode (Hybrid, Solar, Grid, or Off) and whether the system is in Auto or Manual mode</li>
                                </ul>
                                <p><strong>Solar Tracking Motors:</strong> Your system uses two motors to physically move the solar panels. One motor controls the horizontal direction (left/right, 0-180 degrees) and the other controls the vertical angle (up/down, 20-90 degrees). In automatic mode, these motors adjust throughout the day to keep the panels facing the sun.</p>
                                <p><strong>Manual GPS Configuration:</strong> If your device does not have a GPS module or if the GPS signal is weak, you can manually set the coordinates through the device's configuration portal. Connect to the SolarPanel-Config WiFi network, visit the <strong>IP address displayed on your device screen</strong> in your browser, and enter your latitude and longitude in the Manual GPS section. Leave both values at 0 to use the physical GPS module.</p>
                                <p><strong>Battery:</strong> The system uses a rechargeable lithium-ion battery pack. The battery charges from solar panels during the day and discharges to power your loads when solar production is low or at night. The system monitors the battery's charge level, temperature, and health continuously.</p>
                                <p><strong>Boot Process:</strong> When the device powers on, it performs a battery check that takes about 10 seconds. During this time, the system temporarily disconnects solar, grid, and load to get an accurate battery reading. After the check, all connections are restored and normal operation begins. The device then initializes the solar tracking motors, connects to your WiFi network, syncs time from internet servers, and establishes a secure connection to the cloud server.</p>
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
                                    <li><strong>Change Username</strong> — Enter a new username and click Change Username. Your username will update immediately on this page. To see the change reflected in the sidebar, refresh the page.</li>
                                    <li><strong>Change Email</strong> — Enter a new email address and click Change Email. The email must not already be in use by another account.</li>
                                    <li><strong>Change Password</strong> — Enter your current password and your new password, then click Change Password. Your new password must be at least 8 characters and include at least one number.</li>
                                    <li><strong>Unlink Device</strong> — Click the red Unlink Device button to remove the connection between your account and your device. After unlinking, you will be redirected to the Link Device page to pair a new device.</li>
                                </ul>
                                <p>When you change your username, email, or password, you will remain logged in. Only unlinking a device will redirect you away from the current page.</p>
                                <p>Your historical data is preserved even after unlinking a device. If you pair the same device again later, all previous data will still be available.</p>
                                <p><strong>Note:</strong> Your device records and stores data even without being paired to an account. As long as the device has WiFi and server connectivity, it will continue collecting data regardless of whether a user has paired it or not. Once you pair the device, all previously collected data becomes available in your account.</p>
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
                                <p>The weather widget in the sidebar shows the current temperature and weather conditions at the location where your solar panel system is installed. This location is determined automatically from your device's GPS. The weather information helps you understand how conditions may affect your solar energy production — for example, cloudy days will reduce solar output while clear sunny days will maximize it.</p>
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
                                    <li>Make sure your device has power</li>
                                    <li>Check the device screen — it should show WiFi: on (green) and Server: on (green)</li>
                                    <li>Make sure your home internet is working</li>
                                    <li>Try refreshing the page</li>
                                </ul>
                                <p><strong>No live data on the Overview page:</strong> Check that your device is powered on and connected to WiFi. The screen on the device will show red indicators if WiFi or Server is off. The connection will automatically attempt to re-establish when the device comes back online.</p>
                                <p><strong>Charts show 0 values:</strong> This means your device was offline (no internet connection) during that time period. The data was not collected.</p>
                                <p><strong>Charts have gaps with no lines:</strong> This means the server was offline during that period. No data was processed.</p>
                                <p><strong>"Invalid token" error:</strong> Your session expires after 1 hour of inactivity. Simply log in again to continue.</p>
                                <p><strong>Device cannot connect to WiFi:</strong> If the device screen shows WiFi: off (red), connect to the SolarPanel-Config network and re-enter your WiFi credentials through the configuration page at the <strong>IP address displayed on your device screen</strong> (shown after the battery checkup completes).</p>
                                <p><strong>GPS not working:</strong> If you're unsure whether your device has a GPS signal or not, check the indicator light on the bottom right of the device enclosure. A red LED blinking on and off once per second indicates the GPS module is actively searching for satellites. If the LED is not blinking, the GPS module may not be connected or may have a hardware issue.</p>
                                <p><strong>Solar panels not tracking the sun:</strong> Make sure the system is not in Manual Mode. Check the Manual Calibration page — if Manual Mode is turned on, the panels will not move automatically. Also ensure your device has a GPS signal (the map on Manual Calibration should show your location) or that you have configured manual GPS coordinates through the device portal. Finally, verify that your device has an internet connection — solar tracking requires time synchronization from internet servers to calculate the sun's position.</p>
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
                                    <li><strong>Data Buffer System</strong> — A buffer will be implemented so that brief internet outages on the device side will not result in missing data. Similarly, server-side buffering will prevent data gaps during brief server restarts.</li>
                                    <li><strong>Multiple Device Support</strong> — Future updates will allow a single user account to manage multiple devices simultaneously.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}