import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage, router, Link } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
    IconUser,
} from "@tabler/icons-react"

interface InquiryResponse {
    id: number
    sender: string
    message: string
    created_at: string
}

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
    responses: InquiryResponse[]
}

interface InquiriesPageProps extends SharedData {
    inquiries: Inquiry[]
    properties: Array<{ id: number; name: string }>
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

function formatDateRange(checkIn: string, checkOut: string): string {
    const fmt = (s: string) => {
        const d = new Date(s + "T12:00:00")
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
    return `${fmt(checkIn)} – ${fmt(checkOut)}`
}

function formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, "")
    if (digits.length === 11 && digits.startsWith("1")) {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    }
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }
    return phone
}

export default function InquiriesPage() {
    const { inquiries, properties = [] } = usePage<InquiriesPageProps>().props
    const [selectedId, setSelectedId] = useState<number | null>(
        inquiries.length > 0 ? inquiries[0].id : null
    )
    const [replyText, setReplyText] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [propertyFilter, setPropertyFilter] = useState<string>("all")
    const [localResponses, setLocalResponses] = useState<Record<number, InquiryResponse[]>>({})
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const filteredInquiries = useMemo(() => {
        let result = inquiries
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(
                (i) =>
                    i.traveler_name.toLowerCase().includes(q) ||
                    i.traveler_email.toLowerCase().includes(q) ||
                    i.property_name.toLowerCase().includes(q)
            )
        }
        if (propertyFilter !== "all") {
            const pid = parseInt(propertyFilter)
            result = result.filter((i) => i.property_id === pid)
        }
        return result
    }, [inquiries, searchQuery, propertyFilter])

    const selected = inquiries.find((i) => i.id === selectedId) ?? null

    const displayResponses = selected
        ? (localResponses[selected.id] ?? selected.responses ?? [])
        : []

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [displayResponses.length, selectedId])

    function handleSend() {
        if (!replyText.trim() || !selected) return

        const text = replyText.trim()
        setReplyText("")

        const newResponse: InquiryResponse = {
            id: 0,
            sender: "host",
            message: text,
            created_at: new Date().toLocaleString(),
        }

        setLocalResponses((prev) => ({
            ...prev,
            [selected.id]: [...(prev[selected.id] ?? selected.responses ?? []), newResponse],
        }))

        router.post(`/inquiries/${selected.id}/reply`, { message: text }, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    return (
        <TooltipProvider>
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
                                {/* Left panel — inquiry list */}
                                <div className="flex w-72 shrink-0 flex-col border-r lg:w-80">
                                    <div className="flex items-center justify-between border-b px-4 py-3">
                                        <h2 className="font-semibold">Inquiries</h2>
                                        <IconDotsVertical className="size-5 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-2 border-b px-3 py-2">
                                        <div className="relative">
                                            <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by name, email, or property..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                                            <SelectTrigger className="w-full min-w-0">
                                                {propertyFilter === "all" ? (
                                                    <span className="truncate">All properties</span>
                                                ) : (() => {
                                                    const prop = properties.find((p) => String(p.id) === propertyFilter)
                                                    const name = prop?.name ?? ""
                                                    if (!name) return <span className="truncate">Filter by property</span>
                                                    return (
                                                        <span className="block min-w-0 truncate" title={name}>
                                                            {name}
                                                        </span>
                                                    )
                                                })()}
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All properties</SelectItem>
                                                {properties.map((p) => (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="min-h-0 flex-1 overflow-y-auto">
                                        {filteredInquiries.length === 0 ? (
                                            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                                                No matches found
                                            </p>
                                        ) : (
                                            filteredInquiries.map((inquiry) => (
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
                                                            {inquiry.message}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Center panel — inquiry detail */}
                                <div className="flex min-h-0 flex-1 flex-col">
                                    {selected ? (
                                        <>
                                            {/* Header */}
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
                                                    <p className="text-sm text-muted-foreground">
                                                        {selected.property_name} · {selected.sent_at}
                                                    </p>
                                                </div>
                                                <IconDotsVertical className="size-5 text-muted-foreground" />
                                            </div>

                                            {/* Inquiry content */}
                                            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                                                <div className="mx-auto w-full max-w-2xl space-y-4">
                                                    <div className="rounded-lg border bg-card p-4">
                                                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                                                            {formatDateRange(selected.check_in, selected.check_out)} · {selected.guests} guest{selected.guests !== 1 ? "s" : ""}
                                                        </p>
                                                        <p className="whitespace-pre-wrap">{selected.message}</p>
                                                    </div>

                                                    {displayResponses.length > 0 && (
                                                        <div className="space-y-3">
                                                            {displayResponses.map((r) =>
                                                                r.sender === "traveler" ? (
                                                                    <div key={r.id} className="flex gap-3">
                                                                        <Avatar className="mt-1 size-8 shrink-0">
                                                                            <AvatarFallback
                                                                                className={`text-sm text-white ${getAvatarColor(selected.traveler_name)}`}
                                                                            >
                                                                                {getInitials(selected.traveler_name)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="max-w-[70%]">
                                                                            <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5">
                                                                                <p>{r.message}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                                {r.created_at}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div key={r.id} className="flex justify-end">
                                                                        <div className="max-w-[70%]">
                                                                            <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground">
                                                                                <p>{r.message}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-right text-sm text-muted-foreground">
                                                                                {r.created_at}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                    <div ref={messagesEndRef} />
                                                </div>
                                            </div>

                                            {/* Reply via Brisa (secondary) */}
                                            <div className="border-t p-4">
                                                <p className="mb-2 text-xs text-muted-foreground">Or reply via Brisa (sends email to guest)</p>
                                                <div className="flex items-end gap-2">
                                                    <Textarea
                                                        placeholder="Type your reply..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="flex-1 resize-none"
                                                        rows={2}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                e.preventDefault()
                                                                handleSend()
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        className="shrink-0"
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
                                            Select an inquiry to view details
                                        </div>
                                    )}
                                </div>

                                {/* Right panel — contact details */}
                                <div className="hidden w-72 shrink-0 flex-col border-l bg-muted/30 lg:flex xl:w-80">
                                    {selected ? (
                                        <div className="flex flex-1 flex-col overflow-y-auto">
                                            <div className="flex flex-col items-center px-4 py-6">
                                                <Avatar className="size-16">
                                                    <AvatarFallback
                                                        className={`text-xl text-white ${getAvatarColor(selected.traveler_name)}`}
                                                    >
                                                        {getInitials(selected.traveler_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="mt-3 text-base font-semibold">
                                                    {selected.traveler_name}
                                                </h3>
                                                <span className="mt-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                                    Guest
                                                </span>
                                                <div className="mt-4 w-full space-y-2">
                                                    <Select
                                                        value={selected.status}
                                                        onValueChange={(value) => {
                                                            router.patch(`/inquiries/${selected.id}`, { status: value }, { preserveScroll: true })
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
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
                                                        className="w-full"
                                                        onClick={() => router.patch(`/inquiries/${selected.id}`, { status: "booked" }, { preserveScroll: true })}
                                                    >
                                                        <IconCircleCheck className="mr-1.5 size-4" />
                                                        Mark as Booked
                                                    </Button>
                                                </div>
                                                <Button variant="ghost" size="sm" className="mt-3" asChild>
                                                    <Link href="/crm">
                                                        <IconUser className="mr-1.5 size-4" />
                                                        View in CRM
                                                    </Link>
                                                </Button>
                                            </div>

                                            <Separator />

                                            <div className="space-y-3 p-4">
                                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Contact
                                                </h4>
                                                <a
                                                    href={`mailto:${selected.traveler_email}`}
                                                    className="flex items-center gap-3 rounded-md py-1.5 transition-colors hover:bg-muted/50"
                                                >
                                                    <IconMail className="size-4 shrink-0 text-muted-foreground" />
                                                    <span className="min-w-0 truncate text-sm" title={selected.traveler_email}>
                                                        {selected.traveler_email}
                                                    </span>
                                                </a>
                                                {selected.traveler_phone && (
                                                    <a
                                                        href={`tel:${selected.traveler_phone}`}
                                                        className="flex items-center gap-3 rounded-md py-1.5 transition-colors hover:bg-muted/50"
                                                    >
                                                        <IconPhone className="size-4 shrink-0 text-muted-foreground" />
                                                        <span className="text-sm tabular-nums">
                                                            {formatPhone(selected.traveler_phone)}
                                                        </span>
                                                    </a>
                                                )}
                                            </div>

                                            <Separator />

                                            <div className="space-y-3 p-4">
                                                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    Inquiry Details
                                                </h4>
                                                <div className="flex items-start gap-3">
                                                    <IconHome className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                                    <span className="min-w-0 truncate text-sm leading-snug" title={selected.property_name}>
                                                        {selected.property_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatDateRange(selected.check_in, selected.check_out)}
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

                                            <div className="space-y-2 p-4">
                                                {selected.traveler_phone ? (
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
                                                ) : (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="block">
                                                                <Button variant="outline" className="w-full" disabled>
                                                                    <IconBrandWhatsapp className="mr-1.5 size-4" />
                                                                    WhatsApp (add phone)
                                                                </Button>
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Traveler did not provide a phone number. They can add one when submitting an inquiry.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                                <Button variant="outline" className="w-full" asChild>
                                                    <a
                                                        href={`mailto:${selected.traveler_email}?subject=${encodeURIComponent(`Re: ${selected.property_name} - ${formatDateRange(selected.check_in, selected.check_out)}`)}`}
                                                    >
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
        </TooltipProvider>
    )
}
