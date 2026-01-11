import { motion } from 'framer-motion'

export default function Card({
    children,
    className = '',
    hover = true,
    glow = false,
    gradient = false,
    padding = 'p-6',
    onClick,
    ...props
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4, scale: 1.01 } : {}}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`
        relative rounded-2xl overflow-hidden
        ${gradient
                    ? 'bg-gradient-to-br from-primary-500/10 via-arena-card to-blue-500/10'
                    : 'bg-arena-card'
                }
        border border-arena-border
        ${hover ? 'hover:border-primary-500/30 cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-primary-500/10' : ''}
        ${padding}
        transition-all duration-300
        ${className}
      `}
            {...props}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    )
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-xl font-bold text-white ${className}`}>
            {children}
        </h3>
    )
}

export function CardDescription({ children, className = '' }) {
    return (
        <p className={`text-gray-400 text-sm mt-1 ${className}`}>
            {children}
        </p>
    )
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`mt-4 pt-4 border-t border-arena-border ${className}`}>
            {children}
        </div>
    )
}
