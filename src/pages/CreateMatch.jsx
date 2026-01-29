import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
    Zap,
    AlertCircle,
    Info,
    Coins,
    Users,
    Clock,
    ChevronRight,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Input, { Textarea, Select } from '../components/ui/Input'
import { GAME_TYPE_ICONS, GAME_TYPE_NAMES } from '../config/contracts'
import { useTodosArenaContract } from '../hooks/useTodosArenaContract'
import toast from 'react-hot-toast'

const gameTypeOptions = [
    { value: '0', label: '🏀 Indoor (Basketball, Table Tennis, etc.)' },
    { value: '1', label: '🏃 Outdoor (Running, Athletics, etc.)' },
    { value: '2', label: '🎮 Online (Esports, Video Games)' },
    { value: '3', label: '🎯 Offline (Darts, Chess, etc.)' },
    { value: '4', label: '🔄 Hybrid (Mixed format)' },
]

const votingDurationOptions = [
    { value: '3600', label: '1 hour' },
    { value: '7200', label: '2 hours' },
    { value: '21600', label: '6 hours' },
    { value: '43200', label: '12 hours' },
    { value: '86400', label: '24 hours' },
    { value: '172800', label: '48 hours' },
]

export default function CreateMatch() {
    const navigate = useNavigate()
    const { address, isConnected } = useAccount()
    const { createMatch, isCreatingMatch } = useTodosArenaContract()
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        gameType: '0',
        entryStake: '10',
        maxParticipants: '2',
        votingDuration: '86400',
    })

    const [errors, setErrors] = useState({})

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    const validateStep1 = () => {
        const newErrors = {}
        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (formData.title.length > 50) newErrors.title = 'Title must be under 50 characters'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
        const newErrors = {}
        const stake = parseFloat(formData.entryStake)
        const participants = parseInt(formData.maxParticipants)

        if (isNaN(stake) || stake <= 0) newErrors.entryStake = 'Entry stake must be greater than 0'
        if (stake > 1000) newErrors.entryStake = 'Maximum entry stake is 1000 TODO'
        if (isNaN(participants) || participants < 2) newErrors.maxParticipants = 'Minimum 2 participants required'
        if (participants > 100) newErrors.maxParticipants = 'Maximum 100 participants allowed'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2)
        else if (step === 2 && validateStep2()) setStep(3)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!isConnected) {
            toast.error('Please connect your wallet first')
            return
        }

        try {
            const txHash = await createMatch(
                formData.title,
                formData.description,
                parseInt(formData.gameType),
                formData.entryStake,
                parseInt(formData.maxParticipants),
                parseInt(formData.votingDuration)
            )

            toast.success('Match created on blockchain!')

            // Wait a bit for the transaction to be processed, then navigate to matches
            setTimeout(() => {
                navigate('/matches')
            }, 2000)
        } catch (error) {
            console.error('Create match error:', error)
        }
    }

    const prizePool = (parseFloat(formData.entryStake) || 0) * (parseInt(formData.maxParticipants) || 0)

    if (!isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                        <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Connect Your Wallet
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                        Please connect your wallet to create a new match.
                    </p>
                    <ConnectButton />
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">
                    Create a <span className="gradient-text">Match</span>
                </h1>
                <p className="text-gray-400">
                    Set up your competitive match and invite players to compete
                </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-12"
            >
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div
                            className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${step >= s
                                    ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                                    : 'bg-white/10 text-gray-500'
                                }
              `}
                        >
                            {s}
                        </div>
                        {s < 3 && (
                            <div
                                className={`w-12 h-1 ml-2 rounded-full ${step > s ? 'bg-primary-500' : 'bg-white/10'
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </motion.div>

            {/* Form Steps */}
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                <Card gradient>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <>
                            <CardHeader>
                                <CardTitle>Match Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Input
                                    label="Match Title"
                                    placeholder="e.g., Basketball 3v3 Tournament"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    error={errors.title}
                                />
                                <Textarea
                                    label="Description"
                                    placeholder="Describe your match rules, format, and what players can expect..."
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    rows={4}
                                    error={errors.description}
                                />
                                <Select
                                    label="Game Type"
                                    options={gameTypeOptions}
                                    value={formData.gameType}
                                    onChange={(e) => updateField('gameType', e.target.value)}
                                />

                                {/* Game type preview */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center text-2xl">
                                        {GAME_TYPE_ICONS[parseInt(formData.gameType)]}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">
                                            {GAME_TYPE_NAMES[parseInt(formData.gameType)]}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {parseInt(formData.gameType) === 0 && 'Perfect for basketball, table tennis, badminton'}
                                            {parseInt(formData.gameType) === 1 && 'Great for running, cycling, field sports'}
                                            {parseInt(formData.gameType) === 2 && 'Ideal for FIFA, Call of Duty, League of Legends'}
                                            {parseInt(formData.gameType) === 3 && 'Suited for darts, chess, card games'}
                                            {parseInt(formData.gameType) === 4 && 'Combination of different game modes'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Step 2: Stakes & Participants */}
                    {step === 2 && (
                        <>
                            <CardHeader>
                                <CardTitle>Stakes & Participants</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Entry Stake (TODO)"
                                        type="number"
                                        step="1"
                                        min="1"
                                        placeholder="10"
                                        value={formData.entryStake}
                                        onChange={(e) => updateField('entryStake', e.target.value)}
                                        error={errors.entryStake}
                                        icon={Coins}
                                    />
                                    <Input
                                        label="Max Participants"
                                        type="number"
                                        min="2"
                                        max="100"
                                        placeholder="2"
                                        value={formData.maxParticipants}
                                        onChange={(e) => updateField('maxParticipants', e.target.value)}
                                        error={errors.maxParticipants}
                                        icon={Users}
                                    />
                                </div>

                                <Select
                                    label="Voting Duration"
                                    options={votingDurationOptions}
                                    value={formData.votingDuration}
                                    onChange={(e) => updateField('votingDuration', e.target.value)}
                                />

                                {/* Prize Pool Preview */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-blue-500/10 border border-primary-500/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Coins className="w-6 h-6 text-yellow-500" />
                                        <span className="text-gray-400">Estimated Prize Pool</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white">
                                        {prizePool.toFixed(0)} TODO
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Based on {formData.maxParticipants} participants × {formData.entryStake} TODO entry
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                                    <p className="text-sm text-blue-300">
                                        A 5% platform fee will be deducted from the prize pool.
                                        Winners will receive the remaining amount.
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <>
                            <CardHeader>
                                <CardTitle>Review & Create</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center text-3xl">
                                            {GAME_TYPE_ICONS[parseInt(formData.gameType)]}
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white">{formData.title}</div>
                                            <div className="text-sm text-gray-400">
                                                {GAME_TYPE_NAMES[parseInt(formData.gameType)]}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-400">{formData.description}</p>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-white/5">
                                            <Coins className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                                            <div className="text-lg font-bold text-white">{formData.entryStake}</div>
                                            <div className="text-xs text-gray-500">Entry (TODO)</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/5">
                                            <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                            <div className="text-lg font-bold text-white">{formData.maxParticipants}</div>
                                            <div className="text-xs text-gray-500">Max Players</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/5">
                                            <Clock className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                            <div className="text-lg font-bold text-white">
                                                {parseInt(formData.votingDuration) / 3600}h
                                            </div>
                                            <div className="text-xs text-gray-500">Vote Time</div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-blue-500/10 border border-primary-500/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Total Prize Pool</span>
                                            <span className="text-2xl font-bold gradient-text">
                                                {prizePool.toFixed(0)} TODO
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 p-6 border-t border-arena-border mt-6">
                        {step > 1 && (
                            <Button variant="secondary" onClick={handleBack} className="flex-1">
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button onClick={handleNext} className="flex-1" icon={ChevronRight} iconPosition="right">
                                Continue
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} loading={isCreatingMatch} className="flex-1" icon={Zap}>
                                Create Match
                            </Button>
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
