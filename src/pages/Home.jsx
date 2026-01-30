import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import {
    Zap,
    Shield,
    Users,
    Trophy,
    ArrowRight,
    Sparkles,
    Bot,
    Vote,
    Coins,
    Wallet
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useRelayerContract } from '../hooks/useRelayerContract'

const features = [
    {
        icon: Bot,
        title: 'AI-Powered Verification',
        description: 'Advanced AI detects winners through real-time video analysis, ensuring fair outcomes for every match.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Vote,
        title: 'Community Voting',
        description: 'Decentralized voting system where participants verify results, ensuring transparency and trust.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Coins,
        title: 'Token Rewards',
        description: 'Earn TODO tokens for winning matches and participating in votes. Stake, trade, and grow your earnings.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Shield,
        title: 'Blockchain Secured',
        description: 'All matches and results are immutably recorded on Ethereum, guaranteeing transparency.',
        color: 'from-orange-500 to-amber-500',
    },
]

const stats = [
    { label: 'Active Matches', value: '2,450+' },
    { label: 'Total Players', value: '50K+' },
    { label: 'TODO Distributed', value: '1.2M' },
    { label: 'Games Supported', value: '25+' },
]

const gameTypes = [
    { emoji: '🏀', name: 'Basketball', category: 'Indoor' },
    { emoji: '⚽', name: 'Football', category: 'Outdoor' },
    { emoji: '🎮', name: 'Esports', category: 'Online' },
    { emoji: '🏓', name: 'Table Tennis', category: 'Indoor' },
    { emoji: '🏃', name: 'Running', category: 'Outdoor' },
    { emoji: '🎯', name: 'Darts', category: 'Offline' },
]

// 3D Card Component with cursor tracking
function Hero3DCard({ children, className = '' }) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

    const handleMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        x.set((mouseX / width) - 0.5)
        y.set((mouseY / height) - 0.5)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className={`${className}`}
        >
            {children}
        </motion.div>
    )
}

// Floating 3D Elements
function Floating3DElements({ mouseX, mouseY }) {
    const springConfig = { stiffness: 100, damping: 20 }
    const xSpring = useSpring(mouseX, springConfig)
    const ySpring = useSpring(mouseY, springConfig)

    const elements = [
        { icon: '🏆', size: 'w-16 h-16', position: 'top-20 left-[15%]', depth: 40 },
        { icon: '🎮', size: 'w-14 h-14', position: 'top-32 right-[20%]', depth: 30 },
        { icon: '⚡', size: 'w-12 h-12', position: 'bottom-40 left-[10%]', depth: 50 },
        { icon: '🪙', size: 'w-14 h-14', position: 'bottom-32 right-[15%]', depth: 35 },
        { icon: '🎯', size: 'w-10 h-10', position: 'top-40 left-[30%]', depth: 25 },
        { icon: '🔥', size: 'w-12 h-12', position: 'bottom-48 right-[30%]', depth: 45 },
    ]

    return (
        <>
            {elements.map((el, index) => (
                <motion.div
                    key={index}
                    className={`absolute ${el.position} ${el.size} flex items-center justify-center text-3xl pointer-events-none`}
                    style={{
                        x: useTransform(xSpring, [0, 1], [0, el.depth]),
                        y: useTransform(ySpring, [0, 1], [0, el.depth]),
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4 + index * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="glass-card rounded-2xl p-3 shadow-lg shadow-primary-500/10">
                        {el.icon}
                    </div>
                </motion.div>
            ))}
        </>
    )
}

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
    const heroRef = useRef(null)
    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)

    const { isConnected, address } = useAccount()
    const { userBalanceFormatted, isUserRegistered, registerUser, isRegistering } = useRelayerContract()

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return
            const rect = heroRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
            mouseX.set(x)
            mouseY.set(y)
            setMousePosition({ x, y })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="relative">
            {/* Hero Section with 3D Effects */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
                {/* Animated background elements with cursor response */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        style={{
                            x: useTransform(mouseX, [0, 1], [-30, 30]),
                            y: useTransform(mouseY, [0, 1], [-30, 30]),
                        }}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity }}
                        style={{
                            x: useTransform(mouseX, [0, 1], [20, -20]),
                            y: useTransform(mouseY, [0, 1], [20, -20]),
                        }}
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-[100px]"
                    />
                </div>

                {/* Floating 3D Elements */}
                <Floating3DElements mouseX={mouseX} mouseY={mouseY} />

                {/* Main Content with 3D Tilt */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Hero3DCard className="text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
                            style={{ transform: 'translateZ(50px)' }}
                        >
                            <Sparkles className="w-4 h-4 text-primary-400" />
                            <span className="text-sm text-primary-300">Now Live on Ethereum</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
                            style={{ transform: 'translateZ(80px)' }}
                        >
                            <span className="text-white">Compete. Vote. </span>
                            <span className="gradient-text">Earn.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                            style={{ transform: 'translateZ(60px)' }}
                        >
                            The ultimate decentralized arena for competitive gaming.
                            AI-powered winner detection, community voting, and blockchain-secured rewards.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            style={{ transform: 'translateZ(100px)' }}
                        >
                            <Link to="/matches">
                                <Button size="lg" icon={Zap}>
                                    Browse Matches
                                </Button>
                            </Link>
                            <Link to="/create">
                                <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                                    Create Match
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Connect Wallet & TODO Balance Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-8"
                            style={{ transform: 'translateZ(40px)' }}
                        >
                            {isConnected ? (
                                <div className="flex flex-col items-center gap-4">
                                    {/* TODO Balance Display */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="glass-card px-8 py-4 rounded-2xl border border-primary-500/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                                <Wallet className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Your TODO Balance</p>
                                                <p className="text-2xl font-bold text-white">
                                                    {isUserRegistered ? (
                                                        <span className="gradient-text">{userBalanceFormatted.toLocaleString()} TODO</span>
                                                    ) : (
                                                        <span className="text-gray-500">Not Registered</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Register Button (if not registered) */}
                                    {!isUserRegistered && (
                                        <Button
                                            onClick={registerUser}
                                            loading={isRegistering}
                                            icon={Sparkles}
                                            variant="gradient"
                                        >
                                            Register & Get 100 FREE TODO
                                        </Button>
                                    )}

                                    <ConnectButton />
                                </div>
                            ) : (
                                <ConnectButton />
                            )}
                        </motion.div>
                    </Hero3DCard>
                </div>

                {/* Cursor Glow Effect */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                        left: `${mousePosition.x * 100}%`,
                        top: `${mousePosition.y * 100}%`,
                        x: '-50%',
                        y: '-50%',
                    }}
                />

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-gray-400 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-arena-border bg-arena-darker/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Why <span className="gradient-text">todosArena</span>?
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We combine cutting-edge AI technology with blockchain transparency
                            to create the fairest competitive gaming platform.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="glass-card p-6 rounded-2xl group cursor-pointer"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Game Types Section */}
            <section className="py-24 bg-arena-darker/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Supported <span className="gradient-text">Games</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From indoor sports to esports, we support a wide variety of competitive activities.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {gameTypes.map((game, index) => (
                            <motion.div
                                key={game.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.1, y: -10, rotateY: 10 }}
                                className="glass-card p-6 rounded-2xl text-center cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="text-4xl mb-3">{game.emoji}</div>
                                <div className="text-white font-medium mb-1">{game.name}</div>
                                <div className="text-xs text-gray-500">{game.category}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-3xl overflow-hidden"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20" />
                        <div className="absolute inset-0 bg-arena-card/80 backdrop-blur-xl" />

                        <div className="relative p-12 text-center">
                            <Trophy className="w-16 h-16 text-primary-400 mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Ready to Compete?
                            </h2>
                            <p className="text-gray-400 max-w-lg mx-auto mb-8">
                                Join thousands of players competing for glory and TODO tokens.
                                Connect your wallet and start your journey today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/create">
                                    <Button size="lg" icon={Zap}>
                                        Create Your First Match
                                    </Button>
                                </Link>
                                <Link to="/matches">
                                    <Button variant="secondary" size="lg">
                                        Explore Matches
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
