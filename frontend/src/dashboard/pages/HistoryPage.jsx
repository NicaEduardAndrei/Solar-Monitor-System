import { ChartCard } from '../components/ChartCard'
import { BatteryMiniChart } from '../components/BatteryMiniChart'
import './HistoryPage.css'
import { EnergySummary } from '../components/EnergySummary'

export function History() {
  return (
    <div className="history-page">
      <div className="charts-grid">
        <ChartCard title="Solar" category="solar" />
        <ChartCard title="Grid" category="grid" />
        <ChartCard title="Battery" category="battery" />
        <ChartCard title="Internal" category="internal" />
        <ChartCard title="External" category="external" />
        <div className="mini-charts-row">
          <BatteryMiniChart title="Battery Info" />
          <EnergySummary />
        </div>
      </div>
    </div>
  )
}
