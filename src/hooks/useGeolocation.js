import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useGeolocation() {
    const [location, setLocation] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState('prompt') // 'granted' | 'denied' | 'prompt'

    const checkPermission = useCallback(async () => {
        if ('permissions' in navigator) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' })
                setPermissionStatus(result.state)
                result.onchange = () => setPermissionStatus(result.state)
            } catch (err) {
                console.log('Permission API not supported')
            }
        }
    }, [])

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser')
            toast.error('Geolocation is not supported by your browser')
            return
        }

        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                })
                setLoading(false)
                setPermissionStatus('granted')
                toast.success('Location access granted!')
            },
            (err) => {
                setError(err.message)
                setLoading(false)
                if (err.code === 1) {
                    setPermissionStatus('denied')
                    toast.error('Location permission denied. Enable it in browser settings.')
                } else {
                    toast.error('Failed to get location')
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
            }
        )
    }, [])

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371 // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180
        const dLon = ((lon2 - lon1) * Math.PI) / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }, [])

    const isNearby = useCallback(
        (matchLat, matchLon, maxDistanceKm = 50) => {
            if (!location) return false
            const distance = calculateDistance(
                location.latitude,
                location.longitude,
                matchLat,
                matchLon
            )
            return distance <= maxDistanceKm
        },
        [location, calculateDistance]
    )

    useEffect(() => {
        checkPermission()
    }, [checkPermission])

    return {
        location,
        error,
        loading,
        permissionStatus,
        requestLocation,
        calculateDistance,
        isNearby,
    }
}

export default useGeolocation
