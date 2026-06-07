import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../../../config'
import "./EnergySummary.css"

export function EnergySummary() {
    const [data, setData] = useState({
        '24h': { solarW: 0, gridW: 0, consumedW: 0 },
        '7d': { solarW: 0, gridW: 0, consumedW: 0 },
        '30d': { solarW: 0, gridW: 0, consumedW: 0 },
        '1y': { solarW: 0, gridW: 0, consumedW: 0 },
        'all': { solarW: 0, gridW: 0, consumedW: 0 }
    })

    useEffect(() => {
        (async () => {
            const ranges = ['24h', '7d', '30d', '1y', 'all']
            const results = {}
            for (const r of ranges) {
                const res = await axios.get(`${API_BASE}/dashboard/energy-summary`, {
                    params: { range: r },
                    headers: { Authorization: localStorage.getItem('token') }
                })
                results[r] = res.data
            }
            setData(results)
        })()
    }, [])

    function formatW(val) {
        if (val > 1000000) return `${(val / 1000000).toFixed(2)} MW`
        if (val > 1000) return `${(val / 1000).toFixed(2)} kW`
        return `${val.toFixed(2)} W`
    }

    return (
        <div className="chart-card">
            <div className="chart-header">
                <span>Energy Summary</span>
            </div>
            <table className="energy-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Solar</th>
                        <th>Grid</th>
                        <th>Consumption</th>
                    </tr>
                </thead>
                <tbody>
                    {['24h', '7d', '30d', '1y', 'all'].map(r => (
                        <tr key={r}>
                            <td>{r}</td>
                            <td>{formatW(data[r].solarW)}</td>
                            <td>{formatW(data[r].gridW)}</td>
                            <td>{formatW(data[r].consumedW)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}