import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './ChartCard.css'
import { API_BASE } from '../../../config'
import axios from 'axios'

export function BatteryMiniChart({ title }) {
  const [range, setRange] = useState('24h')
  const [metric, setMetric] = useState('temp')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE}/dashboard/charts/battery`, {
        params: { range },
        headers: { Authorization: token }
      })
      setData(response.data.data || [])
      setLoading(false)
    }
    fetchData()
  }, [range])

  const isAll = metric === 'all'

  const chartData = data.map(d => {
    const point = { time: new Date(d.timestamp).toLocaleString('ro-RO') }
    if (!isAll) {
      const field = metric === 'temp' ? 'battTemp' : 'battSoc'
      const fieldMin = metric === 'temp' ? 'battTempMin' : 'battSocMin'
      const fieldMax = metric === 'temp' ? 'battTempMax' : 'battSocMax'
      point.value = d[field]
      point.min = d[fieldMin]
      point.max = d[fieldMax]
    } else {
      point.temp = d.battTemp
      point.soc = d.battSoc
    }
    return point
  })

  const customTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const p = payload[0].payload
    const fmt = v => v != null ? Number(v).toFixed(2) : '-'
    if (isAll) {
      return (
        <div className="tooltip-box">
          <p>{p.time}</p>
          <p style={{ color: '#f59e0b' }}>Temp: {fmt(p.temp)} ℃</p>
          <p style={{ color: '#3b82f6' }}>SOC: {fmt(p.soc)} %</p>
        </div>
      )
    }
    return (
      <div className="tooltip-box">
        <p>{p.time}</p>
        <p>MED: {fmt(p.value)}</p>
        <p>MIN: {fmt(p.min)}</p>
        <p>MAX: {fmt(p.max)}</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span>{title}</span>
        <div className="chart-controls">
          <select value={range} onChange={e => setRange(e.target.value)}>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="1y">1y</option>
            <option value="all">All</option>
          </select>
          <select value={metric} onChange={e => setMetric(e.target.value)}>
            <option value="all">All</option>
            <option value="temp">Temp</option>
            <option value="soc">SOC</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="chart-loading">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis width={40} tick={{ fontSize: 10, fill: '#888' }} />
            <Tooltip content={customTooltip} />
            {isAll ? (
              <>
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="soc" stroke="#3b82f6" dot={false} strokeWidth={1.5} />
              </>
            ) : (
              <Line type="monotone" dataKey="value" stroke="#22c55e" dot={false} strokeWidth={1.5} />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
