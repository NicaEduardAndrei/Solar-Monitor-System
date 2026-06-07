import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './ChartCard.css'
import { API_BASE } from '../../../config'

const fieldMap = {
  solar: { v: 'solarV', vMin: 'solarVMin', vMax: 'solarVMax', a: 'solarA', aMin: 'solarAMin', aMax: 'solarAMax', w: 'solarW', wMin: 'solarWMin', wMax: 'solarWMax' },
  grid: { v: 'gridV', vMin: 'gridVMin', vMax: 'gridVMax', a: 'gridA', aMin: 'gridAMin', aMax: 'gridAMax', w: 'gridW', wMin: 'gridWMin', wMax: 'gridWMax' },
  battery: { v: 'battV', vMin: 'battVMin', vMax: 'battVMax', a: 'battA', aMin: 'battAMin', aMax: 'battAMax', w: 'battW', wMin: 'battWMin', wMax: 'battWMax', soc: 'battSoc', socMin: 'battSocMin', socMax: 'battSocMax' },
  internal: { v: 'internalV', vMin: 'internalVMin', vMax: 'internalVMax', a: 'internalA', aMin: 'internalAMin', aMax: 'internalAMax', w: 'internalW', wMin: 'internalWMin', wMax: 'internalWMax' },
  external: { v: 'externalV', vMin: 'externalVMin', vMax: 'externalVMax', a: 'externalA', aMin: 'externalAMin', aMax: 'externalAMax', w: 'externalW', wMin: 'externalWMin', wMax: 'externalWMax' }
}

export function ChartCard({ title, category }) {
  const [range, setRange] = useState('24h')
  const [metric, setMetric] = useState('w')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/dashboard/charts/${category}?range=${range}`, {
        headers: { Authorization: token }
      })
      const json = await res.json()
      setData(json.data || [])
      setLoading(false)
    }
    fetchData()
  }, [category, range])

  const f = fieldMap[category]
  const isAll = metric === 'all'

  const chartData = data.map(d => {
    const point = { time: new Date(d.timestamp).toLocaleString('ro-RO') }
    if (!isAll) {
      point.value = d[f[metric]]
      point.min = d[f[metric + 'Min']]
      point.max = d[f[metric + 'Max']]
    } else {
      point.v = d[f.v]
      point.a = d[f.a]
      point.w = d[f.w]
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
          <p style={{ color: '#f59e0b' }}>V: {fmt(p.v)}</p>
          <p style={{ color: '#3b82f6' }}>A: {fmt(p.a)}</p>
          <p style={{ color: '#22c55e' }}>W: {fmt(p.w)}</p>
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
            <option value="v">V</option>
            <option value="a">A</option>
            <option value="w">W</option>
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
                <Line type="monotone" dataKey="v" stroke="#f59e0b" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="a" stroke="#3b82f6" dot={false} strokeWidth={1.5} />
                <Line type="monotone" dataKey="w" stroke="#22c55e" dot={false} strokeWidth={1.5} />
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
