"use client"

import { useState } from "react"
import { Button, Input } from "@/components/ui"
import MatrixRain from "@/components/MatrixRain"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"

export default function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const res = await login(username, password)
        if ('token' in res) {
            router.push('/dashboard')
        } else {
            setError(res.error)
        }
    }

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
                            System Status
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
                            Promon <br />
                            <span className="text-lime-400">Monitoring</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Right Side - Login */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-12">
                            <h1 className="text-5xl font-black tracking-tighter mb-4 uppercase text-white">
                                Login to <br />
                                <span className="text-lime-400">Instance</span>
                            </h1>
                            <p className="text-zinc-500 font-medium text-lg">
                                Access your device monitoring dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Username</label>
                                <Input
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-lime-400 text-white h-12"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</label>
                                <Input
                                    type="password"
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-lime-400 text-white h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm font-bold uppercase tracking-wider">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-16 text-lg font-black uppercase tracking-widest !bg-white !text-black hover:!bg-lime-400 hover:!text-black border-4 border-transparent hover:border-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-none group"
                            >
                                Login
                            </Button>

                            <div className="text-center">
                                <p className="text-xs text-zinc-600 font-mono mt-8">
                                    SECURE ACCESS // AUTHORIZED PERSONNEL ONLY
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
