import './App.css'
import { DashboardLayout } from './dashboard/DashboardLayout'
import { OverviewPage } from './dashboard/pages/OverviewPage'
import { ManualCalibrationPage } from './dashboard/pages/ManualCalibrationPage'
import { AuthPage } from './login/AuthPage'
import { Routes, Route } from 'react-router-dom'
import { FaqPage } from './dashboard/pages/FaqPage'
import { LinkDevicePage } from './dashboard/pages/LinkDevicePage'
import { History } from './dashboard/pages/HistoryPage'
import { AccountPage } from './dashboard/pages/AccountPage'
import { WebSocketProvider } from './services/websocket.jsx'

function App() {


  return (
    <Routes>
      <Route index element={<AuthPage />} />
      <Route path="dashboard" element={
        <WebSocketProvider>
          <DashboardLayout />
        </WebSocketProvider>
      }>
        <Route index element={<OverviewPage />} />
        <Route path='manualcalibration' element={<ManualCalibrationPage />} />
        <Route path='FAQ' element={<FaqPage />} />
        <Route path="history" element={<History />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="pair" element={<LinkDevicePage />} />
      </Route>
    </Routes>
  )
}

export default App
