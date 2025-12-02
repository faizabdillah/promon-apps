"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui"
import { LogOut, ShieldCheck } from "lucide-react"

export default function DashboardPage() {
    const { data: session } = useSession()

    if (!session) return null

    return (
        <>
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-white">Overview</h1>
                    <span className="text-zinc-700">/</span>
                    <p className="text-zinc-400 font-mono text-xs">
                        System Status: <span className="text-lime-400">OPERATIONAL</span>
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="grid gap-6 max-w-2xl mx-auto mt-12 text-center">
                    <div className="p-12 border border-white/10 bg-white/5 rounded-none relative group overflow-hidden">
                        <div className="absolute inset-0 bg-lime-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-lime-400/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(163,230,53,0.3)]">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <ShieldCheck className="w-10 h-10 text-lime-400" />
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">{session.user?.name}</h2>
                            <p className="text-zinc-500 font-mono text-sm mb-8">{session.user?.email}</p>

                            <Button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white uppercase tracking-widest font-bold text-xs px-8 py-6 rounded-none transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Terminate Session
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
