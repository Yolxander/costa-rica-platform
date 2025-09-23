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
import { IconChevronLeft, IconChevronRight, IconCalendar } from "@tabler/icons-react"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { DateAvailabilityModal } from "@/components/DateAvailabilityModal"
import { useState } from "react"

interface CalendarPageProps extends SharedData {
    events?: CalendarEvent[]
    dateAvailability?: CalendarDateStatus
}

export default function CalendarPage() {
    const { events = [], dateAvailability = {} } = usePage<CalendarPageProps>().props

    // Modal state management
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentAvailability, setCurrentAvailability] = useState<DateAvailability | null>(null)
    const [localDateAvailability, setLocalDateAvailability] = useState<CalendarDateStatus>({...dateAvailability})

    // Sample date availability data
    const sampleDateAvailability: CalendarDateStatus = {
        '2024-12-15': {
            date: new Date(2024, 11, 15),
            status: 'blocked',
            reason: 'Holiday - Christmas'
        },
        '2024-12-20': {
            date: new Date(2024, 11, 20),
            status: 'maintenance',
            reason: 'Property maintenance'
        },
        '2024-12-22': {
            date: new Date(2024, 11, 22),
            status: 'pending-inquiry',
            reason: 'Guest inquiry pending'
        },
        '2024-12-25': {
            date: new Date(2024, 11, 25),
            status: 'blocked',
            reason: 'Christmas Day'
        },
        '2024-12-31': {
            date: new Date(2024, 11, 31),
            status: 'blocked',
            reason: 'New Year\'s Eve'
        },
        '2025-01-01': {
            date: new Date(2025, 0, 1),
            status: 'blocked',
            reason: 'New Year\'s Day'
        }
    };

    // Sample events for demonstration
    const sampleEvents: CalendarEvent[] = [
        {
            id: "1",
            start: new Date(2024, 11, 15, 14, 0), // December 15, 2024, 2:00 PM
            end: new Date(2024, 11, 15, 16, 0), // December 15, 2024, 4:00 PM
            title: "Property Inspection",
            color: "blue",
        },
        {
            id: "2",
            start: new Date(2024, 11, 20, 10, 0), // December 20, 2024, 10:00 AM
            end: new Date(2024, 11, 22, 12, 0), // December 22, 2024, 12:00 PM
            title: "Maintenance Window",
            color: "green",
        },
        {
            id: "3",
            start: new Date(2024, 11, 25, 9, 0), // December 25, 2024, 9:00 AM
            end: new Date(2024, 11, 25, 11, 0), // December 25, 2024, 11:00 AM
            title: "Guest Check-in",
            color: "purple",
        },
    ]

    // Handle date clicks for availability management
    const handleDateClick = (date: Date, availability: DateAvailability | null) => {
        setSelectedDate(date)
        setCurrentAvailability(availability)
        setIsModalOpen(true)
    };

    // Handle saving availability changes
    const handleSaveAvailability = (date: Date, availability: DateAvailability) => {
        const dateKey = date.toISOString().split('T')[0]
        setLocalDateAvailability(prev => ({
            ...prev,
            [dateKey]: availability
        }))

        // Here you would typically make an API call to save the changes
        console.log('Saving availability:', { date, availability })
    };

    // Handle removing availability status
    const handleRemoveAvailability = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0]
        setLocalDateAvailability(prev => {
            const updated = { ...prev }
            delete updated[dateKey]
            return updated
        })

        // Here you would typically make an API call to remove the status
        console.log('Removing availability for date:', date)
    };

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
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconCalendar className="h-5 w-5" />
                                                <CardTitle>Calendar & Availability</CardTitle>
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
                                        <Calendar
                                            events={[...events, ...sampleEvents]}
                                            dateAvailability={{...localDateAvailability, ...sampleDateAvailability}}
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
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>

            {/* Date Availability Modal */}
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
