import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import InstanceList from "./InstanceList"

export const dynamic = 'force-dynamic'

async function getInstances() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id_token) return []

    const backendUrl = process.env.BACKEND_URL || "http://paas-backend:8080"

    try {
        const res = await fetch(`${backendUrl}/api/instance`, {
            headers: {
                Authorization: `Bearer ${session.user.id_token}`
            }
        })

        if (!res.ok) return []

        return res.json()
    } catch (error) {
        console.error("Failed to fetch instances:", error)
        return []
    }
}

export default async function InstancesPage() {
    const instances = await getInstances()

    return (
        <>
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-white">My Instances</h1>
                    <span className="text-zinc-700">/</span>
                    <p className="text-zinc-400 font-mono text-xs">
                        Manage and monitor your deployed Mikrotik instances.
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <InstanceList instances={instances} />
            </div>
        </>
    )
}
