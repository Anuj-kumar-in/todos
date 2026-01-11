import { MATCH_STATUS_NAMES, MATCH_STATUS_COLORS } from '../../config/contracts'

const variants = {
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
}

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
}

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    icon: Icon,
    dot = false,
}) {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        border backdrop-blur-sm
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            )}
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {children}
        </span>
    )
}

export function MatchStatusBadge({ status }) {
    const statusVariant = {
        0: 'success', // CREATED/Open
        1: 'info',    // ACTIVE
        2: 'warning', // VOTING
        3: 'primary', // COMPLETED
        4: 'danger',  // CANCELLED
    }

    return (
        <Badge variant={statusVariant[status] || 'default'} dot={status < 3}>
            {MATCH_STATUS_NAMES[status] || 'Unknown'}
        </Badge>
    )
}

export function GameTypeBadge({ type, icon }) {
    const typeVariants = {
        0: 'primary',  // INDOOR
        1: 'success',  // OUTDOOR
        2: 'info',     // ONLINE
        3: 'warning',  // OFFLINE
        4: 'default',  // HYBRID
    }

    return (
        <Badge variant={typeVariants[type] || 'default'}>
            {icon && <span className="mr-1">{icon}</span>}
        </Badge>
    )
}
