import { useState, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export function useAIDetection() {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiResult, setAiResult] = useState(null)
    const [error, setError] = useState(null)
    const videoRef = useRef(null)
    const streamRef = useRef(null)

    // Request camera access
    const requestCameraAccess = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 1280, height: 720 },
                audio: false
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
            toast.success('Camera access granted!')
            return stream
        } catch (err) {
            console.error('Camera access error:', err)
            toast.error('Camera access denied. Please enable in browser settings.')
            setError('Camera access denied')
            return null
        }
    }, [])

    // Stop camera
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }, [])

    // Capture frame from video
    const captureFrame = useCallback(() => {
        if (!videoRef.current) return null
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0)
        return canvas.toDataURL('image/jpeg', 0.8)
    }, [])

    // Convert file to base64
    const fileToBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }, [])

    // Analyze image with Gemini AI
    const analyzeWithGemini = useCallback(async (imageBase64, gameType, participants) => {
        if (!GEMINI_API_KEY) {
            toast.error('Gemini API key not configured')
            setError('API key missing')
            return null
        }

        setIsAnalyzing(true)
        setError(null)

        try {
            // Remove data URL prefix to get pure base64
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

            const gameTypeNames = {
                0: 'indoor sports (basketball, table tennis, etc.)',
                1: 'outdoor sports (running, football, etc.)',
                2: 'online video game (esports)',
                3: 'offline game (darts, chess, etc.)',
                4: 'hybrid game'
            }

            const participantList = participants.map((p, i) => `Player ${i + 1}: ${p}`).join('\n')

            const prompt = `You are an AI judge for a competitive gaming platform. Analyze this image/screenshot from a ${gameTypeNames[gameType]} match.

Match Participants:
${participantList}

Your task:
1. Identify what game/sport is being played
2. Analyze the visible scores, results, or outcome indicators
3. Determine the winner(s) based on visible evidence

IMPORTANT: You must respond in this exact JSON format:
{
  "gameIdentified": "Name of the game/sport",
  "analysis": "Brief description of what you see",
  "scores": {"player1": "score or status", "player2": "score or status"},
  "winners": ["address1", "address2"],
  "confidence": "high/medium/low",
  "reasoning": "Why you determined these winners"
}

If you cannot determine winners, set winners to an empty array and explain in reasoning.
Only include participant addresses from the list above in the winners array.`

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: 'image/jpeg', data: base64Data } }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 1024,
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

            if (!textResponse) {
                throw new Error('No response from AI')
            }

            // Extract JSON from response
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
            if (!jsonMatch) {
                throw new Error('Invalid AI response format')
            }

            const result = JSON.parse(jsonMatch[0])
            setAiResult(result)
            toast.success('AI analysis complete!')
            return result

        } catch (err) {
            console.error('Gemini AI error:', err)
            setError(err.message)
            toast.error('AI analysis failed: ' + err.message)
            return null
        } finally {
            setIsAnalyzing(false)
        }
    }, [])

    // Analyze camera capture (for outdoor games)
    const analyzeCameraCapture = useCallback(async (gameType, participants) => {
        const imageData = captureFrame()
        if (!imageData) {
            toast.error('Failed to capture frame')
            return null
        }
        return analyzeWithGemini(imageData, gameType, participants)
    }, [captureFrame, analyzeWithGemini])

    // Analyze uploaded screenshot (for online games)
    const analyzeScreenshot = useCallback(async (file, gameType, participants) => {
        try {
            const imageData = await fileToBase64(file)
            return analyzeWithGemini(imageData, gameType, participants)
        } catch (err) {
            toast.error('Failed to process image')
            return null
        }
    }, [fileToBase64, analyzeWithGemini])

    // Reset state
    const resetAIResult = useCallback(() => {
        setAiResult(null)
        setError(null)
    }, [])

    return {
        // State
        isAnalyzing,
        aiResult,
        error,
        videoRef,

        // Camera functions
        requestCameraAccess,
        stopCamera,
        captureFrame,

        // Analysis functions
        analyzeCameraCapture,
        analyzeScreenshot,
        analyzeWithGemini,

        // Utility
        resetAIResult,
        fileToBase64,
    }
}

export default useAIDetection
