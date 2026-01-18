import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }) {
    const [currentFont, setCurrentFont] = useState('font-sans')

    return (
        <div className={`min-h-screen flex flex-col bg-arena-dark bg-grid ${currentFont}`}>
            {/* Background Effects */}
            <div className="fixed inset-0 bg-radial-glow pointer-events-none" />

            {/* Floating orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[200px] pointer-events-none" />

            <Header currentFont={currentFont} setCurrentFont={setCurrentFont} />

            <main className="flex-1 pt-16 relative z-10">
                {children}
            </main>

            <Footer />
        </div>
    )
}
