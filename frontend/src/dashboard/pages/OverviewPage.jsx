import { useWebSocket } from "../../services/websocket.jsx"
import "./OverviewPage.css"

import animationLoading from "../../assets/dashboard/animation/loading-animations/loading-animation.gif"

import solarPanel from "../../assets/dashboard/animation/solar-panel.png"
import grid from "../../assets/dashboard/animation/grid.png"
import mppt from "../../assets/dashboard/animation/solar-inverter.png"
import battery from "../../assets/dashboard/animation/battery.png"
import internal from "../../assets/dashboard/animation/internal.png"
import house from "../../assets/dashboard/animation/house.png"

export function OverviewPage() {
    const { data: liveData } = useWebSocket()

    if (!liveData) return (
        <>
            <div className="loading-screen">
                <div className="connecting">
                    Connecting...
                </div>
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

    const solarActive = liveData.solarW > 0
    const gridActive = liveData.gridW > 0
    const mpptActive = solarActive || gridActive
    const batteryCharging = liveData.battW > 0
    const batteryDischarging = liveData.battW < 0
    const internalActive = liveData.internalW > 0
    const externalActive = liveData.externalW > 0

    const mpptToJunctionActive =
        batteryCharging ||
        (internalActive && (solarActive || gridActive)) ||
        (externalActive && (solarActive || gridActive))

    const svgClass = [
        "energy-flow",
        solarActive && "solar-active",
        gridActive && "grid-active",
        mpptActive && "mppt-active",
        batteryCharging && "battery-charging",
        batteryDischarging && "battery-discharging",
        internalActive && "internal-active",
        externalActive && "external-active",
        mpptToJunctionActive && "mppt-junction-active",
    ].filter(Boolean).join(" ")

    return (
        <div className="main-dashboard">
            <div className="dashboard-animation">
                <svg viewBox="0 0 701 604" className={svgClass}>
                    <path id="solar-to-mppt" d="M106.775 81.822H298.273" />
                    <path id="grid-to-mppt" d="M401.566 82.4023H593.065" />
                    <path id="mppt-to-point-connect" d="M350.5 162.483L350.5 306.397" />
                    <path id="point-connect-to-battery" d="M167.126 315.682H342.376" />
                    <path id="point-connect-to-internal" d="M357.464 405.048L497.896 405.048" />
                    <path id="point-connect-more-to-down" d="M350.5 324.387L350.5 396.344" />
                    <path id="point-connect-more-more-to-down" d="M350.499 413.753L350.5 539.677" />
                    <path id="down-to-house" d="M362.106 539.677H497.896" />

                    <image id="solar-panel" href={solarPanel} x="0" y="24" width="116" height="116" />
                    <image id="grid" href={grid} x="585" y="29" width="116" height="116" />
                    <image id="MPPT" href={mppt} x="292" y="43" width="116" height="116" />
                    <image id="battery" href={battery} x="51" y="258" width="116" height="116" />
                    <image id="internal" href={internal} x="492" y="347" width="116" height="116" />
                    <image id="house" href={house} x="492" y="472" width="116" height="116" />

                    <text id="Solar" x="43.46" y="11.86">Solar</text>
                    <text id="MPPT_2" x="334" y="11.86">MPPT</text>
                    <text id="Grid" x="631.56" y="11.86">Grid</text>
                    <text id="Battery" x="89.56" y="246.30">Battery</text>
                    <text id="Internal-Load" x="511.70" y="335.67">Internal Load</text>
                    <text id="Out" x="538.20" y="600.29">Out</text>


                    <text className="w-value w-solar" x="202" y="71" textAnchor="middle">
                        {liveData.solarW?.toFixed(3)} W
                    </text>
                    <text className="w-value w-solar" x="25" y="160" textAnchor="middle">
                        {liveData.solarV?.toFixed(2)} V
                    </text>
                    <text className="w-value w-solar" x="90" y="160" textAnchor="middle">
                        {liveData.solarA?.toFixed(3)} A
                    </text>



                    <text className="w-value w-grid" x="497" y="72" textAnchor="middle">
                        {liveData.gridW?.toFixed(3)} W
                    </text>
                    <text className="w-value w-grid" x="597" y="160" textAnchor="middle">
                        {liveData.gridV?.toFixed(2)} V
                    </text>
                    <text className="w-value w-grid" x="667" y="160" textAnchor="middle">
                        {liveData.gridA?.toFixed(3)} A
                    </text>




                    <text className="w-value w-mppt" x="350" y="30" textAnchor="middle">
                        {Math.abs(liveData.solarW + liveData.gridW)?.toFixed(3)} W
                    </text>




                    <text className="w-value w-battery" x="255" y="305" textAnchor="middle">
                        {liveData.battW?.toFixed(3)} W
                    </text>
                    <text className="w-value w-battery" x="70" y="395" textAnchor="middle">
                        {liveData.battV?.toFixed(2)} V
                    </text>
                    <text className="w-value w-battery" x="145" y="395" textAnchor="middle">
                        {liveData.battA?.toFixed(3)} A
                    </text>





                    <text className="w-value w-internal" x="427" y="395" textAnchor="middle">
                        {liveData.internalW?.toFixed(3)} W
                    </text>
                    <text className="w-value w-internal" x="637" y="395" textAnchor="middle">
                        {liveData.internalV?.toFixed(2)} V
                    </text>
                    <text className="w-value w-internal" x="637" y="435" textAnchor="middle">
                        {liveData.internalA?.toFixed(3)} A
                    </text>




                    <text className="w-value w-external-h" x="430" y="529" textAnchor="middle">
                        {liveData.externalW?.toFixed(3)} W
                    </text>
                    <text className="w-value w-external-h" x="637" y="529" textAnchor="middle">
                        {liveData.externalV?.toFixed(2)} V
                    </text>
                    <text className="w-value w-external-h" x="637" y="569" textAnchor="middle">
                        {liveData.externalA?.toFixed(3)} A
                    </text>




                    <text className="info-text" x="0" y="470" textAnchor="right">
                        Battery temp: {liveData.battTemp?.toFixed(1)} ℃
                    </text>
                    <text className="info-text" x="0" y="490" textAnchor="right">
                        Battery state: {liveData.battState}
                    </text>
                    <text className="info-text" x="0" y="510" textAnchor="right">
                        Battery SOC: {liveData.battSoc?.toFixed(1)} %
                    </text>
                    <text className="info-text" x="0" y="530" textAnchor="right">
                        Grid : {liveData.relay1 === true ? "Open" : "Closed"}
                    </text>
                    <text className="info-text" x="0" y="550" textAnchor="right">
                        Solar : {liveData.relay2 === true ? "Open" : "Closed"}
                    </text>
                    <text className="info-text" x="0" y="570" textAnchor="right">
                        Battery : {liveData.relay3 === true ? "Open" : "Closed"}
                    </text>
                    <text className="info-text" x="0" y="590" textAnchor="right">
                        External load : {liveData.relay4 === true ? "Open" : "Closed"}
                    </text>


                </svg>
            </div>
        </div>
    )
}