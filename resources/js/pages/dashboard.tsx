import { AppSidebar } from "@/components/app-sidebar"
import { PropertyTable } from "@/components/property-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

interface DashboardPageProps extends SharedData {
    properties: Array<{
        id: number
        property: string
        type: string
        status: string
        inquiries: string
        bookings: string
    }>
    directBookings: number
    revenueProcessed: number
    guestEmailsCaptured: number
    moneySaved: number
}

export default function Page() {
    const {
        properties,
        directBookings,
        revenueProcessed,
        guestEmailsCaptured,
        moneySaved,
    } = usePage<DashboardPageProps>().props
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
                            <SectionCards
                                directBookings={directBookings}
                                revenueProcessed={revenueProcessed}
                                guestEmailsCaptured={guestEmailsCaptured}
                                moneySaved={moneySaved}
                            />
                            <div className="px-4 lg:px-6">
                                <PropertyTable data={properties} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
