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
    name?: string
    tag?: string
    createdAt?: string
    expiredAt?: string
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

            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {instances.map((instance) => (
                        <Link href={`/dashboard/instance/${instance.id}`} key={instance.id} className="block group h-full">
                            <Card className="relative h-full transition-all hover:border-lime-400/50 hover:bg-zinc-900/60 p-6 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5 text-lime-400 w-12 h-12 shrink-0">
                                            <Server className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-200 group-hover:text-lime-400 transition-colors text-lg">{instance.domain}</h3>
                                            <p className="text-sm text-zinc-500">{instance.name || "Unnamed Instance"}</p>
                                        </div>
                                    </div>

                                    <div className="relative" onClick={(e) => e.preventDefault()}>
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === instance.id ? null : instance.id)}
                                            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                        >
                                            <MoreVertical className="w-5 h-5" />
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
                                </div>

                                <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500">Status</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${instance.status === 'active' ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-zinc-600'}`} />
                                            <span className="font-mono text-zinc-300 uppercase text-xs">{instance.status}</span>
                                        </div>
                                    </div>
                                    {instance.tag && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-500">Tag</span>
                                            <span className="text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded text-xs border border-white/5">{instance.tag}</span>
                                        </div>
                                    )}
                                    {instance.expiredAt && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-500">Expires</span>
                                            <span className="text-zinc-300 font-mono text-xs">{new Date(instance.expiredAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-white/5 bg-zinc-900/40">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900/60 text-zinc-400 font-medium uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Domain</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Tag</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4">Expires At</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {instances.map((instance) => (
                                <tr key={instance.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/5 text-lime-400 shrink-0">
                                                <Server className="w-4 h-4" />
                                            </div>
                                            <Link href={`/dashboard/instance/${instance.id}`} className="font-bold text-zinc-200 group-hover:text-lime-400 transition-colors">
                                                {instance.domain}
                                            </Link>
                                            <a href={`http://${instance.domain}`} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-lime-400 transition-colors" title="Open in new tab">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{instance.name || "-"}</td>
                                    <td className="px-6 py-4">
                                        {instance.tag ? (
                                            <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs border border-white/5">{instance.tag}</span>
                                        ) : (
                                            <span className="text-zinc-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                                        {instance.createdAt ? new Date(instance.createdAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                                        {instance.expiredAt ? new Date(instance.expiredAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${instance.status === 'active' ? 'bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.5)]' : 'bg-zinc-600'}`} />
                                            <span className="text-xs font-mono uppercase text-zinc-300">{instance.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setActiveDropdown(activeDropdown === instance.id ? null : instance.id)
                                            }}
                                            className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 inline-flex"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>

                                        <AnimatePresence>
                                            {activeDropdown === instance.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                                        className="absolute right-12 top-1/2 -translate-y-1/2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden text-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="p-1">
                                                            <Link href={`/dashboard/instance/${instance.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white rounded-md">
                                                                <ExternalLink className="w-4 h-4" />
                                                                View Details
                                                            </Link>
                                                            <Link href={`/dashboard/instance/${instance.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white rounded-md">
                                                                Edit
                                                            </Link>
                                                            <div className="h-px bg-white/5 my-1" />
                                                            <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-900 cursor-not-allowed rounded-md">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
