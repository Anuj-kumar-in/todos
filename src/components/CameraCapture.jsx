import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Video, VideoOff, Circle, X, Loader2, CheckCircle } from 'lucide-react'
import Button from './ui/Button'

export default function CameraCapture({
    videoRef,
    onCapture,
    onClose,
    isAnalyzing = false,
    requestCameraAccess,
    stopCamera
}) {
    const [hasPermission, setHasPermission] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [countdown, setCountdown] = useState(null)

    useEffect(() => {
        const initCamera = async () => {
            const stream = await requestCameraAccess()
            if (stream) {
                setHasPermission(true)
            }
        }
        initCamera()

        return () => {
            stopCamera()
        }
    }, [])

    const handleCapture = () => {
        // 3 second countdown before capture
        setCountdown(3)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    onCapture()
                    return null
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        // Auto-capture after 5 seconds
        setTimeout(() => {
            setIsRecording(false)
            onCapture()
        }, 5000)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Live Camera Detection</h3>
                            <p className="text-sm text-gray-400">Point camera at the game for AI analysis</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Camera View */}
                <div className="relative rounded-2xl overflow-hidden bg-arena-card border border-arena-border">
                    {!hasPermission ? (
                        <div className="aspect-video flex items-center justify-center">
                            <div className="text-center">
                                <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 mb-4">Requesting camera access...</p>
                                <Loader2 className="w-8 h-8 text-primary-400 mx-auto animate-spin" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full aspect-video object-cover"
                            />

                            {/* Recording indicator */}
                            {isRecording && (
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-medium">
                                    <Circle className="w-3 h-3 fill-current animate-pulse" />
                                    Recording...
                                </div>
                            )}

                            {/* Countdown overlay */}
                            {countdown && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <motion.div
                                        key={countdown}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 1.5, opacity: 0 }}
                                        className="text-8xl font-bold text-white"
                                    >
                                        {countdown}
                                    </motion.div>
                                </div>
                            )}

                            {/* Analyzing overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white font-medium">AI is analyzing...</p>
                                        <p className="text-sm text-gray-400">Detecting winners</p>
                                    </div>
                                </div>
                            )}

                            {/* Corner frame markers */}
                            <div className="absolute inset-8 pointer-events-none">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-500" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500" />
                            </div>
                        </>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isAnalyzing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCapture}
                        icon={Camera}
                        disabled={!hasPermission || isAnalyzing || countdown !== null}
                        loading={isAnalyzing}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Capture & Analyze'}
                    </Button>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-300 text-center">
                        💡 Make sure the final score or game result is clearly visible in the camera frame
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
