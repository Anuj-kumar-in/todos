import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import {
    Home,
    LayoutDashboard,
    Swords,
    Plus,
    Trophy,
    User,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/matches', label: 'Matches', icon: Swords },
    { path: '/create', label: 'Create', icon: Plus },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function Header() {
    const location = useLocation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-40">
            <div className="glass-dark border-b border-arena-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25"
                            >
                                <span className="text-white font-bold text-lg">T</span>
                            </motion.div>
                            <span className="text-xl font-bold gradient-text hidden sm:block">
                                todosArena
                            </span>
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
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden glass-dark border-b border-arena-border"
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
                    </nav>
                </motion.div>
            )}
        </header>
    )
}
