import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LayoutDashboard, LogOut, User, Server, Plus, CreditCard, History } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/api/auth/signin")
    }

    return (
        <div className="h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-lime-400 selection:text-black overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-zinc-900/20 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <Link href="/dashboard" className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                        <span className="w-3 h-3 bg-lime-400 rounded-full animate-pulse" />
                        Console
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    <div className="space-y-2">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h3 className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Instance</h3>
                        <div className="space-y-1">
                            <Link href="/dashboard/instance" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                                <Server className="w-4 h-4" />
                                My Instances
                            </Link>
                            <Link href="/dashboard/instance/create" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                                <Plus className="w-4 h-4" />
                                Create Instance
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Top Up</h3>
                        <div className="space-y-1">
                            <Link href="/dashboard/topup/create" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                                <CreditCard className="w-4 h-4" />
                                Create
                            </Link>
                            <Link href="/dashboard/topup/history" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                                <History className="w-4 h-4" />
                                History
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Account</h3>
                        <div className="space-y-1">
                            <Link href="/dashboard/account" className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors rounded-md text-sm font-medium">
                                <User className="w-4 h-4" />
                                Account
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10 bg-black/20 shrink-0">
                    <div className="flex items-center gap-3 px-4 py-3">
                        {session.user.image ? (
                            <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                                <User className="w-4 h-4 text-zinc-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-zinc-200">{session.user.name}</p>
                            <p className="text-xs text-zinc-500 truncate font-mono">{session.user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
