"use client"

import { useEffect, useState } from "react"
import { Button, Card } from "@/components/ui"
import { getToken, logout } from "@/lib/auth"
import { getDevicesAction, deleteDeviceAction } from "../actions"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Monitor, LogOut } from "lucide-react"

interface Device {
    id: string
    name: string
    ip: string
    status: string
}

export default function Dashboard() {
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = getToken()
        if (!token) {
            router.push('/login')
            return
        }
        fetchDevices(token)
    }, [router])

    const fetchDevices = async (token: string) => {
        try {
            // Explicit auth check is already done in useEffect via getToken()
            // But we also handle the response from the server action
            const data = await getDevicesAction(token)

            if (data.error) {
                if (data.error === 'Unauthorized') {
                    logout()
                } else {
                    console.error(data.error)
                }
            } else {
                setDevices(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const token = getToken()
        if (!token) {
            router.push('/login')
            return
        }

        if (!confirm('Are you sure?')) return

        try {
            const res = await deleteDeviceAction(id, token)
            if (res.success) {
                fetchDevices(token)
            } else {
                console.error(res.error)
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans">
            <nav className="border-b border-white/10 bg-zinc-900/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-lime-400 flex items-center justify-center font-black text-black">P</div>
                        <span className="font-bold tracking-wider uppercase">Promon</span>
                    </div>
                    <Button variant="ghost" onClick={logout} className="text-zinc-400 hover:text-white gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Devices</h1>
                        <p className="text-zinc-500">Manage your monitored devices.</p>
                    </div>
                    <Button className="bg-lime-400 text-black hover:bg-lime-500 font-bold uppercase tracking-wider rounded-none gap-2">
                        <Plus className="w-4 h-4" />
                        Add Device
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map(device => (
                        <Card key={device.id} className="bg-zinc-900/50 border-zinc-800 p-6 rounded-none group hover:border-lime-400/50 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-zinc-800 group-hover:bg-lime-400/10 group-hover:text-lime-400 transition-colors rounded-none">
                                    <Monitor className="w-6 h-6" />
                                </div>
                                <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${device.status === 'online' ? 'border-lime-400 text-lime-400' : 'border-zinc-700 text-zinc-500'}`}>
                                    {device.status}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{device.name}</h3>
                            <p className="text-zinc-500 font-mono text-sm mb-6">{device.ip}</p>

                            <div className="flex justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleDelete(device.id)}
                                    className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-none"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
