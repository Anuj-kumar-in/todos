import { motion } from 'framer-motion'
import { Bot, Check, X, AlertTriangle, User, Trophy, ThumbsUp, ThumbsDown } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

export default function AIResultModal({
    isOpen,
    onClose,
    aiResult,
    onAccept,
    onDecline,
    participants,
    formatAddress
}) {
    if (!isOpen || !aiResult) return null

    const winners = aiResult.winners || []
    const isError = winners.length === 0
    const confidenceColor = aiResult.confidence?.toLowerCase() === 'high' ? 'text-green-400' :
        aiResult.confidence?.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-red-400'

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-2xl w-full"
            >
                <Card gradient glow className="border-t-4 border-t-primary-500">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">AI Verdict</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    Confidence: <span className={`font-bold ${confidenceColor}`}>{aiResult.confidence || 'Unknown'}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* AI Analysis Content */}
                    <div className="space-y-6 mb-8">
                        {/* Game ID & Reasoning */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-primary-300 mb-2 font-medium">
                                <Trophy className="w-4 h-4" />
                                Analysis Result
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {aiResult.analysis || aiResult.reasoning || "Analysis completed based on the provided evidence."}
                            </p>
                        </div>

                        {/* Identified Winners */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Detected Winner(s)</h4>
                            {isError ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                    <div>
                                        <p className="text-red-400 font-medium">No clear winner detected</p>
                                        <p className="text-sm text-red-500/70">Please decline this result to vote manually.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {winners.map((winnerAddr, idx) => (
                                        <div key={idx} className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                                    <Trophy className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg">{formatAddress(winnerAddr)}</p>
                                                    <p className="text-xs text-green-400">Winner #{idx + 1}</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                                                Verified
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Scores if available */}
                        {aiResult.scores && (
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(aiResult.scores).map(([key, value]) => (
                                    <div key={key} className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase">{key}</p>
                                        <p className="text-lg font-bold text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-white/5 -mx-6 -mb-6 p-6 flex flex-col sm:flex-row items-center gap-4 border-t border-white/10 mt-6">
                        <div className="flex-1 text-sm text-gray-400 text-center sm:text-left">
                            By accepting, you agree to these results. If {'>'}50% vote decline, manual voting begins.
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button variant="secondary" onClick={onDecline} icon={ThumbsDown} className="flex-1 sm:flex-none bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20">
                                Decline
                            </Button>
                            <Button onClick={onAccept} icon={ThumbsUp} className="flex-1 sm:flex-none">
                                Accept Result
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}
