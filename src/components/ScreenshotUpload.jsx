import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, X, FileImage, Loader2, CheckCircle } from 'lucide-react'
import Button from './ui/Button'

export default function ScreenshotUpload({
    onAnalyze,
    onClose,
    isAnalyzing = false
}) {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    const handleFile = useCallback((selectedFile) => {
        if (!selectedFile) return

        if (!selectedFile.type.startsWith('image/')) {
            return
        }

        setFile(selectedFile)
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target.result)
        reader.readAsDataURL(selectedFile)
    }, [])

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [handleFile])

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        if (file) {
            onAnalyze(file)
        }
    }

    const clearFile = () => {
        setFile(null)
        setPreview(null)
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <FileImage className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Screenshot Proof</h3>
                            <p className="text-sm text-gray-400">Upload a screenshot of the game result</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="rounded-2xl overflow-hidden bg-arena-card border border-arena-border">
                    {!preview ? (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`aspect-video flex items-center justify-center transition-colors ${dragActive ? 'bg-primary-500/10 border-primary-500' : ''
                                }`}
                        >
                            <div className="text-center p-8">
                                <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${dragActive ? 'bg-primary-500/20' : 'bg-white/5'
                                    }`}>
                                    <Upload className={`w-10 h-10 ${dragActive ? 'text-primary-400' : 'text-gray-500'}`} />
                                </div>
                                <p className="text-white font-medium mb-2">
                                    Drag & drop your screenshot here
                                </p>
                                <p className="text-sm text-gray-400 mb-4">or</p>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors">
                                        <Image className="w-4 h-4" />
                                        Browse Files
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-4">
                                    Supported: JPG, PNG, WebP (max 10MB)
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Screenshot preview"
                                className="w-full aspect-video object-contain bg-black"
                            />

                            {/* Clear button */}
                            {!isAnalyzing && (
                                <button
                                    onClick={clearFile}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}

                            {/* Analyzing overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                    <div className="text-center">
                                        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-white font-medium">AI is analyzing...</p>
                                        <p className="text-sm text-gray-400">Detecting game results</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* File info */}
                {file && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div className="flex-1">
                            <p className="text-sm text-white font-medium">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </motion.div>
                )}

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
                        onClick={handleSubmit}
                        icon={FileImage}
                        disabled={!file || isAnalyzing}
                        loading={isAnalyzing}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Screenshot'}
                    </Button>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-300 text-center">
                        💡 For best results, upload a clear screenshot showing the final score or game result screen
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
