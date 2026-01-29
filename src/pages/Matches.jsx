import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Users, Coins, ArrowRight, Zap, MapPin, Gamepad2, Globe, Navigation, Trophy } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { MatchStatusBadge } from '../components/ui/Badge'
import { GAME_TYPE_ICONS, GAME_TYPE_NAMES } from '../config/contracts'
import { useTodosArenaContract } from '../hooks/useTodosArenaContract'
import { useGeolocation } from '../hooks/useGeolocation'
import { Loader } from '../components/ui/Loader'
import { formatEther } from 'viem'

const mainFilters = [
    { value: 'all', label: 'All Games', icon: Trophy, description: 'View all available matches' },
    { value: 'online', label: 'Online Games', icon: Gamepad2, description: 'Esports & Video Games' },
    { value: 'outdoor', label: 'Outdoor Near Me', icon: Navigation, description: 'Athletics & Sports' },
    { value: 'indoor', label: 'Indoor Games', icon: Globe, description: 'Basketball, Tennis, etc.' },
]

function MatchCard({ match }) {
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() / 1000) - Number(timestamp))
        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    const entryStake = formatEther(match.entryStake || 0n)
    const prizePool = formatEther(match.totalPrizePool || 0n)
    const participants = Number(match.participantCount || 0)
    const maxParticipants = Number(match.maxParticipants || 0)
    const spotsLeft = maxParticipants - participants
    const canJoin = Number(match.status) === 0 && spotsLeft > 0

    return (
        <Card gradient className="group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {GAME_TYPE_ICONS[Number(match.gameType)] || '🎮'}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{match.title}</h3>
                        <p className="text-sm text-gray-500">{GAME_TYPE_NAMES[Number(match.gameType)]} • {timeAgo(match.createdAt)}</p>
                    </div>
                </div>
                <MatchStatusBadge status={Number(match.status)} />
            </div>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{match.description || 'No description'}</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-xl bg-white/5"><Coins className="w-4 h-4 text-yellow-500 mx-auto mb-1" /><div className="text-white font-medium">{parseFloat(entryStake).toFixed(3)}</div><div className="text-xs text-gray-500">ETH Entry</div></div>
                <div className="text-center p-3 rounded-xl bg-white/5"><Coins className="w-4 h-4 text-green-500 mx-auto mb-1" /><div className="text-white font-medium">{parseFloat(prizePool).toFixed(3)}</div><div className="text-xs text-gray-500">ETH Prize</div></div>
                <div className="text-center p-3 rounded-xl bg-white/5"><Users className="w-4 h-4 text-blue-500 mx-auto mb-1" /><div className="text-white font-medium">{participants}/{maxParticipants}</div><div className="text-xs text-gray-500">Players</div></div>
            </div>
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Spots filled</span><span className={spotsLeft <= 2 ? 'text-orange-400' : 'text-gray-500'}>{spotsLeft} left</span></div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(participants / maxParticipants) * 100}%` }} transition={{ duration: 0.5, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-primary-500 to-blue-500" />
                </div>
            </div>
            <Link to={`/matches/${match.id}`}>
                <Button className="w-full" variant={canJoin ? 'primary' : 'secondary'} icon={canJoin ? Zap : ArrowRight} iconPosition="right">
                    {canJoin ? 'Join Match' : 'View Details'}
                </Button>
            </Link>
        </Card>
    )
}

export default function Matches() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [lastUpdate, setLastUpdate] = useState(null)
    const { allMatches, isLoadingMatches, refetchMatches } = useTodosArenaContract()
    const { location, permissionStatus, requestLocation, loading: locationLoading } = useGeolocation()

    useEffect(() => {
        refetchMatches().then(() => {
            setLastUpdate(new Date())
        })
    }, [refetchMatches])

    // Add focus event listener to refetch when page becomes visible
    useEffect(() => {
        const handleFocus = () => {
            refetchMatches().then(() => {
                setLastUpdate(new Date())
            })
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [refetchMatches])

    // Add periodic polling to catch status updates (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            refetchMatches().then(() => {
                setLastUpdate(new Date())
            })
        }, 10000) // 10 seconds

        return () => clearInterval(interval)
    }, [refetchMatches])

    const handleFilterChange = (filter) => {
        if (filter === 'outdoor' && permissionStatus !== 'granted') {
            requestLocation()
        }
        setActiveFilter(filter)
    }

    // Convert matches to array and filter
    const matchesArray = allMatches ? [...allMatches] : []

    // Debug logging
    console.log('Matches.jsx - allMatches:', allMatches)
    console.log('Matches.jsx - matchesArray:', matchesArray)
    console.log('Matches.jsx - isLoadingMatches:', isLoadingMatches)

    console.log(matchesArray)
    const filteredMatches = matchesArray.filter((match) => {
        const matchesSearch = match.title?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || Number(match.status) === parseInt(statusFilter)

        // Debug filtering logic
        const gameType = Number(match.gameType)
        let typeMatch = false
        if (activeFilter === 'all') typeMatch = true
        else if (activeFilter === 'online') typeMatch = gameType === 2
        else if (activeFilter === 'outdoor') typeMatch = gameType === 1
        else if (activeFilter === 'indoor') typeMatch = gameType === 0

        console.log(`Filtering match ${match.id}: Title="${match.title}", Type=${gameType}, Status=${match.status} | Search=${matchesSearch}, Status=${matchesStatus}, TypeMatch=${typeMatch} (${activeFilter})`)

        if (!matchesSearch || !matchesStatus) return false
        return typeMatch
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Browse <span className="gradient-text">Matches</span></h1>
                    <p className="text-gray-400">Find and join competitive matches • AI-verified • Blockchain rewards</p>
                </div>
                <Link to="/create"><Button icon={Zap}>Create Match</Button></Link>
            </motion.div>

            {/* Main Category Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid sm:grid-cols-3 gap-4 mb-8">
                {mainFilters.map((filter) => {
                    const Icon = filter.icon
                    const isActive = activeFilter === filter.value
                    return (
                        <button key={filter.value} onClick={() => handleFilterChange(filter.value)} className={`p-4 rounded-2xl border transition-all text-left ${isActive ? 'bg-primary-500/20 border-primary-500/50 shadow-lg shadow-primary-500/10' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-primary-500' : 'bg-white/10'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                </div>
                                <div>
                                    <div className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{filter.label}</div>
                                    <div className="text-xs text-gray-500">{filter.description}</div>
                                </div>
                            </div>
                            {filter.value === 'outdoor' && activeFilter === 'outdoor' && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    {permissionStatus === 'granted' && location ? (
                                        <div className="flex items-center gap-2 text-green-400 text-sm"><MapPin className="w-4 h-4" />Location enabled</div>
                                    ) : (
                                        <Button size="sm" variant="secondary" onClick={requestLocation} loading={locationLoading} icon={MapPin}>Enable Location</Button>
                                    )}
                                </div>
                            )}
                        </button>
                    )
                })}
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
                <Input placeholder="Search matches..." icon={Search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500">
                        {isLoadingMatches ? 'Loading...' : `Showing ${filteredMatches.length} matches`}
                    </span>
                    {lastUpdate && (
                        <span className="text-xs text-gray-600">
                            Last updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {['all', '0', '1', '2', '3'].map((status) => (
                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusFilter === status ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            {status === 'all' ? 'All' : status === '0' ? 'Open' : status === '1' ? 'Active' : status === '2' ? 'Voting' : 'Completed'}
                        </button>
                    ))}
                </div>
            </motion.div>

            {isLoadingMatches ? (
                <div className="flex flex-col justify-center py-20">
                    <Loader size="lg" />
                    <p className="text-gray-400 mt-4 text-center">Loading matches...</p>
                </div>
            ) : filteredMatches.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map((match, index) => (
                        <motion.div key={match.id?.toString() || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                            <MatchCard match={match} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                    <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
                    <p className="text-gray-400 mb-6">Be the first to create a match!</p>
                    <Link to="/create"><Button icon={Zap}>Create Match</Button></Link>
                </motion.div>
            )}
        </div>
    )
}
