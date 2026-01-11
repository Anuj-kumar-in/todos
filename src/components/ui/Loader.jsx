import { motion } from 'framer-motion'

export function Loader({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizes[size]} border-4 border-primary-500/20 border-t-primary-500 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    )
}

export default Loader

export function PageLoader() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader size="lg" />
            <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="bg-arena-card border border-arena-border rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-700 rounded w-5/6" />
            </div>
            <div className="flex gap-2 mt-4">
                <div className="h-8 bg-gray-700 rounded-lg w-20" />
                <div className="h-8 bg-gray-700 rounded-lg w-20" />
            </div>
        </div>
    )
}

export function SkeletonList({ count = 3 }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}
