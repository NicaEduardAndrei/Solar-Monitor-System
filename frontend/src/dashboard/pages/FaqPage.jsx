import "./FaqPage.css"

export function FaqPage() {
    return (
        <div className="faq-container">
            <div className="faq-content-wrapper">
                <p className="faq-title">User Manual</p>
                <p className="faq-subtitle">Everything you need to know about using the solar monitoring system</p>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>How to Pair Your Device</span>
                    </div>
                    <div className="faq-text">
                        <p>When you first create your account, you will be automatically redirected to the <strong>Link Device</strong> page. You can also access the <strong>User Manual</strong> page from the sidebar without pairing a device first.</p>
                        <p><strong>Step 1 — Register your device:</strong> Your IoT device must first register with the server using the device registration API. This requires a shared secret key provided by the system administrator. The device generates a unique identifier and creates an HMAC signature for authentication.</p>
                        <p><strong>Step 2 — Obtain credentials:</strong> After successful registration, the server provides a device password (claim secret) that is used to link the device to your account. This password is displayed on the device interface or can be retrieved through the device's configuration portal.</p>
                        <p><strong>Step 3 — Connect to the network:</strong> Ensure your device is connected to the internet and can reach the server. The device will establish a WebSocket connection and authenticate using the HMAC signature.</p>
                        <p><strong>Step 4 — Link on the website:</strong> Go to the Link Device page on this website, enter the Device ID and Password exactly as provided by your device, and click <strong>Link</strong>. Once paired, you will be redirected to the Dashboard Overview page.</p>
                        <p>Each device can only be linked to one account. If you want to pair a different device, you must first unlink the current one from Account Settings.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Dashboard Overview</span>
                    </div>
                    <div className="faq-text">
                        <p>The Overview page is the main dashboard. It shows a live energy flow diagram that updates approximately every second. If your internet connection is slow, updates may take slightly longer.</p>
                        <p><strong>Energy Flow Diagram:</strong> The diagram visualizes how energy moves through your system. Each component displays its current power in Watts (W), Voltage (V), and Amperes (A).</p>
                        <p><strong>Solar</strong> — Shows how much power your solar panels are currently producing. The green animated line from Solar to MPPT indicates active solar energy flow.</p>
                        <p><strong>Grid</strong> — Shows how much power is being drawn from the electrical grid. The green animated line from Grid to MPPT indicates active grid energy flow.</p>
                        <p><strong>MPPT</strong> — The Maximum Power Point Tracker combines energy from both solar and grid sources. The value shown is the total combined input.</p>
                        <p><strong>Battery</strong> — Shows your battery status. The green animated line points toward the battery when it is charging (storing energy) and away from the battery when it is discharging (supplying energy). You can also see:</p>
                        <p>• <strong>Battery SOC</strong> — State of Charge, the battery percentage (e.g., 73% means the battery is 73% full)</p>
                        <p>• <strong>Battery State</strong> — Shows whether the battery is currently "charging", "discharging", or "idle"</p>
                        <p>• <strong>Battery Temp</strong> — The current battery temperature in degrees Celsius</p>
                        <p><strong>Internal Load</strong> — Shows how much power is being consumed by internal systems connected to your setup.</p>
                        <p><strong>External Load / Out</strong> — Shows how much power is being consumed by external devices or your house. This represents the energy going out to power your appliances.</p>
                        <p><strong>Connection Status:</strong> At the bottom left of the diagram, you can see the status of each connection:</p>
                        <p>• <strong>Grid</strong> — Shows "Open" (connected) or "Closed" (disconnected)</p>
                        <p>• <strong>Solar</strong> — Shows "Open" (connected) or "Closed" (disconnected)</p>
                        <p>• <strong>Battery</strong> — Shows "Open" (connected) or "Closed" (disconnected)</p>
                        <p>• <strong>External Load</strong> — Shows "Open" (connected) or "Closed" (disconnected)</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>History & Charts</span>
                    </div>
                    <div className="faq-text">
                        <p>The History page displays detailed charts for each component of your system: Solar, Grid, Battery, Internal Load, and External Load. There is also a Battery Info chart showing temperature and state of charge over time.</p>
                        <p><strong>Time Ranges:</strong> Each chart has a time range selector at the top:</p>
                        <p>• <strong>24h</strong> — Shows data from the last 24 hours, with a reading every 5 minutes</p>
                        <p>• <strong>7d</strong> — Shows data from the last 7 days, with a reading every 5 minutes</p>
                        <p>• <strong>30d</strong> — Shows data from the last 30 days, with one reading per hour (combines all the 5-minute readings into hourly averages)</p>
                        <p>• <strong>1y</strong> — Shows data from the last year, with one reading per day (combines all the hourly readings into daily averages)</p>
                        <p>• <strong>All</strong> — Shows all available data since you started using the system, with one reading per week (combines all the daily readings into weekly averages)</p>
                        <p><strong>Metrics:</strong> For each chart, you can choose to view Voltage (V), Amperes (A), Power (W), or All (which shows all three lines on the same chart).</p>
                        <p><strong>Hovering over the chart:</strong> When you hover over any point on a chart, you will see three values:</p>
                        <p>• <strong>MED</strong> — The average value for that time period (e.g., the average power for that day)</p>
                        <p>• <strong>MIN</strong> — The minimum value recorded during that time period</p>
                        <p>• <strong>MAX</strong> — The maximum value recorded during that time period</p>
                        <p><strong>Battery Info chart:</strong> This dedicated chart lets you monitor your battery's Temperature and State of Charge (SOC) over time. You can view Temp, SOC, or both at the same time using the "All" option.</p>
                        <p><strong>Energy Summary:</strong> At the bottom of the History page, you will find the Energy Summary table. This shows the total energy across all time ranges:</p>
                        <p>• <strong>Solar</strong> — Total energy produced by your solar panels</p>
                        <p>• <strong>Grid</strong> — Total energy drawn from the electrical grid</p>
                        <p>• <strong>Consumption</strong> — Total energy consumed by your system (both internal and external loads combined)</p>
                        <p><strong>Understanding gaps in charts:</strong></p>
                        <p>• If you see <strong>values of 0</strong> across all metrics, it means your device was offline (no internet connection) during that period</p>
                        <p>• If you see <strong>complete gaps with no lines at all</strong>, it means the server was offline during that period</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Manual Calibration</span>
                    </div>
                    <div className="faq-text">
                        <p>The Manual Calibration page gives you direct control over your solar system. The availability of controls depends on your device's capabilities and the sensors it reports.</p>
                        <p><strong>Manual Mode:</strong> If your device supports manual control, you can toggle the Manual Mode switch to take direct control. When enabled, you may be able to:</p>
                        <p>• <strong>Control relays individually</strong> — Toggle power connections on or off independently, if your device has relay control capabilities</p>
                        <p>• <strong>Adjust device parameters</strong> — Set values for configurable parameters such as motor positions or other actuators, if supported by your device</p>
                        <p><strong>GPS Map:</strong> If your device provides GPS coordinates, the map on this page shows the real-time location of your device. This is useful for mobile solar systems or for verifying the installation location.</p>
                        <p><strong>Real-time feedback:</strong> Changes you make on this page are sent to your device through the WebSocket connection. The controls on this page update in real time based on the device's actual state. If you toggle a switch and it takes a few seconds to reflect the change on screen, this is normal — it simply means that's how long it took for the command to reach your device and for the device to respond.</p>
                        <p><strong>Note:</strong> Not all devices support manual control. If the controls are not available or do not respond, your device may be configured for automatic operation only, or may not support remote command execution.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Troubleshooting</span>
                    </div>
                    <div className="faq-text">
                        <p><strong>Overview page shows "Connecting..." for too long:</strong></p>
                        <p>• Make sure your device has power and is connected to the internet</p>
                        <p>• Verify the device has successfully registered with the server</p>
                        <p>• Check that your network connection is working properly</p>
                        <p>• Try refreshing the page</p>
                        <p><strong>No live data on the Overview page:</strong> Check that your device is powered on and has an active WebSocket connection to the server. The device should be sending telemetry data at regular intervals.</p>
                        <p><strong>Charts show 0 values:</strong> This means your device was offline (no internet connection) during that time period. The telemetry data was not transmitted to the server.</p>
                        <p><strong>Charts have gaps with no lines:</strong> This means the server was offline during that period. No data was processed or stored.</p>
                        <p><strong>"Invalid token" error:</strong> Your session has expired. Simply log in again to continue using the platform.</p>
                        <p><strong>Device cannot connect to the server:</strong> Verify that your device has the correct server address and that the shared secret key is properly configured. Check firewall settings and ensure the WebSocket port is accessible.</p>
                        <p><strong>Commands not being executed:</strong> Ensure your device is in manual mode (if applicable) and that it properly processes incoming WebSocket messages. Check the device logs for any command parsing errors.</p>
                        <p><strong>GPS not working:</strong> If your device has a GPS module, ensure it has a clear view of the sky for satellite acquisition. GPS coordinates are optional — the platform will function without location data, but the map feature will not display your device location.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Account Settings</span>
                    </div>
                    <div className="faq-text">
                        <p>In Account Settings you can manage your profile and device:</p>
                        <p>• <strong>Change Username</strong> — Enter a new username and click Change Username. Your username will update immediately on this page. To see the change reflected in the sidebar, refresh the page.</p>
                        <p>• <strong>Change Email</strong> — Enter a new email address and click Change Email. The email must not already be in use by another account.</p>
                        <p>• <strong>Change Password</strong> — Enter your current password and your new password, then click Change Password. Your new password must be at least 8 characters and include at least one number.</p>
                        <p>• <strong>Unlink Device</strong> — Click the red Unlink Device button to remove the connection between your account and your device. After unlinking, you will be redirected to the Link Device page to pair a new device.</p>
                        <p>When you change your username, email, or password, you will remain logged in. Only unlinking a device will redirect you away from the current page.</p>
                        <p>Your historical data is preserved even after unlinking a device. If you pair the same device again later, all previous data will still be available.</p>
                        <p><strong>Note:</strong> Your device records and stores data even without being paired to an account. As long as the device has WiFi and server connectivity, it will continue collecting data regardless of whether a user has paired it or not. Once you pair the device, all previously collected data becomes available in your account.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Weather Widget</span>
                    </div>
                    <div className="faq-text">
                        <p>The weather widget in the sidebar shows the current temperature and weather conditions at the location where your solar panel system is installed. This location is determined automatically from your device's GPS. The weather information helps you understand how conditions may affect your solar energy production — for example, cloudy days will reduce solar output while clear sunny days will maximize it.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Developer Integration Guide</span>
                    </div>
                    <div className="faq-text">
                        <p>This platform is designed to work with any IoT device that implements the communication protocol. This section provides technical details for developers who want to integrate their custom hardware with the monitoring system.</p>
                        
                        <p><strong>1. Device Registration</strong></p>
                        <p>Before a device can send data, it must be registered with the server. Send a POST request to the registration endpoint:</p>
                        <p><code>POST /api/device/register</code></p>
                        <p>Request body:</p>
                        <p className="code"><code>{'{"deviceId": "ABCDE-12345", "hmac": "23jn2k34..."}'}</code></p>
                        <p>The HMAC is created using HMAC-SHA256 with the shared secret key and the device ID. The server validates the signature and returns the device password (claim secret) needed for linking the device to a user account.</p>
                        
                        <p><strong>2. WebSocket Connection</strong></p>
                        <p>After registration, establish a WebSocket connection to:</p>
                        <p><code>wss://your-domain.com/esp</code></p>
                        <p>Immediately after connection, send an authentication message:</p>
                        <p className="code"><code>{'{"type": "auth", "deviceId": "ABCDE-12345", "hmac": "23jn2k34..."}'}</code></p>
                        <p>The server validates the signature and accepts or rejects the connection.</p>
                        
                        <p><strong>3. Telemetry Data Format</strong></p>
                        <p>Send telemetry data as JSON messages at regular intervals (typically once per second). The telemetry message must include the following fields:</p>
                        <p className="code"><code>{'{"type": "telemetry", "data": {"solarV": 18.5, "solarA": 3.18, "solarW": 77.95, "gridV": 230.1, "gridA": 1.45, "gridW": 333.65, "battV": 12.8, "battA": 2.15, "battW": 27.52, "battTemp": 34.2, "battSoc": 73.5, "battState": "charging", "internalV": 12.1, "internalA": 0.48, "internalW": 5.81, "externalV": 12.05, "externalA": 1.02, "externalW": 12.29, "relay1": false, "relay2": false, "relay3": true, "relay4": true, "manual": false, "lat": 44.945, "long": 26.029, "servoAz": 90, "servoEl": 45}}'}</code></p>
                        <p>Field descriptions:</p>
                        <p>• <strong>solarV/A/W</strong> — Solar panel voltage (V), current (A), power (W)</p>
                        <p>• <strong>gridV/A/W</strong> — Grid voltage, current, power</p>
                        <p>• <strong>battV/A/W</strong> — Battery voltage, current, power (positive = charging, negative = discharging)</p>
                        <p>• <strong>battTemp</strong> — Battery temperature in Celsius</p>
                        <p>• <strong>battSoc</strong> — Battery state of charge (0-100%)</p>
                        <p>• <strong>battState</strong> — Battery state: "charging", "discharging", or "idle"</p>
                        <p>• <strong>internalV/A/W</strong> — Internal load voltage, current, power</p>
                        <p>• <strong>externalV/A/W</strong> — External load voltage, current, power</p>
                        <p>• <strong>relay1-4</strong> — Relay states (true = open/disconnected, false = closed/connected)</p>
                        <p>• <strong>manual</strong> — Manual mode flag (true = manual control enabled)</p>
                        <p>• <strong>lat, long</strong> — GPS coordinates (optional)</p>
                        <p>• <strong>servoAz, servoEl</strong> — Servo motor positions in degrees (optional)</p>
                        
                        <p><strong>4. Command Messages</strong></p>
                        <p>The server sends command messages to devices for remote control. Devices should only execute commands when the manual mode flag is true:</p>
                        <p className="code"><code>{'{"type": "command", "payload": {"manual": true, "relay1": false, "relay2": false, "relay3": true, "relay4": true, "servoAz": 120, "servoEl": 45}}'}</code></p>
                        <p>Command fields:</p>
                        <p>• <strong>manual</strong> — Manual mode flag</p>
                        <p>• <strong>relay1-4</strong> — Relay states to set</p>
                        <p>• <strong>servoAz</strong> — Azimuth servo position (0-180 degrees)</p>
                        <p>• <strong>servoEl</strong> — Elevation servo position (20-90 degrees)</p>
                        
                        <p><strong>5. Integration Steps Summary</strong></p>
                        <p>• Implement WebSocket client on your device</p>
                        <p>• Configure device with shared secret key from system administrator</p>
                        <p>• Generate unique device ID and create HMAC-SHA256 signature</p>
                        <p>• Call POST /api/device/register with device ID and HMAC</p>
                        <p>• Store the returned claim secret for user linking</p>
                        <p>• Connect to WebSocket endpoint wss://domain/esp</p>
                        <p>• Send authentication message with device ID and HMAC</p>
                        <p>• Send telemetry JSON messages at regular intervals</p>
                        <p>• Listen for and process incoming command messages</p>
                        <p>• Display device ID and claim secret for user to link the device</p>
                        
                        <p><strong>6. Data Aggregation</strong></p>
                        <p>The server aggregates incoming telemetry data into 5-minute intervals, calculating average, minimum, and maximum values. This data is further aggregated into hourly, daily, and weekly intervals for long-term storage and efficient historical queries.</p>
                        
                        <p><strong>7. Reference Implementation</strong></p>
                        <p>A reference hardware implementation using ESP32-S3 microcontroller is available as an example. This implementation includes INA219 current sensors for power measurement, GPS module for location tracking, relay module for circuit control, and servo motors for solar panel positioning. The reference system demonstrates how to read sensors, format telemetry data, establish WebSocket connection, and process incoming commands.</p>
                    </div>
                </div>

                <div className="faq-section">
                    <div className="faq-header">
                        <span>Coming Soon</span>
                    </div>
                    <div className="faq-text">
                        <p>The following features are planned for future updates:</p>
                        <p>• <strong>Data Buffer System</strong> — A buffer will be implemented so that brief internet outages on the device side will not result in missing data. Similarly, server-side buffering will prevent data gaps during brief server restarts.</p>
                        <p>• <strong>Multiple Device Support</strong> — Future updates will allow a single user account to manage multiple devices simultaneously.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
