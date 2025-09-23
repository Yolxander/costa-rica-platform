import { AdminSidebar } from "@/components/admin-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { PropertyTable } from "@/components/property-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

interface AdminDashboardPageProps extends SharedData {
    properties: Array<{
        id: number
        property: string
        type: string
        status: string
        views_7d: string
        views_30d: string
        inquiries: string
        bookings: string
    }>
    hosts: Array<{
        id: number
        name: string
        email: string
        properties_count: number
        status: string
        joined_at: string
    }>
    total_inquiries: number
    total_revenue: number
}

export default function AdminDashboardPage() {
    const { properties, hosts, total_inquiries, total_revenue } = usePage<AdminDashboardPageProps>().props

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AdminSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards properties={properties} />
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive />
                            </div>
                            <PropertyTable data={properties} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
