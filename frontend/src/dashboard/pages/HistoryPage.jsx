import { ChartCard } from '../components/ChartCard'
import './HistoryPage.css'

export function History() {
  return (
    <div className="history-page">
      <div className="charts-grid">
        <ChartCard title="Solar" category="solar" />
        <ChartCard title="Grid" category="grid" />
        <ChartCard title="Battery" category="battery" />
        <ChartCard title="Internal" category="internal" />
        <ChartCard title="External" category="external" />
      </div>
    </div>
  )
}