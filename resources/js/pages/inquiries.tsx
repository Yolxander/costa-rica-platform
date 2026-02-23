import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage, router } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useRef, useEffect, useMemo } from "react"
import {
    IconSend,
    IconMail,
    IconPhone,
    IconCalendar,
    IconUsers,
    IconHome,
    IconDotsVertical,
    IconSearch,
    IconBrandWhatsapp,
    IconCircleCheck,
} from "@tabler/icons-react"

interface Inquiry {
    id: number
    traveler_name: string
    traveler_email: string
    traveler_phone: string | null
    property_id?: number
    property_name: string
    check_in: string
    check_out: string
    guests: number
    message: string
    status: "new" | "contacted" | "booked" | "lost"
    sent_at: string
}

interface Message {
    id: string
    sender: "traveler" | "host"
    text: string
    time: string
}

interface InquiriesPageProps extends SharedData {
    inquiries: Inquiry[]
}

const statusVariant: Record<Inquiry["status"], "default" | "secondary" | "destructive" | "outline"> = {
    new: "outline",
    contacted: "secondary",
    booked: "default",
    lost: "destructive",
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

function getAvatarColor(name: string) {
    const colors = [
        "bg-blue-500",
        "bg-emerald-500",
        "bg-violet-500",
        "bg-amber-500",
        "bg-rose-500",
        "bg-cyan-500",
        "bg-pink-500",
        "bg-indigo-500",
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
}

function buildMockMessages(inquiry: Inquiry): Message[] {
    const messages: Message[] = [
        {
            id: `${inquiry.id}-1`,
            sender: "traveler",
            text: inquiry.message,
            time: "8:00 PM",
        },
    ]

    if (inquiry.status === "contacted") {
        messages.push(
            {
                id: `${inquiry.id}-2`,
                sender: "host",
                text: `Hi ${inquiry.traveler_name.split(" ")[0]}! Thanks for your interest in ${inquiry.property_name}. The property is available for your dates (${inquiry.check_in} to ${inquiry.check_out}). Would you like to proceed with the booking?`,
                time: "8:15 PM",
            },
            {
                id: `${inquiry.id}-3`,
                sender: "traveler",
                text: "That sounds great! Could you tell me a bit more about the amenities and the neighborhood?",
                time: "8:23 PM",
            },
            {
                id: `${inquiry.id}-4`,
                sender: "host",
                text: "Of course! The property has a fully equipped kitchen, high-speed WiFi, a private pool, and air conditioning in every room. The neighborhood is very safe and walkable — there are restaurants and shops within a 5-minute walk.",
                time: "8:30 PM",
            },
            {
                id: `${inquiry.id}-5`,
                sender: "traveler",
                text: "Perfect, that's exactly what we were looking for. Let me discuss with my travel partner and I'll get back to you soon!",
                time: "8:42 PM",
            },
        )
    } else if (inquiry.status === "booked") {
        messages.push(
            {
                id: `${inquiry.id}-2`,
                sender: "host",
                text: `Hi ${inquiry.traveler_name.split(" ")[0]}! Thanks for reaching out. ${inquiry.property_name} is available for ${inquiry.check_in} to ${inquiry.check_out}. I'd love to host you!`,
                time: "8:12 PM",
            },
            {
                id: `${inquiry.id}-3`,
                sender: "traveler",
                text: "Wonderful! We'd love to book it. What's the best way to confirm?",
                time: "8:20 PM",
            },
            {
                id: `${inquiry.id}-4`,
                sender: "host",
                text: "I'll send you a booking confirmation right away. The total for your stay will include the nightly rate plus a one-time cleaning fee. I'll include all the details.",
                time: "8:28 PM",
            },
            {
                id: `${inquiry.id}-5`,
                sender: "traveler",
                text: "Sounds good — just received it. Payment sent!",
                time: "8:45 PM",
            },
            {
                id: `${inquiry.id}-6`,
                sender: "host",
                text: "Payment confirmed! Your booking is all set. I'll send you check-in instructions a few days before your arrival. Looking forward to hosting you! 🎉",
                time: "8:48 PM",
            },
            {
                id: `${inquiry.id}-7`,
                sender: "traveler",
                text: "Thank you so much! We're really excited for the trip.",
                time: "8:53 PM",
            },
        )
    } else if (inquiry.status === "lost") {
        messages.push(
            {
                id: `${inquiry.id}-2`,
                sender: "host",
                text: `Hi ${inquiry.traveler_name.split(" ")[0]}, thanks for your interest. Unfortunately the property is not available for those dates due to a prior booking. I'm sorry about that!`,
                time: "8:20 PM",
            },
            {
                id: `${inquiry.id}-3`,
                sender: "traveler",
                text: "No worries, thanks for letting me know. Do you have any availability in the following week?",
                time: "8:35 PM",
            },
        )
    } else {
        messages.push(
            {
                id: `${inquiry.id}-2`,
                sender: "traveler",
                text: "Also, is there parking available at the property?",
                time: "8:10 PM",
            },
        )
    }

    return messages
}

export default function InquiriesPage() {
    const { inquiries } = usePage<InquiriesPageProps>().props
    const [selectedId, setSelectedId] = useState<number | null>(
        inquiries.length > 0 ? inquiries[0].id : null
    )
    const [replyText, setReplyText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>({})
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const filteredInquiries = useMemo(() => {
        if (!searchQuery.trim()) return inquiries
        const q = searchQuery.toLowerCase()
        return inquiries.filter(
            (i) =>
                i.traveler_name.toLowerCase().includes(q) ||
                i.property_name.toLowerCase().includes(q)
        )
    }, [inquiries, searchQuery])

    const selected = inquiries.find((i) => i.id === selectedId) ?? null

    const currentMessages = selected
        ? localMessages[selected.id] ?? buildMockMessages(selected)
        : []

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [currentMessages.length, selectedId])

    function handleSend() {
        if (!replyText.trim() || !selected) return

        const newMsg: Message = {
            id: `${selected.id}-local-${Date.now()}`,
            sender: "host",
            text: replyText.trim(),
            time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        }

        const existing = localMessages[selected.id] ?? buildMockMessages(selected)
        setLocalMessages((prev) => ({
            ...prev,
            [selected.id]: [...existing, newMsg],
        }))
        setReplyText("")
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset className="max-h-svh overflow-hidden">
                <SiteHeader />
                <div className="flex min-h-0 flex-1 overflow-hidden">
                    {inquiries.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="text-center">
                                <IconMail className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                                <h2 className="text-lg font-semibold">No inquiries yet</h2>
                                <p className="mt-1 text-muted-foreground">
                                    They will appear here when travelers reach out about your properties.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-0 flex-1 overflow-hidden">
                            {/* Left panel — conversation list */}
                            <div className="flex w-72 shrink-0 flex-col border-r lg:w-80">
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <h2 className="font-semibold">Inquiries</h2>
                                    <IconDotsVertical className="size-5 text-muted-foreground" />
                                </div>
                                <div className="border-b px-3 py-2">
                                    <div className="relative">
                                        <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by name..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>
                                </div>
                                <div className="min-h-0 flex-1 overflow-y-auto">
                                    {filteredInquiries.length === 0 ? (
                                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                                            No matches found
                                        </p>
                                    ) : (
                                        filteredInquiries.map((inquiry) => {
                                            const msgs = localMessages[inquiry.id] ?? buildMockMessages(inquiry)
                                            const lastMsg = msgs[msgs.length - 1]
                                            return (
                                                <button
                                                    key={inquiry.id}
                                                    onClick={() => setSelectedId(inquiry.id)}
                                                    className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                                                        selectedId === inquiry.id
                                                            ? "bg-accent/60"
                                                            : ""
                                                    }`}
                                                >
                                                    <Avatar className="mt-0.5 size-10 shrink-0">
                                                        <AvatarFallback
                                                            className={`text-white ${getAvatarColor(inquiry.traveler_name)}`}
                                                        >
                                                            {getInitials(inquiry.traveler_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="truncate font-medium">
                                                                {inquiry.traveler_name}
                                                            </p>
                                                            <span className="shrink-0 text-sm text-muted-foreground">
                                                                {inquiry.sent_at}
                                                            </span>
                                                        </div>
                                                        <p className="truncate text-sm text-muted-foreground">
                                                            {lastMsg?.text ?? inquiry.message}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Center panel — messages */}
                            <div className="flex min-h-0 flex-1 flex-col">
                                {selected ? (
                                    <>
                                        {/* Chat header */}
                                        <div className="flex items-center gap-3 border-b px-4 py-3">
                                            <Avatar className="size-9">
                                                <AvatarFallback
                                                    className={`text-white ${getAvatarColor(selected.traveler_name)}`}
                                                >
                                                    {getInitials(selected.traveler_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold">{selected.traveler_name}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="size-2 rounded-full bg-emerald-500" />
                                                    <span className="text-sm text-muted-foreground">Online</span>
                                                </div>
                                            </div>
                                            <IconDotsVertical className="size-5 text-muted-foreground" />
                                        </div>

                                        {/* Messages area */}
                                        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                                            {/* Property context card */}
                                            <div className="mx-auto w-fit rounded-lg border bg-card px-4 py-2 text-center text-sm text-muted-foreground">
                                                Re: <span className="font-medium text-foreground">{selected.property_name}</span>
                                                {" · "}
                                                {selected.check_in} → {selected.check_out}
                                                {" · "}
                                                {selected.guests} guest{selected.guests !== 1 ? "s" : ""}
                                            </div>

                                            {currentMessages.map((msg) =>
                                                msg.sender === "traveler" ? (
                                                    <div key={msg.id} className="flex gap-3">
                                                        <Avatar className="mt-1 size-8 shrink-0">
                                                            <AvatarFallback
                                                                className={`text-sm text-white ${getAvatarColor(selected.traveler_name)}`}
                                                            >
                                                                {getInitials(selected.traveler_name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="max-w-[70%]">
                                                            <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                                                                <p>{msg.text}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {msg.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={msg.id} className="flex justify-end">
                                                        <div className="max-w-[70%]">
                                                            <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground">
                                                                <p>{msg.text}</p>
                                                            </div>
                                                            <p className="mt-1 text-right text-sm text-muted-foreground">
                                                                {msg.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Message input */}
                                        <div className="border-t p-4">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Type your reply..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    className="flex-1"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault()
                                                            handleSend()
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    size="icon"
                                                    onClick={handleSend}
                                                    disabled={!replyText.trim()}
                                                >
                                                    <IconSend className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-1 items-center justify-center text-muted-foreground">
                                        Select an inquiry to view the conversation
                                    </div>
                                )}
                            </div>

                            {/* Right panel — contact details */}
                            <div className="hidden w-72 shrink-0 flex-col border-l lg:flex xl:w-80">
                                {selected ? (
                                    <div className="flex flex-1 flex-col overflow-y-auto">
                                        {/* Profile header */}
                                        <div className="flex flex-col items-center px-4 py-6">
                                            <Avatar className="size-20">
                                                <AvatarFallback
                                                    className={`text-2xl text-white ${getAvatarColor(selected.traveler_name)}`}
                                                >
                                                    {getInitials(selected.traveler_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="mt-3 text-lg font-semibold">
                                                {selected.traveler_name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">Guest</p>
                                            <div className="mt-2 flex flex-col gap-2">
                                                <Select
                                                    value={selected.status}
                                                    onValueChange={(value) => {
                                                        router.patch(`/inquiries/${selected.id}`, { status: value }, { preserveScroll: true })
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="new">New</SelectItem>
                                                        <SelectItem value="contacted">Contacted</SelectItem>
                                                        <SelectItem value="booked">Booked</SelectItem>
                                                        <SelectItem value="lost">Lost</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.patch(`/inquiries/${selected.id}`, { status: "booked" }, { preserveScroll: true })}
                                                >
                                                    <IconCircleCheck className="mr-1 size-4" />
                                                    Mark as Booked
                                                </Button>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Contact info */}
                                        <div className="flex flex-col gap-3 p-4">
                                            <h4 className="text-sm font-semibold text-muted-foreground">Contact</h4>
                                            <div className="flex items-center gap-3">
                                                <IconMail className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="truncate text-sm">{selected.traveler_email}</span>
                                            </div>
                                            {selected.traveler_phone && (
                                                <div className="flex items-center gap-3">
                                                    <IconPhone className="size-4 shrink-0 text-muted-foreground" />
                                                    <span className="text-sm">{selected.traveler_phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Inquiry details */}
                                        <div className="flex flex-col gap-3 p-4">
                                            <h4 className="text-sm font-semibold text-muted-foreground">Inquiry Details</h4>
                                            <div className="flex items-center gap-3">
                                                <IconHome className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="text-sm">{selected.property_name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {selected.check_in} → {selected.check_out}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <IconUsers className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {selected.guests} guest{selected.guests !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 p-4">
                                            {selected.traveler_phone && (
                                                <Button variant="default" className="w-full" asChild>
                                                    <a
                                                        href={`https://wa.me/${selected.traveler_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selected.traveler_name.split(" ")[0]}, thanks for your inquiry about ${selected.property_name}. I'd love to help!`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <IconBrandWhatsapp className="mr-1.5 size-4" />
                                                        WhatsApp Reply
                                                    </a>
                                                </Button>
                                            )}
                                            <Button variant="outline" className="w-full" asChild>
                                                <a href={`mailto:${selected.traveler_email}`}>
                                                    <IconMail className="mr-1.5 size-4" />
                                                    Email
                                                </a>
                                            </Button>
                                            {selected.traveler_phone && (
                                                <Button variant="outline" className="w-full" asChild>
                                                    <a href={`tel:${selected.traveler_phone}`}>
                                                        <IconPhone className="mr-1.5 size-4" />
                                                        Call
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-1 items-center justify-center p-4 text-center text-sm text-muted-foreground">
                                        Select an inquiry to see details
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
