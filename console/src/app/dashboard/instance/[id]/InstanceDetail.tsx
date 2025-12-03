"use client"

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateInstance, extendInstance, deleteInstance, blockIp, unblockIp, getAccessLogs, getBlockedIps, State } from "../actions"
import { Button, Card, Input, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui"
import { Server, Lock, Globe, AlertTriangle, ArrowRight, CheckCircle2, Clock, Tag, Shield, Activity, Ban, Trash2, RefreshCw, MapPin } from "lucide-react"

const initialState: State = {
    error: undefined,
    success: undefined
}

function SubmitButton({ label, loadingLabel, variant = "default", disabled = false }: { label: string, loadingLabel: string, variant?: "default" | "destructive", disabled?: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending || disabled}
            className={`w-full font-bold ${variant === "destructive" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-lime-400 text-black hover:bg-lime-500"}`}
        >
            {pending ? loadingLabel : label}
        </Button>
    )
}

interface Instance {
    id: string
    domain: string
    status: string
    name?: string
    tag?: string
    createdAt?: string
    expiredAt?: string
}

interface AccessLog {
    ip: string
    method: string
    path: string
    userAgent: string
    timestamp: string
    location?: string // Client-side fetched
}

interface BlockedIp {
    ip: string
    reason: string
    createdAt: string
}

export default function InstanceDetail({ instance }: { instance: Instance }) {
    const [passwordState, passwordAction] = useFormState<State, FormData>(updateInstance, initialState)
    const [domainState, domainAction] = useFormState<State, FormData>(updateInstance, initialState)
    const [updateState, updateAction] = useFormState<State, FormData>(updateInstance, initialState)

    const [activeTab, setActiveTab] = useState("overview")
    const [logs, setLogs] = useState<AccessLog[]>([])
    const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([])
    const [loadingLogs, setLoadingLogs] = useState(false)
    const [newDomain, setNewDomain] = useState("")

    // Fetch logs and blocked IPs when tab changes
    useEffect(() => {
        if (activeTab === "logs") {
            loadLogs()
            loadBlockedIps()
        }
    }, [activeTab, instance.id])

    const loadLogs = async () => {
        setLoadingLogs(true)
        const data = await getAccessLogs(instance.id)

        // Client-side geolocation
        const logsWithGeo = await Promise.all(data.map(async (log: any) => {
            try {
                // Simple cache or check if we already have it? For now just fetch.
                // Rate limiting might be an issue with free APIs.
                // We'll fetch only for unique IPs and cache in a map if needed.
                // For this demo, let's just fetch for the first few or assume browser cache helps.
                const res = await fetch(`http://ip-api.com/json/${log.ip}`)
                const geo = await res.json()
                return { ...log, location: geo.status === 'success' ? `${geo.city}, ${geo.country}` : 'Unknown' }
            } catch {
                return { ...log, location: 'Unknown' }
            }
        }))

        setLogs(logsWithGeo)
        setLoadingLogs(false)
    }

    const loadBlockedIps = async () => {
        const data = await getBlockedIps(instance.id)
        setBlockedIps(data)
    }

    const handleBlockIp = async (ip: string) => {
        if (!confirm(`Block IP ${ip}?`)) return
        await blockIp(instance.id, ip, "Manual block from console")
        loadBlockedIps()
    }

    const handleUnblockIp = async (ip: string) => {
        if (!confirm(`Unblock IP ${ip}?`)) return
        await unblockIp(instance.id, ip)
        loadBlockedIps()
    }

    const handleExtend = async () => {
        if (!confirm("Extend instance by 30 days?")) return
        await extendInstance(instance.id)
        // Ideally trigger a revalidation or update local state
    }

    const handleDelete = async () => {
        const confirmText = prompt(`Type "${instance.domain}" to confirm deletion:`)
        if (confirmText === instance.domain) {
            await deleteInstance(instance.id)
        }
    }

    return (
        <>
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-white">Manage Instance</h1>
                    <span className="text-zinc-700">/</span>
                    <p className="text-zinc-400 font-mono text-xs">
                        Configure and manage your instance details.
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header Card */}
                    <Card className="p-6 bg-zinc-900/40 border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5 text-lime-400">
                                <Server className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-100">{instance.domain}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${instance.status === 'active' ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-zinc-600'}`} />
                                    <span className="text-xs font-mono text-zinc-500 uppercase">{instance.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleExtend} variant="outline" className="border-lime-500/20 text-lime-400 hover:bg-lime-500/10">
                                <Clock className="w-4 h-4 mr-2" />
                                Extend 30 Days
                            </Button>
                        </div>
                    </Card>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="w-full justify-start bg-transparent border-b border-white/5 rounded-none h-auto p-0 gap-6">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lime-400 data-[state=active]:bg-transparent px-0 py-3">Overview</TabsTrigger>
                            <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lime-400 data-[state=active]:bg-transparent px-0 py-3">Access Logs</TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-lime-400 data-[state=active]:bg-transparent px-0 py-3">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-2">
                                    <div className="text-zinc-500 text-xs font-bold uppercase">Created At</div>
                                    <div className="text-zinc-200 font-mono">{instance.createdAt ? new Date(instance.createdAt).toLocaleDateString() : "-"}</div>
                                </Card>
                                <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-2">
                                    <div className="text-zinc-500 text-xs font-bold uppercase">Expires At</div>
                                    <div className="text-lime-400 font-mono">{instance.expiredAt ? new Date(instance.expiredAt).toLocaleDateString() : "-"}</div>
                                </Card>
                                <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-2">
                                    <div className="text-zinc-500 text-xs font-bold uppercase">Plan</div>
                                    <div className="text-zinc-200">Pro</div>
                                </Card>
                            </div>

                            <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <Tag className="w-5 h-5 text-zinc-400" />
                                    <h3 className="font-bold text-zinc-200 uppercase tracking-wide">Instance Details</h3>
                                </div>
                                <form action={updateAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="hidden" name="id" value={instance.id} />
                                    <div className="space-y-2">
                                        <label className="text-sm text-zinc-400">Instance Name</label>
                                        <Input name="name" defaultValue={instance.name} placeholder="My Instance" className="bg-black/20 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-zinc-400">Tag</label>
                                        <Input name="tag" defaultValue={instance.tag} placeholder="Production" className="bg-black/20 border-white/10" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <SubmitButton label="Save Changes" loadingLabel="Saving..." />
                                    </div>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="logs" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-zinc-200">Recent Access</h3>
                                        <Button onClick={loadLogs} variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border border-white/5 bg-zinc-900/40 overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-zinc-900/60 text-zinc-400 font-medium uppercase text-xs">
                                                <tr>
                                                    <th className="px-4 py-3">Time</th>
                                                    <th className="px-4 py-3">IP Address</th>
                                                    <th className="px-4 py-3">Location</th>
                                                    <th className="px-4 py-3">Path</th>
                                                    <th className="px-4 py-3 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {logs.map((log, i) => (
                                                    <tr key={i} className="hover:bg-white/5">
                                                        <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                                        <td className="px-4 py-3 text-zinc-300 font-mono">{log.ip}</td>
                                                        <td className="px-4 py-3 text-zinc-400 flex items-center gap-2">
                                                            <MapPin className="w-3 h-3" />
                                                            {log.location}
                                                        </td>
                                                        <td className="px-4 py-3 text-zinc-400 font-mono text-xs truncate max-w-[150px]">{log.method} {log.path}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button onClick={() => handleBlockIp(log.ip)} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase">Block</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {logs.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No logs found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-zinc-200">Blocked IPs</h3>
                                    <div className="space-y-2">
                                        {blockedIps.map((blocked) => (
                                            <div key={blocked.ip} className="p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                                                <div>
                                                    <div className="text-red-400 font-mono text-sm">{blocked.ip}</div>
                                                    <div className="text-red-400/60 text-xs">{blocked.reason}</div>
                                                </div>
                                                <button onClick={() => handleUnblockIp(blocked.ip)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {blockedIps.length === 0 && (
                                            <div className="p-4 rounded border border-dashed border-zinc-700 text-center text-zinc-500 text-sm">
                                                No blocked IPs
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Change Domain */}
                                <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                        <Globe className="w-5 h-5 text-zinc-400" />
                                        <h3 className="font-bold text-zinc-200 uppercase tracking-wide">Change Domain</h3>
                                    </div>

                                    <form action={domainAction} className="space-y-6">
                                        <input type="hidden" name="id" value={instance.id} />

                                        <div className="space-y-4">
                                            <label className="text-sm text-zinc-400">New Domain Name</label>
                                            <Input
                                                name="newDomain"
                                                placeholder="new-name.example.com"
                                                required
                                                value={newDomain}
                                                onChange={(e) => setNewDomain(e.target.value)}
                                                className="bg-black/20 border-white/10 font-mono"
                                            />
                                        </div>

                                        {/* Simulation Visual */}
                                        <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-3">
                                            <p className="text-xs font-bold text-zinc-500 uppercase">Migration Simulation</p>
                                            <div className="flex items-center justify-between text-sm font-mono">
                                                <span className="text-red-400 line-through decoration-red-400/50">{instance.domain}</span>
                                                <ArrowRight className="w-4 h-4 text-zinc-600" />
                                                <span className="text-lime-400">{newDomain || "..."}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-amber-500/80">
                                                <AlertTriangle className="w-3 h-3" />
                                                <span>Old domain will be inaccessible immediately.</span>
                                            </div>
                                        </div>

                                        {domainState?.error && (
                                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                {domainState.error}
                                            </div>
                                        )}
                                        {domainState?.success && (
                                            <div className="p-3 rounded bg-lime-500/10 border border-lime-500/20 text-lime-400 text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {domainState.success}
                                            </div>
                                        )}

                                        <SubmitButton label="Update Domain" loadingLabel="Updating..." />
                                    </form>
                                </Card>

                                {/* Reset Password */}
                                <Card className="p-6 bg-zinc-900/40 border-white/5 space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                        <Lock className="w-5 h-5 text-zinc-400" />
                                        <h3 className="font-bold text-zinc-200 uppercase tracking-wide">Reset Password</h3>
                                    </div>

                                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold text-red-400">Warning: Data Loss Risk</h4>
                                            <p className="text-xs text-red-300/80 leading-relaxed">
                                                Changing the password here will <strong>RESET your instance data</strong>.
                                                If you want to keep your data, change the password inside the instance instead.
                                            </p>
                                        </div>
                                    </div>

                                    <form action={passwordAction} className="space-y-6">
                                        <input type="hidden" name="id" value={instance.id} />

                                        <div className="space-y-4">
                                            <label className="text-sm text-zinc-400">New Password</label>
                                            <Input
                                                type="password"
                                                name="newPassword"
                                                placeholder="••••••••"
                                                required
                                                className="bg-black/20 border-white/10 font-mono"
                                            />
                                        </div>

                                        {passwordState?.error && (
                                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                {passwordState.error}
                                            </div>
                                        )}
                                        {passwordState?.success && (
                                            <div className="p-3 rounded bg-lime-500/10 border border-lime-500/20 text-lime-400 text-sm flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {passwordState.success}
                                            </div>
                                        )}

                                        <SubmitButton label="Reset Password & Wipe Data" loadingLabel="Resetting..." variant="destructive" />
                                    </form>
                                </Card>
                            </div>

                            {/* Danger Zone */}
                            <Card className="p-6 bg-red-950/10 border-red-900/20 space-y-6 mt-8">
                                <div className="flex items-center gap-3 pb-4 border-b border-red-900/20">
                                    <Shield className="w-5 h-5 text-red-500" />
                                    <h3 className="font-bold text-red-500 uppercase tracking-wide">Danger Zone</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-zinc-200">Delete Instance</h4>
                                        <p className="text-sm text-zinc-500">Permanently remove this instance and all its data.</p>
                                    </div>
                                    <Button onClick={handleDelete} variant="destructive" className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900">
                                        Delete Instance
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
