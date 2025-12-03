"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createInstance, State } from "../actions"
import { Button, Card, Input } from "@/components/ui"
import { Server, Lock, Globe, CheckCircle2, User, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const initialState: State = {
    error: undefined,
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-lime-400 text-black hover:bg-lime-500 font-bold h-12"
        >
            {pending ? "Creating Instance..." : "Deploy Instance"}
        </Button>
    )
}

export default function CreateInstancePage() {
    const [state, formAction] = useFormState(createInstance, initialState)
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [selectedDomainSuffix, setSelectedDomainSuffix] = useState("testnet.id")
    const [subdomain, setSubdomain] = useState("")
    const [customDomain, setCustomDomain] = useState("")
    const [domainError, setDomainError] = useState<string | undefined>()

    const DOMAIN_OPTIONS = [
        { label: "testnet.id", value: "testnet.id" },
        { label: "syncaster.xyz", value: "syncaster.xyz" },
        { label: "mainnet.box", value: "mainnet.box" },
        { label: "testnet.box", value: "testnet.box" },
        { label: "Custom Domain", value: "custom" },
    ]

    // Auto-generate password on mount
    useEffect(() => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        let pass = ""
        for (let i = 0; i < 16; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setPassword(pass)
    }, [])

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSubdomain(val)

        // Subdomain validation: lowercase alphanumeric and hyphens, not starting or ending with a hyphen
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        if (val && !regex.test(val)) {
            setDomainError("Subdomain can only contain lowercase letters, numbers, and hyphens.")
        } else {
            setDomainError(undefined)
        }
    }

    const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setCustomDomain(val)

        // Custom domain validation (FQDN)
        // Simple regex for client-side feedback
        const regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/
        if (val && !regex.test(val)) {
            setDomainError("Please enter a valid domain name (e.g. example.com).")
        } else {
            setDomainError(undefined)
        }
    }

    const finalDomain = selectedDomainSuffix === 'custom'
        ? customDomain
        : (subdomain ? `${subdomain}.${selectedDomainSuffix}` : '')

    return (
        <>
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-white">Create Instance</h1>
                    <span className="text-zinc-700">/</span>
                    <p className="text-zinc-400 font-mono text-xs">
                        Deploy a new Mikrotik instance in seconds.
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="p-8 bg-zinc-900/40 border-white/5">
                        <form action={formAction} className="space-y-8" autoComplete="off">
                            {/* Hidden input to send the final domain to the server action */}
                            <input type="hidden" name="domain" value={finalDomain} />

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Domain Name
                                </label>

                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Domain Suffix Selector */}
                                    <div className="md:w-1/3">
                                        <select
                                            value={selectedDomainSuffix}
                                            onChange={(e) => {
                                                setSelectedDomainSuffix(e.target.value)
                                                setDomainError(undefined)
                                                // Clear inputs when switching modes might be good, but keeping them is also fine.
                                            }}
                                            className="w-full bg-black/20 border border-white/10 h-12 px-3 rounded-md text-lg font-mono text-zinc-300 focus:border-lime-400/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                                        >
                                            {DOMAIN_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-300">
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Input Field */}
                                    <div className="flex-1 relative">
                                        {selectedDomainSuffix === 'custom' ? (
                                            <Input
                                                value={customDomain}
                                                onChange={handleCustomDomainChange}
                                                placeholder="my-instance.com"
                                                required
                                                autoComplete="off"
                                                className={`bg-black/20 border-white/10 h-12 text-lg font-mono placeholder:text-zinc-700 focus:border-lime-400/50 transition-colors ${domainError ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                            />
                                        ) : (
                                            <div className="relative flex items-center">
                                                <Input
                                                    value={subdomain}
                                                    onChange={handleSubdomainChange}
                                                    placeholder="my-instance"
                                                    required
                                                    autoComplete="off"
                                                    className={`bg-black/20 border-white/10 h-12 text-lg font-mono placeholder:text-zinc-700 focus:border-lime-400/50 transition-colors ${domainError ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                />
                                                <div className="absolute right-4 text-zinc-500 font-mono pointer-events-none">
                                                    .{selectedDomainSuffix}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {domainError && (
                                    <p className="text-xs text-red-400 font-bold">{domainError}</p>
                                )}

                                <p className="text-xs text-zinc-600">
                                    Final address: <span className="text-lime-400/80 font-mono">{finalDomain || '...'}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Username
                                </label>
                                <Input
                                    name="username"
                                    placeholder="admin"
                                    required
                                    autoComplete="new-password"
                                    className="bg-black/20 border-white/10 h-12 text-lg font-mono placeholder:text-zinc-700 focus:border-lime-400/50 transition-colors"
                                />
                                <p className="text-xs text-zinc-600">Username for the instance administrator.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Instance Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                        className="bg-black/20 border-white/10 h-12 text-lg font-mono placeholder:text-zinc-700 focus:border-lime-400/50 transition-colors pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-600">Password to login to the instance.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                    <Server className="w-4 h-4" />
                                    Select Plan
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="planType" value="small" className="peer sr-only" required />
                                        <div className="p-4 rounded-lg border border-white/10 bg-black/20 hover:bg-white/5 peer-checked:border-lime-400 peer-checked:bg-lime-400/10 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-zinc-300 peer-checked:text-lime-400">Small</span>
                                                <CheckCircle2 className="w-4 h-4 text-lime-400 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-2xl font-black text-white mb-1">10k</div>
                                            <div className="text-xs text-zinc-500">IDR / month</div>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input type="radio" name="planType" value="medium" className="peer sr-only" required defaultChecked />
                                        <div className="p-4 rounded-lg border border-white/10 bg-black/20 hover:bg-white/5 peer-checked:border-lime-400 peer-checked:bg-lime-400/10 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-zinc-300 peer-checked:text-lime-400">Medium</span>
                                                <CheckCircle2 className="w-4 h-4 text-lime-400 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-2xl font-black text-white mb-1">50k</div>
                                            <div className="text-xs text-zinc-500">IDR / month</div>
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input type="radio" name="planType" value="large" className="peer sr-only" required />
                                        <div className="p-4 rounded-lg border border-white/10 bg-black/20 hover:bg-white/5 peer-checked:border-lime-400 peer-checked:bg-lime-400/10 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-zinc-300 peer-checked:text-lime-400">Large</span>
                                                <CheckCircle2 className="w-4 h-4 text-lime-400 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="text-2xl font-black text-white mb-1">100k</div>
                                            <div className="text-xs text-zinc-500">IDR / month</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {state?.error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                                    {state.error}
                                </div>
                            )}

                            <div className="pt-4 flex items-center gap-4">
                                <Link href="/dashboard/instance" className="flex-1">
                                    <Button type="button" variant="ghost" className="w-full text-zinc-400 hover:text-white">
                                        Cancel
                                    </Button>
                                </Link>
                                <div className="flex-1">
                                    <SubmitButton />
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}
