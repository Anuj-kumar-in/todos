import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    LayoutDashboard,
    Swords,
    Plus,
    Trophy,
    User,
    Menu,
    X,
    Type
} from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/matches', label: 'Matches', icon: Swords },
    { path: '/create', label: 'Create', icon: Plus },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function Header({ currentFont, setCurrentFont }) {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [fontMenuOpen, setFontMenuOpen] = useState(false)

    const fonts = [
        { id: 'font-sans', name: 'Sans' },
        { id: 'font-bitcount', name: 'Bitcount' },
        { id: 'font-cinzel', name: 'Cinzel' },
        { id: 'font-rock-salt', name: 'Rock Salt' },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            <div className="glass-dark border-b border-arena-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="/fevicon.svg" alt="Todos Arena" className="h-40 w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-xl
                      font-medium transition-all duration-300
                      ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-xl -z-10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            {/* Font Selector */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setFontMenuOpen(!fontMenuOpen)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Type className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {fontMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-40 glass-dark border border-arena-border rounded-xl overflow-hidden shadow-xl"
                                        >
                                            {fonts.map((font) => (
                                                <button
                                                    key={font.id}
                                                    onClick={() => {
                                                        setCurrentFont(font.id)
                                                        setFontMenuOpen(false)
                                                    }}
                                                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2
                                                        ${currentFont === font.id
                                                            ? 'bg-primary-500/20 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                        }
                                                    `}
                                                >
                                                    <span className={font.id}>{font.name}</span>
                                                    {currentFont === font.id && (
                                                        <motion.div
                                                            layoutId="active-font"
                                                            className="w-1.5 h-1.5 rounded-full bg-primary-500 ml-auto"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <ConnectButton
                                chainStatus="icon"
                                showBalance={false}
                                accountStatus={{
                                    smallScreen: 'avatar',
                                    largeScreen: 'full',
                                }}
                            />

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-dark border-b border-arena-border overflow-hidden"
                    >
                        <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl
                                            font-medium transition-all duration-300
                                            ${isActive
                                                ? 'text-white bg-primary-500/20 border border-primary-500/30'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}

                            {/* Mobile Font Selector */}
                            <div className="pt-2 mt-2 border-t border-white/5">
                                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Font Style</p>
                                <div className="flex gap-2 px-4">
                                    {fonts.map((font) => (
                                        <button
                                            key={font.id}
                                            onClick={() => setCurrentFont(font.id)}
                                            className={`
                                                flex-1 py-2 px-3 rounded-lg text-sm border transition-all
                                                ${currentFont === font.id
                                                    ? 'bg-primary-500/20 border-primary-500/50 text-white'
                                                    : 'border-transparent bg-white/5 text-gray-400'
                                                }
                                            `}
                                        >
                                            <span className={font.id}>{font.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
