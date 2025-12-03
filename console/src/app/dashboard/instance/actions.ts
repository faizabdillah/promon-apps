"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface State {
    error?: string
    success?: string
}

const BACKEND_URL = process.env.BACKEND_URL || "http://paas-backend:8080"

async function getAuthHeader() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id_token) {
        throw new Error("Unauthorized")
    }
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.id_token}`
    }
}

export async function createInstance(prevState: State, formData: FormData): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const domain = formData.get("domain") as string
        const username = formData.get("username") as string
        const password = formData.get("password") as string
        const planType = formData.get("planType") as string

        if (!domain || !username || !password || !planType) {
            return { error: "All fields are required" }
        }

        const res = await fetch(`${BACKEND_URL}/api/instance`, {
            method: "POST",
            headers,
            body: JSON.stringify({ domain, username, password, planType })
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to create instance" }
        }

        revalidatePath("/dashboard/instance")
    } catch (error: any) {
        console.error("Create instance error:", error)
        return { error: error.message || "Internal server error" }
    }

    redirect("/dashboard/instance")
}

export async function updateInstance(prevState: State, formData: FormData): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const id = formData.get("id") as string
        const newPassword = formData.get("newPassword") as string | null
        const newDomain = formData.get("newDomain") as string | null
        const newUsername = formData.get("newUsername") as string | null
        const name = formData.get("name") as string | null
        const tag = formData.get("tag") as string | null

        if (!id) return { error: "Instance ID is required" }

        const payload: any = {}
        if (newPassword) payload.newPassword = newPassword
        if (newDomain) payload.newDomain = newDomain
        if (newUsername) payload.newUsername = newUsername
        if (name !== null) payload.name = name
        if (tag !== null) payload.tag = tag

        if (Object.keys(payload).length === 0) return { error: "No changes provided" }

        const res = await fetch(`${BACKEND_URL}/api/instance/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to update instance" }
        }

        revalidatePath("/dashboard/instance")
        revalidatePath(`/dashboard/instance/${id}`)

        return { success: "Instance updated successfully" }
    } catch (error: any) {
        console.error("Update instance error:", error)
        return { error: error.message || "Internal server error" }
    }
}

export async function extendInstance(id: string): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}/extend`, {
            method: "POST",
            headers
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to extend instance" }
        }

        revalidatePath(`/dashboard/instance/${id}`)
        return { success: "Instance extended successfully" }
    } catch (error: any) {
        return { error: error.message || "Internal server error" }
    }
}

export async function deleteInstance(id: string): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}`, {
            method: "DELETE",
            headers
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to delete instance" }
        }

        revalidatePath("/dashboard/instance")
    } catch (error: any) {
        return { error: error.message || "Internal server error" }
    }
    redirect("/dashboard/instance")
}

export async function blockIp(id: string, ip: string, reason: string): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}/block-ip`, {
            method: "POST",
            headers,
            body: JSON.stringify({ ip, reason })
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to block IP" }
        }

        revalidatePath(`/dashboard/instance/${id}`)
        return { success: "IP blocked successfully" }
    } catch (error: any) {
        return { error: error.message || "Internal server error" }
    }
}

export async function unblockIp(id: string, ip: string): Promise<State> {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}/blocked-ips/${ip}`, {
            method: "DELETE",
            headers
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to unblock IP" }
        }

        revalidatePath(`/dashboard/instance/${id}`)
        return { success: "IP unblocked successfully" }
    } catch (error: any) {
        return { error: error.message || "Internal server error" }
    }
}

export async function getAccessLogs(id: string) {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}/access-logs`, {
            headers
        })

        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        return []
    }
}

export async function getBlockedIps(id: string) {
    try {
        const headers = await getAuthHeader()
        const res = await fetch(`${BACKEND_URL}/api/instance/${id}/blocked-ips`, {
            headers
        })

        if (!res.ok) return []
        return await res.json()
    } catch (error) {
        return []
    }
}
