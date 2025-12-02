import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import InstanceDetail from "./InstanceDetail"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

async function getInstance(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id_token) return null

    const backendUrl = process.env.BACKEND_URL || "http://paas-backend:8080"

    try {
        const res = await fetch(`${backendUrl}/api/instance/${id}`, {
            headers: {
                Authorization: `Bearer ${session.user.id_token}`
            }
        })

        if (!res.ok) return null

        return res.json()
    } catch (error) {
        console.error("Failed to fetch instance:", error)
        return null
    }
}

export default async function InstanceDetailPage({ params }: { params: { id: string } }) {
    const instance = await getInstance(params.id)

    if (!instance) {
        notFound()
    }

    return <InstanceDetail instance={instance} />
}
