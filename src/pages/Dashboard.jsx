import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Trophy, Swords, Coins, TrendingUp, Plus, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { MatchStatusBadge } from '../components/ui/Badge'
import { GAME_TYPE_ICONS, GAME_TYPE_NAMES } from '../config/contracts'
import { useTodosArenaContract } from '../hooks/useTodosArenaContract'
import { useRelayerContract } from '../hooks/useRelayerContract'
import { Loader } from '../components/ui/Loader'
import { formatEther } from 'viem'

function StatCard({ icon: Icon, label, value, subValue, color }) {
    return (
        <Card gradient className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-sm text-gray-400">{label}</div>
                    {subValue && <div className="text-xs text-primary-400 mt-1">{subValue}</div>}
                </div>
            </CardContent>
        </Card>
    )
}

export default function Dashboard() {
    const { address, isConnected } = useAccount()
    const { allMatches, userMatches, isLoadingMatches, refetchMatches, refetchUserMatches, totalEarned, rewardBalance, isClaimingRewards } = useTodosArenaContract()
    const { userBalanceFormatted, refetchBalance } = useRelayerContract()

    useEffect(() => {
        if (isConnected) {
            refetchMatches()
            refetchUserMatches()
            refetchBalance()
        }
    }, [isConnected])

    // Periodic polling to keep data fresh (every 10 seconds)
    useEffect(() => {
        if (!isConnected) return

        const interval = setInterval(() => {
            refetchMatches()
            refetchUserMatches()
            refetchBalance()
        }, 10000) // 10 seconds

        return () => clearInterval(interval)
    }, [isConnected, refetchMatches, refetchUserMatches, refetchBalance])

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                        <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-6 max-w-md">Please connect your wallet to view your dashboard.</p>
                    <ConnectButton />
                </motion.div>
            </div>
        )
    }

    // Calculate stats from real data
    const matchesArray = allMatches ? [...allMatches] : []
    const userMatchIds = userMatches ? [...userMatches] : []
    const userMatchesData = matchesArray.filter(m => userMatchIds.some(id => id.toString() === m.id?.toString()))

    const activeMatches = userMatchesData.filter(m => Number(m.status) === 0 || Number(m.status) === 1)
    const completedMatches = userMatchesData.filter(m => Number(m.status) === 3)
    const totalMatches = userMatchesData.length

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="gradient-text">Champion</span></h1>
                <p className="text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)} • Track your matches and earnings</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <StatCard icon={Swords} label="Your Matches" value={totalMatches} color="from-primary-500 to-purple-500" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <StatCard icon={Trophy} label="Completed" value={completedMatches.length} color="from-green-500 to-emerald-500" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard icon={Coins} label="TODO Balance" value={Math.floor(userBalanceFormatted)} subValue={parseFloat(rewardBalance) > 0 ? `+${parseFloat(rewardBalance).toFixed(0)} claimable` : null} color="from-yellow-500 to-orange-500" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <StatCard icon={TrendingUp} label="Active Now" value={activeMatches.length} color="from-blue-500 to-cyan-500" />
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Matches */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
                    <Card hover={false} padding="p-0">
                        <CardHeader className="flex items-center justify-between p-6 border-b border-arena-border">
                            <CardTitle className="flex items-center gap-2"><Swords className="w-5 h-5 text-primary-400" />Your Matches</CardTitle>
                            <Link to="/matches"><Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">View All</Button></Link>
                        </CardHeader>
                        <CardContent className="divide-y divide-arena-border">
                            {isLoadingMatches ? (
                                <div className="flex justify-center py-8"><Loader /></div>
                            ) : userMatchesData.length > 0 ? (
                                userMatchesData.slice(0, 5).map((match) => (
                                    <Link key={match.id?.toString()} to={`/matches/${match.id}`} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center text-2xl">
                                                {GAME_TYPE_ICONS[Number(match.gameType)] || '🎮'}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{match.title}</div>
                                                <div className="text-sm text-gray-500">{GAME_TYPE_NAMES[Number(match.gameType)]} • {Number(match.participantCount)}/{Number(match.maxParticipants)} players</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-white font-medium">{parseFloat(formatEther(match.totalPrizePool || 0n)).toFixed(0)} TODO</div>
                                                <div className="text-xs text-gray-500">Prize Pool</div>
                                            </div>
                                            <MatchStatusBadge status={Number(match.status)} />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">No matches yet. Create or join one!</div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
                    <Card gradient glow>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-primary-400" />Quick Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <Link to="/create" className="block"><Button className="w-full" icon={Plus}>Create New Match</Button></Link>
                            <Link to="/matches" className="block"><Button variant="secondary" className="w-full" icon={Swords}>Join a Match</Button></Link>
                            <Link to="/profile" className="block"><Button variant="secondary" className="w-full" icon={Coins}>View Rewards</Button></Link>
                        </CardContent>
                    </Card>

                    {/* Platform Stats */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary-400" />Platform Stats</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-400">Total Matches</span>
                                <span className="text-white font-bold">{matchesArray.length}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-400">Open Matches</span>
                                <span className="text-white font-bold">{matchesArray.filter(m => Number(m.status) === 0).length}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-400">Active Matches</span>
                                <span className="text-white font-bold">{matchesArray.filter(m => Number(m.status) === 1).length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
