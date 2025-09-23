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
} from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconChevronLeft, IconChevronRight, IconCalendar } from "@tabler/icons-react"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

interface CalendarPageProps extends SharedData {
    events?: CalendarEvent[]
}

export default function CalendarPage() {
    const { events = [] } = usePage<CalendarPageProps>().props

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
                                        <div className="flex items-center gap-2">
                                            <IconCalendar className="h-5 w-5" />
                                            <CardTitle>Calendar & Availability</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Calendar
                                            events={[...events, ...sampleEvents]}
                                            view="month"
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
        </SidebarProvider>
    )
}
