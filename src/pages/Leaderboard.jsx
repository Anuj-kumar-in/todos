import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, TrendingUp, Coins, Swords, Search, ChevronUp, ChevronDown } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'

const mockLeaderboard = [
    { rank: 1, address: '0x1234567890abcdef1234567890abcdef12345678', wins: 156, matches: 180, winRate: 86.7, todoEarned: 12500, change: 0 },
    { rank: 2, address: '0xabcdef1234567890abcdef1234567890abcdef12', wins: 142, matches: 168, winRate: 84.5, todoEarned: 11200, change: 1 },
    { rank: 3, address: '0x9876543210fedcba9876543210fedcba98765432', wins: 138, matches: 165, winRate: 83.6, todoEarned: 10800, change: -1 },
    { rank: 4, address: '0xfedcba9876543210fedcba9876543210fedcba98', wins: 125, matches: 155, winRate: 80.6, todoEarned: 9500, change: 2 },
    { rank: 5, address: '0x5555666677778888999900001111222233334444', wins: 118, matches: 150, winRate: 78.7, todoEarned: 8900, change: 0 },
    { rank: 6, address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555', wins: 112, matches: 145, winRate: 77.2, todoEarned: 8200, change: -2 },
    { rank: 7, address: '0x7777888899990000aaaabbbbccccddddeeee1111', wins: 105, matches: 140, winRate: 75.0, todoEarned: 7600, change: 1 },
    { rank: 8, address: '0x2222333344445555666677778888999900001111', wins: 98, matches: 135, winRate: 72.6, todoEarned: 7100, change: 0 },
    { rank: 9, address: '0x0000111122223333444455556666777788889999', wins: 92, matches: 130, winRate: 70.8, todoEarned: 6500, change: 3 },
    { rank: 10, address: '0xddddeeee00001111222233334444555566667777', wins: 88, matches: 125, winRate: 70.4, todoEarned: 6200, change: -1 },
]

const rankColors = { 1: 'from-yellow-400 to-amber-500', 2: 'from-gray-300 to-gray-400', 3: 'from-amber-600 to-amber-700' }
const rankIcons = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('rank')
    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

    const filteredData = mockLeaderboard.filter(p => p.address.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Global <span className="gradient-text">Leaderboard</span></h1>
                <p className="text-gray-400">Top players competing for glory and TODO tokens</p>
            </motion.div>

            {/* Top 3 Podium */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid md:grid-cols-3 gap-4 mb-12">
                {[1, 0, 2].map((idx, pos) => {
                    const player = mockLeaderboard[idx]
                    if (!player) return null
                    const isFirst = player.rank === 1
                    return (
                        <Card key={player.rank} gradient={isFirst} glow={isFirst} className={`${isFirst ? 'md:-mt-4' : 'md:mt-4'}`}>
                            <div className="text-center py-4">
                                <div className="text-4xl mb-3">{rankIcons[player.rank]}</div>
                                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${rankColors[player.rank]} flex items-center justify-center text-2xl font-bold text-white mb-3`}>
                                    #{player.rank}
                                </div>
                                <div className="text-lg font-bold text-white mb-1">{formatAddress(player.address)}</div>
                                <div className="text-sm text-gray-400 mb-4">{player.winRate}% Win Rate</div>
                                <div className="flex justify-center gap-6 text-sm">
                                    <div><div className="text-white font-bold">{player.wins}</div><div className="text-gray-500">Wins</div></div>
                                    <div><div className="text-yellow-400 font-bold">{player.todoEarned}</div><div className="text-gray-500">TODO</div></div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
                <Input placeholder="Search by address..." icon={Search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </motion.div>

            {/* Leaderboard Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card hover={false} padding="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-arena-border">
                                <tr className="text-left text-sm text-gray-400">
                                    <th className="px-6 py-4 font-medium">Rank</th>
                                    <th className="px-6 py-4 font-medium">Player</th>
                                    <th className="px-6 py-4 font-medium text-center">Matches</th>
                                    <th className="px-6 py-4 font-medium text-center">Wins</th>
                                    <th className="px-6 py-4 font-medium text-center">Win Rate</th>
                                    <th className="px-6 py-4 font-medium text-right">TODO Earned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-arena-border">
                                {filteredData.map((player, idx) => (
                                    <motion.tr key={player.address} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${player.rank <= 3 ? 'text-xl' : 'text-white'}`}>
                                                    {player.rank <= 3 ? rankIcons[player.rank] : `#${player.rank}`}
                                                </span>
                                                {player.change !== 0 && (
                                                    <span className={player.change > 0 ? 'text-green-400' : 'text-red-400'}>
                                                        {player.change > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="text-white font-medium">{formatAddress(player.address)}</span></td>
                                        <td className="px-6 py-4 text-center text-gray-400">{player.matches}</td>
                                        <td className="px-6 py-4 text-center text-green-400 font-medium">{player.wins}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-lg text-sm font-medium ${player.winRate >= 80 ? 'bg-green-500/20 text-green-400' : player.winRate >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {player.winRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right"><span className="text-yellow-400 font-bold">{player.todoEarned.toLocaleString()}</span></td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
