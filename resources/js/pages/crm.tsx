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
import { IconSearch, IconMail, IconPhone, IconUser, IconHome, IconDownload } from "@tabler/icons-react"
import { useState, useMemo } from "react"

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

interface CrmProps extends SharedData {
    guests: Guest[]
    properties: Array<{ id: number; name: string }>
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

export default function CrmPage() {
    const { guests, properties } = usePage<CrmProps>().props
    const [searchQuery, setSearchQuery] = useState("")
    const [propertyFilter, setPropertyFilter] = useState<string>("all")

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
                                            <Card key={i}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-lg">{guest.name}</CardTitle>
                                                            <CardDescription>{guest.email}</CardDescription>
                                                        </div>
                                                        <Badge variant="secondary">{guest.booking_count} booking{guest.booking_count !== 1 ? 's' : ''}</Badge>
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
                                                            <a href={`mailto:${guest.email}`}>
                                                                <IconMail className="mr-1 size-4" />
                                                                Email (future)
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
        </>
    )
}
