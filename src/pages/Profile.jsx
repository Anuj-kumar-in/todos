import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { User, Trophy, Swords, Coins, TrendingUp, CheckCircle, XCircle, ExternalLink, Copy, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { MatchStatusBadge } from '../components/ui/Badge'
import { GAME_TYPE_ICONS, GAME_TYPE_NAMES } from '../config/contracts'
import { useTodosArenaContract } from '../hooks/useTodosArenaContract'
import { Loader } from '../components/ui/Loader'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

export default function Profile() {
    const { address, isConnected } = useAccount()
    const { allMatches, userMatches, isLoadingMatches, refetchUserMatches, totalEarned, rewardBalance, claimAllRewards, isClaimingRewards, refetchRewardBalance, refetchTotalEarned } = useTodosArenaContract()

    useEffect(() => {
        if (isConnected) {
            refetchUserMatches()
            refetchRewardBalance()
            refetchTotalEarned()
        }
    }, [isConnected])

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address)
            toast.success('Address copied!')
        }
    }

    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

    const handleClaimRewards = async () => {
        try {
            await claimAllRewards()
        } catch (error) {
            console.error('Claim error:', error)
        }
    }

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                        <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                    <p className="text-gray-400 mb-6">Please connect your wallet to view your profile.</p>
                    <ConnectButton />
                </motion.div>
            </div>
        )
    }

    // Get user matches from real data
    const matchesArray = allMatches ? [...allMatches] : []
    const userMatchIds = userMatches ? [...userMatches] : []
    const userMatchesData = matchesArray.filter(m => userMatchIds.some(id => id.toString() === m.id?.toString()))

    const totalMatches = userMatchesData.length
    const completedMatches = userMatchesData.filter(m => Number(m.status) === 3).length
    const activeMatches = userMatchesData.filter(m => Number(m.status) === 1).length

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <Card gradient glow>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-arena-card flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-white">{formatAddress(address)}</h1>
                                <button onClick={copyAddress} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><Copy className="w-4 h-4" /></button>
                                <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1"><Swords className="w-4 h-4 text-blue-500" />{totalMatches} matches</span>
                                <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" />{completedMatches} completed</span>
                            </div>
                        </div>
                        <div className="flex gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold gradient-text">{parseFloat(totalEarned).toFixed(0)}</div>
                            <div className="text-sm text-gray-500">TODO Balance</div>
                        </div>
                    </div>
                    </div>
                </Card>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Stats & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { icon: Swords, label: 'Matches', value: totalMatches, color: 'from-primary-500 to-purple-500' },
                            { icon: Trophy, label: 'Completed', value: completedMatches, color: 'from-green-500 to-emerald-500' },
                            { icon: TrendingUp, label: 'Active', value: activeMatches, color: 'from-blue-500 to-cyan-500' },
                            { icon: Coins, label: 'Claimable', value: parseFloat(rewardBalance).toFixed(0), color: 'from-yellow-500 to-orange-500' },
                        ].map((stat) => (
                            <Card key={stat.label}>
                                <div className="text-center">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Match History */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card hover={false} padding="p-0">
                            <CardHeader className="p-6 border-b border-arena-border"><CardTitle>Match History</CardTitle></CardHeader>
                            <CardContent className="divide-y divide-arena-border">
                                {isLoadingMatches ? (
                                    <div className="flex justify-center py-8"><Loader /></div>
                                ) : userMatchesData.length > 0 ? (
                                    userMatchesData.map((match) => (
                                        <div key={match.id?.toString()} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                                                    {GAME_TYPE_ICONS[Number(match.gameType)] || '🎮'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{match.title}</div>
                                                    <div className="text-sm text-gray-500">{GAME_TYPE_NAMES[Number(match.gameType)]}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-white">{parseFloat(formatEther(match.totalPrizePool || 0n)).toFixed(3)} ETH</div>
                                                    <div className="text-xs text-gray-500">Prize Pool</div>
                                                </div>
                                                <MatchStatusBadge status={Number(match.status)} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">No matches yet. Join or create one!</div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column - Rewards */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
                    <Card gradient glow>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-500" />TODO Balance</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-white mb-2">{parseFloat(totalEarned).toFixed(2)}</div>
                            <div className="text-sm text-gray-400 mb-4">TODO Tokens</div>
                            {parseFloat(rewardBalance) > 0 && (
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                                    <div className="flex justify-between"><span className="text-green-400">Pending Rewards</span><span className="font-bold text-green-400">+{parseFloat(rewardBalance).toFixed(2)}</span></div>
                                </div>
                            )}
                            <Button className="w-full" onClick={handleClaimRewards} loading={isClaimingRewards} disabled={parseFloat(rewardBalance) <= 0}>
                                {parseFloat(rewardBalance) > 0 ? 'Claim Rewards' : 'No Rewards to Claim'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Wallet Info</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-400">Network</span>
                                <span className="text-white">Hardhat Local</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-white/5">
                                <span className="text-gray-400">Chain ID</span>
                                <span className="text-white">31337</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
