import './App.css'
import { DashboardLayout } from './dashboard/DashboardLayout'
import { OverviewPage } from './dashboard/pages/OverviewPage'
import { ManualCalibrationPage } from './dashboard/pages/ManualCalibrationPage'
import { AuthPage } from './login/AuthPage'
import { Routes , Route} from 'react-router-dom'
import { FaqPage } from './dashboard/pages/FaqPage'

function App() {


  return (
    <Routes>
      <Route index element={<AuthPage/>} />
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path='manualcalibration' element={<ManualCalibrationPage />} />
        <Route path='FAQ' element={<FaqPage />} />
        </Route>
    </Routes>
  )
}

export default App
