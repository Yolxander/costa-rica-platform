import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
    IconSearch,
    IconMail,
    IconPhone,
    IconUser,
    IconHome,
    IconDownload,
    IconCalendar,
    IconTag,
    IconNote,
    IconX,
} from "@tabler/icons-react"
import { useState, useMemo, useCallback } from "react"

interface Guest {
    name: string
    email: string
    phone: string | null
    property_id: number | null
    property_name: string
    booking_count: number
    total_spent: number
    last_booking_date: string | null
}

interface GuestDetailInquiry {
    id: number
    property_name: string
    check_in: string
    check_out: string
    status: string
    message: string
    guests: number
    responses: Array<{ id: number; sender: string; message: string; created_at: string }>
    sent_at: string
}

interface GuestDetailTag {
    id: number
    name: string
    color: string
}

interface GuestDetailNote {
    id: number
    note: string
    created_at: string
    property_name?: string | null
}

interface GuestDetail {
    name: string
    email: string
    phone: string | null
    inquiries: GuestDetailInquiry[]
    stays: Array<{ id: number; property_name: string; check_in: string; check_out: string; guests: number }>
    tags: GuestDetailTag[]
    notes: GuestDetailNote[]
    all_tags: GuestDetailTag[]
}

interface CrmProps extends SharedData {
    guests: Guest[]
    properties: Array<{ id: number; name: string }>
}

function getCsrfToken(): string {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    if (meta?.content) return meta.content
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ''
}

function exportToCsv(guests: Guest[]) {
    const headers = ['Name', 'Email', 'Phone', 'Property', 'Booking Count', 'Total Spent', 'Last Booking']
    const rows = guests.map(g => [
        g.name,
        g.email,
        g.phone ?? '',
        g.property_name,
        g.booking_count,
        g.total_spent,
        g.last_booking_date ?? '',
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    new: "outline",
    contacted: "secondary",
    booked: "default",
    lost: "destructive",
}

export default function CrmPage() {
    const { guests, properties } = usePage<CrmProps>().props
    const [searchQuery, setSearchQuery] = useState("")
    const [propertyFilter, setPropertyFilter] = useState<string>("all")
    const [selectedGuestEmail, setSelectedGuestEmail] = useState<string | null>(null)
    const [guestDetail, setGuestDetail] = useState<GuestDetail | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [noteInput, setNoteInput] = useState("")
    const [savingNote, setSavingNote] = useState(false)
    const [savingTags, setSavingTags] = useState(false)
    const [createTagName, setCreateTagName] = useState("")
    const [createTagColor, setCreateTagColor] = useState("#3b82f6")
    const [showCreateTagForm, setShowCreateTagForm] = useState(false)

    const filteredGuests = useMemo(() => {
        let result = guests
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            result = result.filter(g =>
                g.name.toLowerCase().includes(q) ||
                g.email.toLowerCase().includes(q) ||
                (g.phone?.toLowerCase().includes(q))
            )
        }
        if (propertyFilter !== "all") {
            const pid = parseInt(propertyFilter)
            result = result.filter(g => g.property_id === pid)
        }
        return result
    }, [guests, searchQuery, propertyFilter])

    const fetchGuestDetail = useCallback(async (email: string) => {
        setLoadingDetail(true)
        try {
            const res = await fetch(`/crm/guests/${encodeURIComponent(email)}`, {
                headers: { Accept: "application/json" },
                credentials: "same-origin",
            })
            if (!res.ok) {
                setGuestDetail(null)
                return
            }
            const data = await res.json()
            setGuestDetail(data)
        } catch {
            setGuestDetail(null)
        } finally {
            setLoadingDetail(false)
        }
    }, [])

    const openGuestSheet = (guest: Guest) => {
        setSelectedGuestEmail(guest.email)
        setNoteInput("")
        fetchGuestDetail(guest.email)
    }

    const closeGuestSheet = () => {
        setSelectedGuestEmail(null)
        setGuestDetail(null)
        setCreateTagName("")
        setShowCreateTagForm(false)
    }

    const addNote = async () => {
        if (!selectedGuestEmail || !noteInput.trim() || !guestDetail) return
        setSavingNote(true)
        try {
            const csrf = getCsrfToken()
            const res = await fetch(`/crm/guests/${encodeURIComponent(selectedGuestEmail)}/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrf,
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ note: noteInput.trim() }),
            })
            if (res.ok) {
                const created = await res.json()
                setGuestDetail((prev) =>
                    prev ? { ...prev, notes: [created, ...prev.notes] } : null
                )
                setNoteInput("")
            }
        } finally {
            setSavingNote(false)
        }
    }

    const createTag = async (): Promise<GuestDetailTag | null> => {
        if (!createTagName.trim()) return null
        try {
            const csrf = getCsrfToken()
            const res = await fetch("/crm/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrf,
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ name: createTagName.trim(), color: createTagColor }),
            })
            if (res.ok) {
                const tag = await res.json()
                setGuestDetail((prev) =>
                    prev
                        ? {
                              ...prev,
                              all_tags: [...prev.all_tags, tag],
                              tags: [...prev.tags, tag],
                          }
                        : null
                )
                setCreateTagName("")
                return tag
            }
        } catch {}
        return null
    }

    const updateTags = async (tagIds: number[]) => {
        if (!selectedGuestEmail) return
        setSavingTags(true)
        try {
            const csrf = getCsrfToken()
            const res = await fetch(`/crm/guests/${encodeURIComponent(selectedGuestEmail)}/tags`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrf,
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ tag_ids: tagIds }),
            })
            if (res.ok) {
                const { tags } = await res.json()
                setGuestDetail((prev) => (prev ? { ...prev, tags } : null))
            }
        } finally {
            setSavingTags(false)
        }
    }

    const addTagToGuest = async (tag: GuestDetailTag) => {
        if (!guestDetail) return
        const newIds = [...guestDetail.tags.map((t) => t.id), tag.id]
        await updateTags(newIds)
    }

    const removeTagFromGuest = async (tagId: number) => {
        if (!guestDetail) return
        const newIds = guestDetail.tags.filter((t) => t.id !== tagId).map((t) => t.id)
        await updateTags(newIds)
    }

    const handleAddTag = async (value: string) => {
        if (!guestDetail) return
        if (value === "__create__") {
            setShowCreateTagForm(true)
            return
        }
        const tagId = parseInt(value)
        const tag = guestDetail.all_tags.find((t) => t.id === tagId)
        if (tag && !guestDetail.tags.some((t) => t.id === tagId)) {
            await addTagToGuest(tag)
        }
    }

    const handleCreateAndAddTag = async () => {
        if (!createTagName.trim()) return
        const tag = await createTag()
        if (tag) {
            await addTagToGuest(tag)
            setCreateTagName("")
            setShowCreateTagForm(false)
        }
    }

    const unassignedTags = useMemo(() => {
        if (!guestDetail) return []
        const assigned = new Set(guestDetail.tags.map((t) => t.id))
        return guestDetail.all_tags.filter((t) => !assigned.has(t.id))
    }, [guestDetail])

    return (
        <>
            <Head title="Guest CRM - Costa Rica Rental Hub" />
            <SidebarProvider
                style={{
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold">Guest CRM</h1>
                                        <p className="text-muted-foreground">Manage your guest contacts</p>
                                    </div>
                                    <Button variant="outline" onClick={() => exportToCsv(filteredGuests)}>
                                        <IconDownload className="mr-2 size-4" />
                                        Export CSV
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search guests..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Filter by property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All properties</SelectItem>
                                            {properties.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {filteredGuests.length === 0 ? (
                                    <Card>
                                        <CardContent className="flex flex-col items-center justify-center py-12">
                                            <IconUser className="size-12 text-muted-foreground/50 mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No guests yet</h3>
                                            <p className="text-muted-foreground text-center">
                                                Guests will appear here when they submit inquiries to your properties.
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredGuests.map((guest, i) => (
                                            <Card
                                                key={i}
                                                className="cursor-pointer transition-colors hover:bg-muted/50"
                                                onClick={() => openGuestSheet(guest)}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg">{guest.name}</CardTitle>
                                                            <CardDescription>{guest.email}</CardDescription>
                                                        </div>
                                                        <Badge variant="secondary">{guest.booking_count} booking{guest.booking_count !== 1 ? "s" : ""}</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    {guest.phone && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <IconPhone className="size-4 text-muted-foreground" />
                                                            {guest.phone}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <IconHome className="size-4 text-muted-foreground" />
                                                        {guest.property_name}
                                                    </div>
                                                    {guest.last_booking_date && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Last booking: {guest.last_booking_date}
                                                        </p>
                                                    )}
                                                    <div className="flex gap-2 pt-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={`mailto:${guest.email}`} onClick={(e) => e.stopPropagation()}>
                                                                <IconMail className="mr-1 size-4" />
                                                                Email
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>

            <Sheet open={!!selectedGuestEmail} onOpenChange={(open) => !open && closeGuestSheet()}>
                <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
                    {loadingDetail ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
                    ) : guestDetail ? (
                        <>
                            <SheetHeader>
                                <SheetTitle>{guestDetail.name}</SheetTitle>
                                <p className="text-sm text-muted-foreground">{guestDetail.email}</p>
                                {guestDetail.phone && (
                                    <p className="text-sm flex items-center gap-1">
                                        <IconPhone className="size-4" />
                                        {guestDetail.phone}
                                    </p>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`mailto:${guestDetail.email}`}>
                                        <IconMail className="mr-2 size-4" />
                                        Email guest
                                    </a>
                                </Button>
                            </SheetHeader>

                            <Separator />

                            <div className="space-y-4 px-4">
                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <IconTag className="size-4" />
                                        Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {guestDetail.tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="gap-1 pr-1"
                                                style={{ borderLeft: `3px solid ${tag.color}` }}
                                            >
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={() => !savingTags && removeTagFromGuest(tag.id)}
                                                    className="ml-1 rounded hover:bg-muted p-0.5"
                                                    aria-label={`Remove ${tag.name}`}
                                                >
                                                    <IconX className="size-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        <Select
                                            value=""
                                            onValueChange={(v) => v && handleAddTag(v)}
                                            disabled={savingTags}
                                        >
                                            <SelectTrigger className="w-[140px] h-8">
                                                <SelectValue placeholder="Add tag" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unassignedTags.map((t) => (
                                                    <SelectItem key={t.id} value={String(t.id)}>
                                                        {t.name}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="__create__">+ Create new tag</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {showCreateTagForm && (
                                        <div className="mt-2 flex gap-2 flex-wrap items-center">
                                            <Input
                                                placeholder="Tag name"
                                                value={createTagName}
                                                onChange={(e) => setCreateTagName(e.target.value)}
                                                className="h-8 w-32"
                                                autoFocus
                                            />
                                            <input
                                                type="color"
                                                value={createTagColor}
                                                onChange={(e) => setCreateTagColor(e.target.value)}
                                                className="h-8 w-10 rounded cursor-pointer border"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={handleCreateAndAddTag}
                                                disabled={!createTagName.trim()}
                                            >
                                                Create & add
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setShowCreateTagForm(false)
                                                    setCreateTagName("")
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <IconNote className="size-4" />
                                        Notes
                                    </h4>
                                    <Textarea
                                        placeholder="Add a note..."
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                        rows={2}
                                        className="mb-2"
                                    />
                                    <Button size="sm" onClick={addNote} disabled={!noteInput.trim() || savingNote}>
                                        {savingNote ? "Saving..." : "Add note"}
                                    </Button>
                                    {guestDetail.notes.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {guestDetail.notes.map((n) => (
                                                <li
                                                    key={n.id}
                                                    className="text-sm p-2 rounded-md bg-muted/50 border"
                                                >
                                                    <p>{n.note}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{n.created_at}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <IconCalendar className="size-4" />
                                        Stays ({guestDetail.stays.length})
                                    </h4>
                                    {guestDetail.stays.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No completed stays yet</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {guestDetail.stays.map((s) => (
                                                <li key={s.id} className="text-sm p-2 rounded-md bg-muted/50">
                                                    <span className="font-medium">{s.property_name}</span>
                                                    <br />
                                                    <span className="text-muted-foreground">
                                                        {s.check_in} – {s.check_out} · {s.guests} guest{s.guests !== 1 ? "s" : ""}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">Inquiry history</h4>
                                    {guestDetail.inquiries.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No inquiries</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {guestDetail.inquiries.map((inq) => (
                                                <li key={inq.id} className="text-sm p-2 rounded-md border">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-medium">{inq.property_name}</span>
                                                        <Badge variant={statusVariant[inq.status] ?? "secondary"}>
                                                            {inq.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground text-xs mt-1">
                                                        {inq.check_in} – {inq.check_out} · {inq.guests} guest{inq.guests !== 1 ? "s" : ""}
                                                    </p>
                                                    <p className="mt-1 line-clamp-2">{inq.message}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{inq.sent_at}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : null}
                </SheetContent>
            </Sheet>
        </>
    )
}
