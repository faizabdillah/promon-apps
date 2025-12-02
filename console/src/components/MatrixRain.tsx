"use client"

import { useRef, useEffect } from "react"

export default function MatrixRain() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let drops: number[] = []
        const fontSize = 11
        const columns = Math.floor(container.clientWidth / fontSize)

        drops = new Array(columns).fill(1)

        const resize = () => {
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight
            const newColumns = Math.floor(canvas.width / fontSize)
            if (newColumns !== drops.length) {
                drops = new Array(newColumns).fill(1)
            }
        }

        window.addEventListener('resize', resize)
        resize()

        const chars = "0123456789ABCDEFMIKROTIK"

        const draw = () => {
            ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.fillStyle = '#a3e635' // Lime-400
            ctx.font = `${fontSize}px monospace`

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)]
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#050505]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-20" />
        </div>
    )
}
