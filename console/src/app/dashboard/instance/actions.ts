"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface State {
    error?: string
    success?: string
}

export async function createInstance(prevState: State, formData: FormData): Promise<State> {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id_token) {
        return { error: "Unauthorized" }
    }

    const domain = formData.get("domain") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const planType = formData.get("planType") as string

    if (!domain || !username || !password || !planType) {
        return { error: "All fields are required" }
    }

    try {
        const backendUrl = process.env.BACKEND_URL || "http://paas-backend:8080"
        const res = await fetch(`${backendUrl}/api/instance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.id_token}`
            },
            body: JSON.stringify({
                domain,
                username,
                password,
                planType
            })
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to create instance" }
        }

        revalidatePath("/dashboard/instance")
    } catch (error) {
        console.error("Create instance error:", error)
        return { error: "Internal server error" }
    }

    redirect("/dashboard/instance")
}

export async function updateInstance(prevState: State, formData: FormData): Promise<State> {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id_token) {
        return { error: "Unauthorized" }
    }

    const id = formData.get("id") as string
    const newPassword = formData.get("newPassword") as string | null
    const newDomain = formData.get("newDomain") as string | null
    const newUsername = formData.get("newUsername") as string | null

    if (!id) return { error: "Instance ID is required" }
    if (!newPassword && !newDomain && !newUsername) return { error: "No changes provided" }

    try {
        const backendUrl = process.env.BACKEND_URL || "http://paas-backend:8080"

        const payload: any = {}
        if (newPassword) payload.newPassword = newPassword
        if (newDomain) payload.newDomain = newDomain
        if (newUsername) payload.newUsername = newUsername

        const res = await fetch(`${backendUrl}/api/instance/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.id_token}`
            },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            return { error: errorData.error || "Failed to update instance" }
        }

        revalidatePath("/dashboard/instance")
        revalidatePath(`/dashboard/instance/${id}`)

        return { success: "Instance updated successfully" }
    } catch (error) {
        console.error("Update instance error:", error)
        return { error: "Internal server error" }
    }
}
