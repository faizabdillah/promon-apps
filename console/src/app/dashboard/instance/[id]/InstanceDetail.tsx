"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { updateInstance, State } from "../actions"
import { Button, Card, Input } from "@/components/ui"
import { Server, Lock, Globe, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"

const initialState: State = {
    error: undefined,
    success: undefined
}

function SubmitButton({ label, loadingLabel, variant = "default" }: { label: string, loadingLabel: string, variant?: "default" | "destructive" }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
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
}

export default function InstanceDetail({ instance }: { instance: Instance }) {
    const [passwordState, passwordAction] = useFormState<State, FormData>(updateInstance, initialState)
    const [domainState, domainAction] = useFormState<State, FormData>(updateInstance, initialState)
    const [newDomain, setNewDomain] = useState("")

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
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Instance Info Card */}
                    <Card className="p-6 bg-zinc-900/40 border-white/5 flex items-center gap-6">
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
                    </Card>

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
                </div>
            </div>
        </>
    )
}
