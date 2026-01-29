import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount, useReadContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ArrowLeft, Users, Clock, Coins, Trophy, User, CheckCircle, Vote, Copy, Share2, AlertCircle, Camera, Upload, RefreshCw, Award, Timer, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import CameraCapture from '../components/CameraCapture'
import ScreenshotUpload from '../components/ScreenshotUpload'
import AIResultModal from '../components/AIResultModal'
import { MatchStatusBadge } from '../components/ui/Badge'
import { GAME_TYPE_ICONS, GAME_TYPE_NAMES, TODO_ARENA_ABI } from '../config/contracts'
import { useTodosArenaContract } from '../hooks/useTodosArenaContract'
import useAIDetection from '../hooks/useAIDetection'
import { Loader } from '../components/ui/Loader'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

export default function MatchDetail() {
    const { id } = useParams()
    const matchId = BigInt(id || 0)
    const { address, isConnected, chain } = useAccount()

    const [showVoteModal, setShowVoteModal] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [showUpload, setShowUpload] = useState(false)
    const [showAIResult, setShowAIResult] = useState(false)
    const [showAIFallbackModal, setShowAIFallbackModal] = useState(false)
    const [votingTimeLeft, setVotingTimeLeft] = useState(null)
    const [finalizationAttempted, setFinalizationAttempted] = useState(false)

    const [selectedWinners, setSelectedWinners] = useState([])

    const { joinMatch, isJoiningMatch, startMatch, isStartingMatch, startVotingPhase, isStartingVoting, finalizeVoting, finalizeWithAI, isFinalizingVoting, submitVote, isVoting, useGetMatch, useGetMatchParticipantsWithNetwork, useGetVotingSession, useHasVoted, useFinalWinners, refetchMatches } = useTodosArenaContract()

    const {
        isAnalyzing,
        aiResult,
        requestCameraAccess,
        stopCamera,
        videoRef,
        analyzeCameraCapture,
        analyzeScreenshot,
        resetAIResult
    } = useAIDetection()

    const { data: matchData, isLoading: isLoadingMatch, refetch: refetchMatch } = useGetMatch(matchId)

    const { data: participantsWithNetwork, isLoading: isLoadingParticipants, refetch: refetchParticipants } = useGetMatchParticipantsWithNetwork(matchId)

    const { data: votingSessionData, refetch: refetchVotingSession } = useGetVotingSession(matchId)

    const { data: userHasVoted, refetch: refetchHasVoted } = useHasVoted(matchId)

    const { data: finalWinners, refetch: refetchFinalWinners } = useFinalWinners(matchId)

    useEffect(() => {
        refetchMatch()
        refetchParticipants()
        refetchVotingSession()
        refetchHasVoted()
        refetchFinalWinners()
    }, [id, refetchMatch, refetchParticipants, refetchVotingSession, refetchHasVoted, refetchFinalWinners])

    useEffect(() => {
        const interval = setInterval(() => {
            refetchVotingSession()
            refetchHasVoted()
            refetchFinalWinners()
            refetchMatch()
        }, 5000)

        return () => clearInterval(interval)
    }, [refetchVotingSession, refetchHasVoted, refetchFinalWinners, refetchMatch])

    const votingSession = votingSessionData ? {
        matchId: Number(votingSessionData[0] || 0),
        totalVoters: Number(votingSessionData[1] || 0),
        votesReceived: Number(votingSessionData[2] || 0),
        votingEndTime: Number(votingSessionData[3] || 0),
        finalized: votingSessionData[4] || false
    } : null

    useEffect(() => {
        if (!votingSession || votingSession.votingEndTime === 0) {
            setVotingTimeLeft(null)
            return
        }

        const updateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000)
            const timeLeft = votingSession.votingEndTime - now
            setVotingTimeLeft(timeLeft > 0 ? timeLeft : 0)
        }

        updateTimeLeft()
        const interval = setInterval(updateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [votingSession?.votingEndTime])

    const formatTimeLeft = (seconds) => {
        if (seconds === null) return '--:--'
        if (seconds <= 0) return 'Expired'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const match = matchData || {}
    const participantsList = participantsWithNetwork ?
        participantsWithNetwork.map(p => typeof p === 'string' ? p : p.addr) : []
    const isCreator = address && match.creator ? address.toLowerCase() === match.creator.toLowerCase() : false
    const status = match.status !== undefined ? Number(match.status) : -1
    const gameType = match.gameType !== undefined ? Number(match.gameType) : 0

    const checkAndFinalizeVoting = useCallback(async () => {
        if (!votingSession || votingSession.finalized || !isCreator || isFinalizingVoting || finalizationAttempted) return

        const allVoted = votingSession.votesReceived >= votingSession.totalVoters
        const timeExpired = votingTimeLeft === 0

        if (allVoted || timeExpired) {
            setFinalizationAttempted(true)
            try {
                await finalizeVoting(matchId)
                await refetchVotingSession()
                await refetchFinalWinners()
                await refetchMatch()

                const updatedWinners = await refetchFinalWinners()
                if (!updatedWinners?.data || updatedWinners.data.length === 0) {
                    setShowAIFallbackModal(true)
                    toast('No consensus reached. AI verification required.', { icon: '⚠️' })
                }
            } catch (error) {
                console.error('Auto-finalize error:', error)
            }
        }
    }, [votingSession, votingTimeLeft, isCreator, matchId, finalizeVoting, refetchVotingSession, refetchFinalWinners, refetchMatch, isFinalizingVoting, finalizationAttempted])

    useEffect(() => {
        if (status === 2 && votingSession && !votingSession.finalized && !finalizationAttempted && !isFinalizingVoting) {
            const allVoted = votingSession.votesReceived >= votingSession.totalVoters
            const timeExpired = votingTimeLeft === 0

            if (allVoted || timeExpired) {
                checkAndFinalizeVoting()
            }
        }
    }, [status, votingSession, votingTimeLeft, checkAndFinalizeVoting, finalizationAttempted, isFinalizingVoting])

    useEffect(() => {
        if (votingSession?.finalized) {
        } else if (votingSession?.matchId) {
            setFinalizationAttempted(false)
        }
    }, [votingSession?.matchId, votingSession?.finalized])

    const handleCameraCapture = async () => {
        try {
            const result = await analyzeCameraCapture(Number(match.gameType), participantsList)
            if (result) {
                setShowCamera(false)
                setShowAIResult(true)
            } else {
                toast.error('AI analysis failed. Please try again.')
            }
        } catch (error) {
            console.error('Camera capture error:', error)
            toast.error('Failed to analyze camera capture')
        }
    }

    const handleScreenshotUpload = async (file) => {
        try {
            const result = await analyzeScreenshot(file, Number(match.gameType), participantsList)
            if (result) {
                setShowUpload(false)
                setShowAIResult(true)
            } else {
                toast.error('AI analysis failed. Please try again.')
            }
        } catch (error) {
            console.error('Screenshot upload error:', error)
            toast.error('Failed to analyze screenshot')
        }
    }

    const handleAIAccept = async () => {
        if (!aiResult?.winners?.length) {
            toast.error('No winners detected by AI')
            return
        }

        if (!isConnected) { toast.error('Connect wallet first'); return }
        try {
            await submitVote(matchId, aiResult.winners)
            setShowAIResult(false)
            resetAIResult()
            setTimeout(async () => {
                await Promise.all([refetchMatch(), refetchHasVoted(), refetchVotingSession()])
                toast.success('Vote submitted based on AI result!')
            }, 3000)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAIDecline = () => {
        setShowAIResult(false)
        setShowVoteModal(true)
        resetAIResult()
        toast('Switched to manual voting')
    }

    const isLoading = isLoadingMatch || isLoadingParticipants

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader size="lg" />
                    <p className="text-gray-400 mt-4">Loading match details...</p>
                </div>
            </div>
        )
    }

    if (!matchData || !matchData.id) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Match Not Found</h2>
                    <p className="text-gray-400 mb-6">This match doesn't exist or has been removed.</p>
                    <Link to="/matches"><Button>Browse Matches</Button></Link>
                </motion.div>
            </div>
        )
    }

    const participantsData = participantsWithNetwork || []
    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
    const copyAddress = (addr) => { navigator.clipboard.writeText(addr); toast.success('Address copied!') }

    const isParticipant = participantsList.some(p => p.toLowerCase() === address?.toLowerCase())

    console.log('MatchDetail Debug:', {
        userAddress: address,
        matchCreator: match.creator,
        isCreator: isCreator,
        matchStatus: status,
        addressMatch: address?.toLowerCase() === match.creator?.toLowerCase()
    })
    const spotsLeft = Number(match.maxParticipants) - Number(match.participantCount)

    const isOnlineGame = gameType === 2
    const isOutdoorGame = gameType === 1

    const canJoin = status === 0 && !isParticipant && spotsLeft > 0
    const canStart = isCreator && status === 0 && Number(match.participantCount) >= 2
    const canStartVoting = isCreator && status === 1
    const canVote = status === 2 && isParticipant && !userHasVoted

    const handleAIFallbackAnalysis = () => {
        setShowAIFallbackModal(false)
        if (gameType === 2) {
            setShowUpload(true)
        } else {
            setShowCamera(true)
        }
    }

    const handleAIFallbackAccept = async () => {
        if (!aiResult?.winners?.length) {
            toast.error('No winners detected by AI')
            return
        }

        try {
            await finalizeWithAI(matchId, aiResult.winners)
            setShowAIResult(false)
            resetAIResult()
            await Promise.all([refetchMatch(), refetchVotingSession(), refetchFinalWinners()])
            toast.success('Match finalized with AI verification!')
        } catch (error) {
            console.error('AI fallback error:', error)
            toast.error('Failed to finalize with AI')
        }
    }

    const handleJoin = async () => {
        if (!isConnected) { toast.error('Connect wallet first'); return }
        try {
            await joinMatch(matchId)
            setTimeout(async () => {
                await Promise.all([refetchMatch(), refetchParticipants()])
                toast.success('Successfully joined the match!')
            }, 3000)
        } catch (error) {
            console.error(error)
            toast.error('Failed to join match')
        }
    }

    const handleStartMatch = async () => {
        try {
            await startMatch(matchId)
            await refetchMatch()
            toast.success('Match started!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to start match')
        }
    }

    const handleStartVoting = async () => {
        try {
            await startVotingPhase(matchId)
            await refetchMatch()
            toast.success('Voting phase started!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to start voting phase')
        }
    }

    const handleRefresh = async () => {
        try {
            await Promise.all([refetchMatch(), refetchParticipants()])
            toast.success('Match data refreshed!')
        } catch (error) {
            console.error(error)
            toast.error('Failed to refresh data')
        }
    }

    const handleVote = async () => {
        if (selectedWinners.length === 0) { toast.error('Select at least one winner'); return }
        try {
            await submitVote(matchId, selectedWinners)
            setShowVoteModal(false)
            setSelectedWinners([])
            setTimeout(async () => {
                await Promise.all([refetchMatch(), refetchHasVoted(), refetchVotingSession()])
                toast.success('Vote submitted successfully!')
            }, 3000)
        } catch (error) {
            console.error(error)
            toast.error('Failed to submit vote')
        }
    }

    const toggleWinner = (addr) => {
        if (selectedWinners.includes(addr)) {
            setSelectedWinners(selectedWinners.filter(w => w !== addr))
        } else {
            setSelectedWinners([...selectedWinners, addr])
        }
    }

    const timeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() / 1000) - Number(timestamp))
        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
        return `${Math.floor(seconds / 86400)} days ago`
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center justify-between">
                <Link to="/matches" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />Back to Matches
                </Link>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRefresh}
                    icon={RefreshCw}
                    className="text-gray-400 hover:text-white"
                >
                    Refresh
                </Button>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
                    <Card gradient glow>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center text-3xl">
                                {GAME_TYPE_ICONS[gameType] || '🎮'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-bold text-white">{match.title}</h1>
                                    <MatchStatusBadge status={status} />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>{GAME_TYPE_NAMES[gameType]}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{timeAgo(match.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">{match.description || 'No description provided'}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <Coins className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{parseFloat(formatEther(match.entryStake)).toFixed(3)} ETH</div>
                                <div className="text-sm text-gray-500">Entry Stake</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <Trophy className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{parseFloat(formatEther(match.totalPrizePool)).toFixed(3)} ETH</div>
                                <div className="text-sm text-gray-500">Prize Pool</div>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{Number(match.participantCount)}/{Number(match.maxParticipants)}</div>
                                <div className="text-sm text-gray-500">Players</div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary-400" />Participants ({Number(match.participantCount)}/{Number(match.maxParticipants)})</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {isLoadingParticipants ? (
                                <div className="flex justify-center py-4"><Loader /></div>
                            ) : participantsData.length > 0 ? (
                                participantsData.map((participant, index) => {
                                    const addr = typeof participant === 'string' ? participant : participant.addr
                                    const networkName = typeof participant === 'object' ? participant.networkName : null
                                    return (
                                        <div key={addr} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-white font-medium">{formatAddress(addr)}</span>
                                                        {addr.toLowerCase() === match.creator?.toLowerCase() && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30">Creator</span>
                                                        )}
                                                        {addr.toLowerCase() === address?.toLowerCase() && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">You</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500">Player #{index + 1}</span>
                                                        {networkName && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                                {networkName}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => copyAddress(addr)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><Copy className="w-4 h-4" /></button>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-4 text-gray-500">No participants yet</div>
                            )}
                            {Array.from({ length: spotsLeft }).map((_, i) => (
                                <div key={`empty-${i}`} className="flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-white/10">
                                    <span className="text-gray-600">Waiting for player...</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                    <Card gradient glow>
                        <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {!isConnected ? (
                                <div className="text-center py-4"><p className="text-gray-400 mb-4">Connect wallet to participate</p><ConnectButton /></div>
                            ) : (
                                <>
                                    {canJoin && <Button className="w-full" onClick={handleJoin} loading={isJoiningMatch}>Join Match ({parseFloat(formatEther(match.entryStake)).toFixed(3)} ETH)</Button>}
                                    {canStart && <Button className="w-full" onClick={handleStartMatch} loading={isStartingMatch}>Start Match</Button>}
                                    {canStartVoting && (
                                        <Button className="w-full" onClick={handleStartVoting} loading={isStartingVoting}>End Match & Start Voting</Button>
                                    )}

                                    {status === 2 && isParticipant && !votingSession?.finalized &&
                                        !(votingSession && votingSession.votesReceived >= votingSession.totalVoters) && (
                                            <div className="space-y-4">
                                                {votingSession && (
                                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-400 flex items-center gap-2">
                                                                <Timer className="w-4 h-4" />
                                                                Time Left
                                                            </span>
                                                            <span className={`font-mono font-bold ${votingTimeLeft && votingTimeLeft > 60 ? 'text-green-400' : votingTimeLeft && votingTimeLeft > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                                {formatTimeLeft(votingTimeLeft)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-400 flex items-center gap-2">
                                                                <Vote className="w-4 h-4" />
                                                                Votes
                                                            </span>
                                                            <span className="text-white font-medium">
                                                                {votingSession.votesReceived} / {votingSession.totalVoters}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                                style={{ width: `${votingSession.totalVoters > 0 ? (votingSession.votesReceived / votingSession.totalVoters) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {userHasVoted ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30"
                                                    >
                                                        <div className="flex items-center justify-center gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-green-400 font-bold text-lg">Voted!</p>
                                                                <p className="text-gray-400 text-sm">Waiting for others...</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {gameType !== 2 && (
                                                            <Button
                                                                className="w-full"
                                                                icon={Camera}
                                                                onClick={() => setShowCamera(true)}
                                                                variant="secondary"
                                                                disabled={isAnalyzing}
                                                            >
                                                                AI Live Verify
                                                            </Button>
                                                        )}
                                                        {gameType === 2 && (
                                                            <Button
                                                                className="w-full"
                                                                icon={Upload}
                                                                onClick={() => setShowUpload(true)}
                                                                variant="secondary"
                                                                disabled={isAnalyzing}
                                                            >
                                                                AI Upload Verify
                                                            </Button>
                                                        )}

                                                        <Button
                                                            className="w-full"
                                                            icon={Vote}
                                                            onClick={() => setShowVoteModal(true)}
                                                        >
                                                            Manual Vote
                                                        </Button>

                                                        <p className="text-center text-xs text-gray-500 mt-2">
                                                            Use AI Verification for faster results
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {status === 2 && votingSession && !votingSession.finalized &&
                                        votingSession.votesReceived >= votingSession.totalVoters && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30"
                                            >
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                    <span className="text-white font-bold">All Votes In!</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-3">
                                                    Everyone has voted. Ready to declare results now!
                                                </p>
                                                {isCreator && (
                                                    <Button
                                                        className="w-full"
                                                        icon={Trophy}
                                                        onClick={async () => {
                                                            try {
                                                                await finalizeVoting(matchId)
                                                                await Promise.all([refetchVotingSession(), refetchFinalWinners(), refetchMatch()])
                                                                toast.success('Results declared!')
                                                            } catch (error) {
                                                                console.error('Finalize error:', error)
                                                                toast.error(error.reason || 'Failed to declare results')
                                                            }
                                                        }}
                                                        loading={isFinalizingVoting}
                                                        variant="gradient"
                                                    >
                                                        Declare Results Now
                                                    </Button>
                                                )}
                                                {!isCreator && (
                                                    <p className="text-xs text-gray-500 text-center">
                                                        Waiting for match creator to declare results...
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}

                                    {status === 2 && votingSession?.finalized && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-primary-500/10 border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Trophy className="w-5 h-5 text-yellow-400" />
                                                <span className="text-white font-bold">Results Declared</span>
                                            </div>
                                            {finalWinners && finalWinners.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Winners:</p>
                                                    {finalWinners.map((winner, idx) => (
                                                        <div key={winner} className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                                            <Award className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-yellow-300 font-medium">{formatAddress(winner)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-red-400">No consensus reached (Draw/Tie)</p>
                                                    {isCreator && (
                                                        <Button
                                                            className="w-full"
                                                            icon={Sparkles}
                                                            onClick={() => setShowAIFallbackModal(true)}
                                                            variant="gradient"
                                                        >
                                                            Use AI to Determine Winner
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {isParticipant && status === 0 && <p className="text-center text-sm text-gray-400 mt-2">Waiting for more players...</p>}
                                    {isParticipant && status === 1 && !isCreator && <p className="text-center text-sm text-gray-400 mt-2">Match in progress... Waiting for Creator to end match.</p>}
                                    {status === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Trophy className="w-5 h-5 text-yellow-400" />
                                                <span className="text-white font-bold">Match Completed</span>
                                            </div>
                                            {finalWinners && finalWinners.length > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-400">Winners:</p>
                                                    {finalWinners.map((winner, idx) => (
                                                        <div key={winner} className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                                            <Award className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-yellow-300 font-medium">{formatAddress(winner)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-sm">Rewards have been distributed</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Match Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between"><span className="text-gray-400">Match ID</span><span className="text-white">#{id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Game Type</span><span className="text-white">{GAME_TYPE_NAMES[gameType]}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Voting Duration</span><span className="text-white">{Number(match.votingDuration) / 3600}h</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Creator</span><span className="text-white">{formatAddress(match.creator)}</span></div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <Modal isOpen={showVoteModal} onClose={() => setShowVoteModal(false)} title="Vote for Winners" size="md">
                <div className="space-y-4">
                    <p className="text-gray-400">Select the participant(s) you believe won this match.</p>
                    <div className="space-y-2">
                        {participantsList.map((participant) => (
                            <button key={participant} onClick={() => toggleWinner(participant)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedWinners.includes(participant) ? 'bg-primary-500/20 border-primary-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                                    <span className="text-white">{formatAddress(participant)}</span>
                                </div>
                                {selectedWinners.includes(participant) && <CheckCircle className="w-5 h-5 text-primary-400" />}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setShowVoteModal(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleVote} loading={isVoting}>Submit Vote</Button>
                    </div>
                </div>
            </Modal>

            {showCamera && (
                <CameraCapture
                    videoRef={videoRef}
                    requestCameraAccess={requestCameraAccess}
                    stopCamera={stopCamera}
                    onCapture={handleCameraCapture}
                    onClose={() => { stopCamera(); setShowCamera(false); }}
                    isAnalyzing={isAnalyzing}
                />
            )}

            {showUpload && (
                <ScreenshotUpload
                    onAnalyze={handleScreenshotUpload}
                    onClose={() => setShowUpload(false)}
                    isAnalyzing={isAnalyzing}
                />
            )}

            {showAIResult && (
                <AIResultModal
                    isOpen={showAIResult}
                    onClose={() => { setShowAIResult(false); resetAIResult(); }}
                    aiResult={aiResult}
                    onAccept={handleAIAccept}
                    onDecline={handleAIDecline}
                    participants={participantsList}
                    formatAddress={formatAddress}
                />
            )}

            <Modal
                isOpen={showAIFallbackModal}
                onClose={() => setShowAIFallbackModal(false)}
                title="AI Verification Required"
                size="md"
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-yellow-300 font-medium">Voting Result: No Consensus</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    The participants' votes did not reach a consensus on the winner.
                                    You can use AI verification to analyze proof and determine the winner.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-gray-300 text-sm">Choose how to provide proof for AI analysis:</p>

                        {gameType !== 2 ? (
                            <Button
                                className="w-full"
                                icon={Camera}
                                onClick={handleAIFallbackAnalysis}
                                variant="gradient"
                            >
                                Use Camera to Capture Proof
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                icon={Upload}
                                onClick={handleAIFallbackAnalysis}
                                variant="gradient"
                            >
                                Upload Screenshot Proof
                            </Button>
                        )}

                        <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => setShowAIFallbackModal(false)}
                        >
                            Cancel
                        </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        AI will analyze the provided proof and determine the winner(s) automatically
                    </p>
                </div>
            </Modal>
        </div>
    )
}
