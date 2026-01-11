import { forwardRef } from 'react'

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    type = 'text',
    ...props
}, ref) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full px-4 py-3 rounded-xl
            bg-arena-card border border-arena-border
            text-white placeholder-gray-500
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            transition-all duration-300
            ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
                {Icon && iconPosition === 'right' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input

export function Textarea({
    label,
    error,
    className = '',
    rows = 4,
    ...props
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <textarea
                rows={rows}
                className={`
          w-full px-4 py-3 rounded-xl
          bg-arena-card border border-arena-border
          text-white placeholder-gray-500
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
          transition-all duration-300 resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}

export function Select({
    label,
    error,
    options = [],
    className = '',
    ...props
}) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
            )}
            <select
                className={`
          w-full px-4 py-3 rounded-xl
          bg-arena-card border border-arena-border
          text-white
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
          transition-all duration-300
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-arena-card"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
        </div>
    )
}
