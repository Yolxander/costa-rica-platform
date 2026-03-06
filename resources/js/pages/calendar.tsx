import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
    CalendarYearView,
    type CalendarEvent,
    type DateAvailability,
    type CalendarDateStatus,
} from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconChevronLeft, IconChevronRight, IconCalendar } from "@tabler/icons-react"
import { usePage, router } from "@inertiajs/react"
import { SharedData } from "@/types"
import { DateAvailabilityModal } from "@/components/DateAvailabilityModal"
import { useState, useMemo, useEffect } from "react"

interface CalendarPageProps extends SharedData {
    events?: Array<{ id: string; start: string; end: string; title: string; color?: string }>
    dateAvailability?: Record<string, { id: number; date: string; status: string; reason?: string }>
    properties?: Array<{ id: number; name: string }>
    selectedPropertyId?: number | null
}

function convertToCalendarEvents(
    events: CalendarPageProps["events"] = []
): CalendarEvent[] {
    return events.map((e) => ({
        id: e.id,
        start: new Date(e.start),
        end: new Date(e.end),
        title: e.title,
        color: (e.color as CalendarEvent["color"]) ?? undefined,
    }))
}

function convertToCalendarDateStatus(
    dateAvailability: CalendarPageProps["dateAvailability"] = {}
): CalendarDateStatus {
    const result: CalendarDateStatus = {}
    for (const [dateKey, av] of Object.entries(dateAvailability)) {
        result[dateKey] = {
            date: new Date(av.date + "T12:00:00"),
            status: av.status as DateAvailability["status"],
            reason: av.reason,
            id: av.id,
        }
    }
    return result
}

export default function CalendarPage() {
    const {
        events: rawEvents = [],
        dateAvailability: rawDateAvailability = {},
        properties = [],
        selectedPropertyId,
    } = usePage<CalendarPageProps>().props

    const events = useMemo(() => convertToCalendarEvents(rawEvents), [rawEvents])
    const serverDateAvailability = useMemo(
        () => convertToCalendarDateStatus(rawDateAvailability),
        [rawDateAvailability]
    )

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentAvailability, setCurrentAvailability] = useState<DateAvailability | null>(null)
    const [localDateAvailability, setLocalDateAvailability] = useState<CalendarDateStatus>(() => ({
        ...serverDateAvailability,
    }))

    useEffect(() => {
        setLocalDateAvailability({ ...serverDateAvailability })
    }, [serverDateAvailability])

    const mergedDateAvailability = useMemo(
        () => ({ ...serverDateAvailability, ...localDateAvailability }),
        [serverDateAvailability, localDateAvailability]
    )

    const handlePropertyChange = (propertyId: string) => {
        router.visit(`/calendar?property_id=${propertyId}`)
    }

    const handleDateClick = (date: Date, availability: DateAvailability | null) => {
        if (!selectedPropertyId) return
        setSelectedDate(date)
        setCurrentAvailability(availability)
        setIsModalOpen(true)
    }

    const handleSaveAvailability = (date: Date, availability: DateAvailability) => {
        if (!selectedPropertyId) return
        const dateKey = date.toISOString().split("T")[0]
        const payload = {
            property_id: selectedPropertyId,
            dates: [dateKey],
            status: availability.status,
            reason: availability.reason || null,
        }
        setLocalDateAvailability((prev) => ({
            ...prev,
            [dateKey]: {
                ...availability,
                date: new Date(dateKey + "T12:00:00"),
            },
        }))
        router.post("/calendar/availability", payload, { preserveScroll: true })
    }

    const handleRemoveAvailability = (date: Date, id?: number) => {
        if (!selectedPropertyId) return
        const dateKey = date.toISOString().split("T")[0]
        setLocalDateAvailability((prev) => {
            const updated = { ...prev }
            delete updated[dateKey]
            return updated
        })
        if (id) {
            router.delete(`/calendar/availability/${id}`, { preserveScroll: true })
        }
    }

    if (properties.length === 0) {
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
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                        <IconCalendar className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Add a property to manage calendar availability.
                        </p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
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
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconCalendar className="h-5 w-5" />
                                                <CardTitle>Calendar & Availability</CardTitle>
                                                {properties.length > 1 && (
                                                    <Select
                                                        value={
                                                            selectedPropertyId
                                                                ? String(selectedPropertyId)
                                                                : ""
                                                        }
                                                        onValueChange={handlePropertyChange}
                                                    >
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Select property" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {properties.map((p) => (
                                                                <SelectItem
                                                                    key={p.id}
                                                                    value={String(p.id)}
                                                                >
                                                                    {p.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded bg-green-50 border border-green-200"></div>
                                                    <span className="text-muted-foreground">Available</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
                                                    <span className="text-muted-foreground">Blocked</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div>
                                                    <span className="text-muted-foreground">Pending Inquiry</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded bg-orange-50 border border-orange-200"></div>
                                                    <span className="text-muted-foreground">Maintenance</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedPropertyId ? (
                                            <Calendar
                                                events={events}
                                                dateAvailability={mergedDateAvailability}
                                                view="month"
                                                onDateClick={handleDateClick}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarViewTrigger view="week">Week</CalendarViewTrigger>
                                                        <CalendarViewTrigger view="month">Month</CalendarViewTrigger>
                                                        <CalendarViewTrigger view="year">Year</CalendarViewTrigger>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarPrevTrigger>
                                                            <IconChevronLeft className="h-4 w-4" />
                                                        </CalendarPrevTrigger>
                                                        <CalendarCurrentDate />
                                                        <CalendarNextTrigger>
                                                            <IconChevronRight className="h-4 w-4" />
                                                        </CalendarNextTrigger>
                                                        <CalendarTodayTrigger>
                                                            Today
                                                        </CalendarTodayTrigger>
                                                    </div>
                                                </div>

                                                <div className="h-[600px] overflow-hidden">
                                                    <CalendarWeekView />
                                                    <CalendarMonthView />
                                                    <CalendarYearView />
                                                </div>
                                            </Calendar>
                                        ) : (
                                            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                                                Select a property to view the calendar.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>

            <DateAvailabilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                currentAvailability={currentAvailability}
                onSave={handleSaveAvailability}
                onRemove={handleRemoveAvailability}
            />
        </SidebarProvider>
    )
}
