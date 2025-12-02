"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui"
import MatrixRain from "@/components/MatrixRain"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Check, Terminal, Server, Settings, Globe } from "lucide-react"
import { useState, useEffect } from "react"

export default function SignIn() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-lime-400 selection:text-black overflow-hidden flex">
            {/* Left Side - Simulation */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center border-r border-white/10 bg-zinc-900/20">
                <div className="absolute inset-0 opacity-30">
                    <MatrixRain />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]/50 z-10" />

                <div className="relative z-20 w-full max-w-lg p-12">
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-lime-400/30 bg-lime-400/5 text-lime-400 text-xs font-black tracking-[0.2em] uppercase backdrop-blur-sm mb-6">
                            <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                            System Simulation
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                            Deploy in <br />
                            <span className="text-lime-400">Seconds</span>
                        </h2>
                    </div>

                    <Simulation />
                </div>
            </div>

            {/* Right Side - Login */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8">
                {/* Back Button */}
                <div className="absolute top-8 left-8 z-50">
                    <Link href="/">
                        <Button variant="ghost" className="text-zinc-400 hover:text-lime-400 hover:bg-transparent gap-2 pl-0 font-bold tracking-wider uppercase text-xs">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Base
                        </Button>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-12">
                            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase text-white">
                                Login to <br />
                                <span className="text-lime-400">Console</span>
                            </h1>
                            <p className="text-zinc-500 font-medium text-lg">
                                Access your dashboard to manage instances.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                className="w-full h-16 text-lg font-black uppercase tracking-widest !bg-white !text-black hover:!bg-lime-400 hover:!text-black border-4 border-transparent hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-none group"
                            >
                                <span className="mr-3 text-xl">G</span>
                                Continue with Google
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-zinc-600 font-mono mt-8">
                                    SECURE ACCESS // AUTHORIZED PERSONNEL ONLY
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

function Simulation() {
    const [step, setStep] = useState(0)
    const [selections, setSelections] = useState<Record<number, string>>({})
    const [hoveredStep, setHoveredStep] = useState<number | null>(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 5) // 5 steps to include a "pause" at the end
        }, 2000)
        return () => clearInterval(timer)
    }, [])

    const steps = [
        {
            icon: Server,
            title: "Select Template",
            desc: ["Mikhmon v3", "Mikbotam", "PHPNuxBill", "Radius"]
        },
        {
            icon: Settings,
            title: "Tweak Settings",
            desc: ["Configure personalization", "Set custom domain", "Enable SSL", "Add users"]
        },
        {
            icon: Terminal,
            title: "Deploying",
            desc: "Container starting..."
        },
        {
            icon: Globe,
            title: "Live",
            desc: "myapp.mikhmon.box"
        },
    ]

    const handleSelect = (stepIndex: number, value: string) => {
        setSelections(prev => ({ ...prev, [stepIndex]: value }))
    }

    // Reset selections when loop restarts
    useEffect(() => {
        if (step === 0) {
            setSelections({})
        }
    }, [step])

    return (
        <div className="relative border-l-2 border-white/10 pl-8 space-y-8">
            {steps.map((s, i) => {
                const isSimActive = i <= step && step < 4
                const isHovered = i === hoveredStep
                const isActive = isSimActive || isHovered
                const isCurrent = i === step

                const hasOptions = Array.isArray(s.desc)
                const currentDesc = selections[i] || (Array.isArray(s.desc) ? s.desc[0] : s.desc)

                return (
                    <motion.div
                        key={i}
                        className={`relative flex items-start gap-4 transition-all duration-300 group ${isActive ? 'opacity-100' : 'opacity-30'}`}
                        animate={{ x: isActive ? 10 : 0 }}
                        onMouseEnter={() => setHoveredStep(i)}
                        onMouseLeave={() => setHoveredStep(null)}
                        style={{ zIndex: isHovered ? 50 : 1 }}
                    >
                        <div className={`absolute -left-[39px] top-2 w-5 h-5 rounded-full border-4 border-[#050505] transition-colors duration-500 ${isActive ? 'bg-lime-400' : 'bg-zinc-800'}`} />

                        <div className={`p-3 rounded-none border transition-colors duration-300 ${isActive ? 'border-lime-400 bg-lime-400/10 text-lime-400' : 'border-white/10 bg-white/5 text-zinc-500'}`}>
                            <s.icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                            <div className={`font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                                {s.title}
                            </div>

                            <div className="relative mt-1">
                                {hasOptions ? (
                                    <div className="relative group/dropdown">
                                        <div className={`text-xs font-mono cursor-pointer flex items-center gap-2 ${isActive ? 'text-lime-400' : 'text-zinc-500'}`}>
                                            {currentDesc}
                                            <span className="opacity-50 text-[10px]">▼</span>
                                        </div>

                                        {/* Dropdown */}
                                        <div className="absolute top-full left-0 w-48 bg-black border border-lime-400/30 shadow-xl rounded-none hidden group-hover/dropdown:block z-50">
                                            {(s.desc as string[]).map((option) => (
                                                <div
                                                    key={option}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSelect(i, option)
                                                    }}
                                                    className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 cursor-pointer transition-colors"
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs font-mono text-zinc-500">
                                        {s.desc as string}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isCurrent && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute right-0 top-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Check className="w-5 h-5 text-lime-400" />
                            </motion.div>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}
