"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Terminal, CheckCircle2, HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import MatrixRain from "./MatrixRain"

export default function LandingPage() {
    const [isIndonesian, setIsIndonesian] = useState(false)

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.country_code === 'ID') {
                    setIsIndonesian(true)
                }
            })
            .catch(err => console.error('Failed to fetch location', err))
    }, [])

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-lime-400 selection:text-black overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="text-2xl font-black tracking-tighter italic">MIKROTIK<span className="text-lime-400">.BOX</span></div>
                <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
                    <Link href="#how-it-works" className="hover:text-lime-400 transition-colors">How it works</Link>
                    <Link href="#manifesto" className="hover:text-lime-400 transition-colors">Manifesto</Link>
                    <Link href="#pricing" className="hover:text-lime-400 transition-colors">Pricing</Link>
                </div>
                <Link href="http://localhost:3000/api/auth/signin">
                    <Button className="rounded-none bg-white text-black hover:bg-lime-400 hover:text-black font-black uppercase tracking-wider border-2 border-transparent hover:border-black transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                        Console Login
                    </Button>
                </Link>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-80">
                        <MatrixRain />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10" />

                    <div className="relative z-20 container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                        >
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-lime-400/30 bg-lime-400/5 text-lime-400 text-xs font-black tracking-[0.2em] uppercase backdrop-blur-sm">
                                <span className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                                Est. 2025 // We Vibe With Network Engineers
                            </div>

                            <h1 className="text-7xl md:text-[9rem] leading-[0.85] font-black tracking-tighter mb-8 uppercase mix-blend-difference text-white">
                                MIKROTIK<span className="text-lime-400">.BOX</span>
                            </h1>

                            <p className="text-xl md:text-3xl font-bold text-zinc-400 max-w-3xl mx-auto mb-12 uppercase tracking-tight leading-tight">
                                Deploy software for Mikrotik management with ease. <br />
                                <span className="text-white bg-lime-400/10 px-2">Production Ready in seconds.</span>
                            </p>

                            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                                <Link href="http://localhost:3000/api/auth/signin">
                                    <Button className="h-16 px-12 text-xl font-black uppercase tracking-widest bg-lime-400 text-black hover:bg-lime-300 rounded-none border-2 border-lime-400 hover:scale-105 transition-transform shadow-[0_0_30px_-5px_rgba(163,230,53,0.4)]">
                                        Try It Now
                                    </Button>
                                </Link>
                                <Button variant="outline" className="h-16 px-12 text-xl font-black uppercase tracking-widest border-2 border-zinc-700 text-zinc-300 hover:bg-white hover:text-black hover:border-white rounded-none hover:scale-105 transition-transform bg-black/50 backdrop-blur-sm">
                                    Watch Demo
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 text-center animate-bounce">
                        <p className="text-xs font-bold tracking-[0.3em] text-zinc-600 uppercase">Scroll Down • Don't Be Shy</p>
                    </div>
                </section>

                {/* Marquee Strip */}
                <div className="py-6 bg-lime-400 text-black overflow-hidden border-y-4 border-black rotate-1 scale-105 z-30 relative">
                    <MarqueeText />
                </div>

                {/* How It Works */}
                <section id="how-it-works" className="py-32 border-b border-white/10 bg-[#080808]">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-24">
                            <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-zinc-800 leading-none">1-2-3</h2>
                            <div className="mb-4">
                                <div className="text-lime-400 font-bold tracking-widest uppercase mb-2">The Process</div>
                                <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">How It Works</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Step number="01" title="Select" desc="Select apps from template." />
                            <Step number="02" title="Customize" desc="Tweak settings. Set your domain. No coding required." />
                            <Step number="03" title="Deploy" desc="Deploy instantly. Access from the domain" />
                        </div>
                    </div>
                </section>

                {/* Manifesto */}
                <section id="manifesto" className="py-32 border-b border-white/10 bg-zinc-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                        <Terminal className="w-96 h-96" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="inline-block border border-lime-400 text-lime-400 px-4 py-1 font-black tracking-widest uppercase mb-16 transform -rotate-2">
                            The Manifesto
                        </div>

                        <div className="grid gap-12 max-w-4xl">
                            <ManifestoItem
                                title="FREE DOMAIN"
                                desc="Stop paying for domains you don't need. We got you covered out of the box."
                            />
                            <ManifestoItem
                                title="FAST AS HELL"
                                desc="Optimized for speed. No bloat. Just raw performance for your network tools."
                            />
                            <ManifestoItem
                                title="EASY DEPLOY"
                                desc="Complexity is the enemy. We killed it. One click is all it takes."
                            />
                            <ManifestoItem
                                title="BULLETPROOF"
                                desc="Secure by default. Sleep easy knowing your infrastructure is solid."
                            />
                        </div>
                    </div>
                </section>

                {/* Gallery / Use Cases */}
                <section className="py-32 border-b border-white/10">
                    <div className="container mx-auto px-6">
                        <div className="mb-16">
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Who is this for?</h2>
                            <p className="text-zinc-500 font-mono mt-4">// WE VIBE WITH THESE LEGENDS</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <GalleryCard label="ISP OWNER" desc="Manage thousands of routers without breaking a sweat. Scale infinitely." />
                            <GalleryCard label="FREELANCER" desc="Deliver projects 10x faster. Impress clients with instant deployments." />
                            <GalleryCard label="HOME LAB" desc="The perfect playground for your network experiments. Break things safely." />
                        </div>
                    </div>
                </section>

                {/* Pricing Zone */}
                <section id="pricing" className="py-32 border-b border-white/10 bg-lime-400 text-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="inline-block border-4 border-black px-6 py-2 font-black tracking-widest uppercase mb-12 bg-white transform rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            Pricing_Zone
                        </div>

                        {isIndonesian ? (
                            <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-4 leading-none">
                                Rp 5000<span className="text-4xl md:text-6xl align-top opacity-60 font-bold">/APP</span>
                            </h2>
                        ) : (
                            <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-4 leading-none">
                                $0.5<span className="text-4xl md:text-6xl align-top opacity-60 font-bold">/APP</span>
                            </h2>
                        )}

                        <div className="max-w-xl mx-auto border-t-4 border-black pt-8">
                            <p className="text-xl font-bold uppercase mb-2">One-time payment options.</p>
                            <p className="text-lg font-medium opacity-70">Lifetime access. No hidden fees. No nonsense.</p>
                        </div>

                        <div className="mt-12">
                            <Button variant="outline" className="h-16 px-12 text-xl font-black uppercase tracking-widest border-2 border-zinc-700 text-zinc-300 hover:bg-white hover:text-black hover:border-white rounded-none hover:scale-105 transition-transform bg-black/50 backdrop-blur-sm">
                                Join the Club
                            </Button>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-32 border-b border-white/10 bg-[#080808]">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <h2 className="text-5xl font-black uppercase tracking-tighter mb-16 text-center">FAQ</h2>
                        <div className="space-y-6">
                            <FAQItem q="Is this for me?" a="If you touch Mikrotik, yes. It's built to save you time." />
                            <FAQItem q="Do I need experience?" a="Zero. If you can click a button, you can deploy." />
                            <FAQItem q="Refunds?" a="Sure, if it sucks. But it won't." />
                            <FAQItem q="Support?" a="Community driven + direct line to the devs via Telegram." />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 bg-black text-center border-t border-white/10">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center gap-2 mb-8 text-zinc-500 font-mono text-sm">
                        <span>Built with ❤️ by</span>
                        <Link href="https://twitter.com/mikrotikbox" className="text-lime-400 font-bold hover:underline">@mikrotikbox</Link>
                    </div>

                    <h2 className="text-[12vw] leading-none font-black text-zinc-900 select-none tracking-tighter hover:text-zinc-800 transition-colors cursor-default">
                        MIKROTIK.BOX
                    </h2>

                    <div className="mt-12 flex justify-center gap-6">
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">Terms</Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">Privacy</Link>
                        <Link href="#" className="text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">Twitter</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function MarqueeText() {
    return (
        <div className="relative flex overflow-x-hidden">
            <motion.div
                className="py-2 whitespace-nowrap flex gap-8 items-center"
                animate={{ x: "-30%" }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
                {Array(10).fill("NO RULES JUST DEPLOY • IGNORE THE NOISE • BUILT FOR NETWORK ENGINEERS • PRODUCTION READY IN SECONDS • ").map((text, i) => (
                    <span key={i} className="text-2xl md:text-4xl font-black tracking-tight uppercase">{text}</span>
                ))}
            </motion.div>
        </div>
    )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="group p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent">{number}</span>
            </div>
            <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase mb-4 text-lime-400">{title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}

function ManifestoItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-6 group">
            <div className="w-12 h-12 flex-shrink-0 bg-lime-400 text-black flex items-center justify-center rounded-none font-bold">
                <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-3xl md:text-4xl font-black uppercase mb-2 text-white group-hover:text-lime-400 transition-colors">{title}</h3>
                <p className="text-xl text-zinc-400 font-medium">{desc}</p>
            </div>
        </div>
    )
}

function GalleryCard({ label, desc }: { label: string, desc: string }) {
    return (
        <div className="p-8 border border-white/10 bg-black hover:border-lime-400 transition-colors group h-full flex flex-col justify-between">
            <div>
                <div className="inline-block px-3 py-1 bg-white/10 text-xs font-bold tracking-widest uppercase mb-6 text-zinc-400 group-hover:bg-lime-400 group-hover:text-black transition-colors">
                    {label}
                </div>
                <p className="text-xl font-bold text-white leading-tight">{desc}</p>
            </div>
            <div className="mt-8 flex justify-end">
                <ArrowRight className="w-6 h-6 text-zinc-600 group-hover:text-lime-400 transition-colors" />
            </div>
        </div>
    )
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="border-b border-white/10 pb-8">
            <h3 className="text-xl font-black uppercase mb-2 text-white flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-lime-400" />
                {q}
            </h3>
            <p className="text-zinc-400 pl-8 text-lg">{a}</p>
        </div>
    )
}
