import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Matches from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import CreateMatch from './pages/CreateMatch'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/:id" element={<MatchDetail />} />
                <Route path="/create" element={<CreateMatch />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Layout>
    )
}

export default App
