import './App.css'
import { DashboardPage } from './dashboard/DashboardPage'
import { AuthPage } from './login/AuthPage'
import { Routes , Route} from 'react-router-dom'

function App() {


  return (
    <Routes>
      <Route index element={<AuthPage/>} />
      <Route path="dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App
