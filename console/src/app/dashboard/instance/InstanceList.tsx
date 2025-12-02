"use client"

import { useState } from "react"
import { Button, Card } from "@/components/ui"
import { LayoutGrid, List, Server, MoreVertical, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Instance {
    id: string
    domain: string
    status: string
}

export default function InstanceList({ instances }: { instances: Instance[] }) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

    if (instances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                    <Server className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-200">No Instances Found</h3>
                    <p className="text-zinc-500 max-w-sm">You haven't created any instances yet. Deploy your first Mikrotik instance to get started.</p>
                </div>
                <Link href="/dashboard/instance/create">
                    <Button className="bg-lime-400 text-black hover:bg-lime-500 font-bold">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Instance
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-zinc-800 text-lime-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-zinc-800 text-lime-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
                <Link href="/dashboard/instance/create">
                    <Button className="bg-lime-400 text-black hover:bg-lime-500 font-bold text-xs uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" />
                        New Instance
                    </Button>
                </Link>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {instances.map((instance) => (
                    <Link href={`/dashboard/instance/${instance.id}`} key={instance.id} className="block group">
                        <Card className={`relative overflow-hidden transition-all hover:border-lime-400/50 hover:bg-zinc-900/60 ${viewMode === "list" ? "flex items-center justify-between p-4" : "p-6"}`}>
                            <div className={`flex items-start gap-4 ${viewMode === "list" ? "items-center" : ""}`}>
                                <div className={`rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5 text-lime-400 ${viewMode === "list" ? "w-10 h-10" : "w-12 h-12"}`}>
                                    <Server className={viewMode === "list" ? "w-5 h-5" : "w-6 h-6"} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-200 group-hover:text-lime-400 transition-colors">{instance.domain}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${instance.status === 'active' ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-zinc-600'}`} />
                                        <span className="text-xs font-mono text-zinc-500 uppercase">{instance.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative" onClick={(e) => e.preventDefault()}>
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === instance.id ? null : instance.id)}
                                    className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === instance.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
                                            >
                                                <div className="p-1">
                                                    <Link href={`/dashboard/instance/${instance.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white rounded-md">
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Details
                                                    </Link>
                                                    <Link href={`/dashboard/instance/${instance.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white rounded-md">
                                                        Edit
                                                    </Link>
                                                    <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 cursor-not-allowed rounded-md">
                                                        Renew
                                                    </button>
                                                    <div className="h-px bg-white/5 my-1" />
                                                    <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-900 cursor-not-allowed rounded-md">
                                                        Delete
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
