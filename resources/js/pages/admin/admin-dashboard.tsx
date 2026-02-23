import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminPropertyTable } from "@/components/admin-property-table"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminDashboardPageProps extends SharedData {
    properties: Array<{
        id: number
        property: string
        type: string
        status: string
        approval_status: string
        host_name: string
        inquiries: string
        bookings: string
        created_at: string
    }>
    hosts: Array<{
        id: number
        name: string
        email: string
        properties_count: number
        joined_at: string
    }>
    total_listings: number
    active_listings: number
    pending_approvals: number
    recent_inquiries: number
}

export default function AdminDashboardPage() {
    const {
        properties,
        total_listings,
        active_listings,
        pending_approvals,
        recent_inquiries
    } = usePage<AdminDashboardPageProps>().props

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
                            <div className="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
                                <Card>
                                    <CardHeader>
                                        <CardDescription>Total Listings</CardDescription>
                                        <CardTitle className="text-2xl">{total_listings}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardDescription>Active Listings</CardDescription>
                                        <CardTitle className="text-2xl">{active_listings}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardDescription>Pending Approvals</CardDescription>
                                        <CardTitle className="text-2xl">{pending_approvals}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardDescription>Recent Inquiries (7d)</CardDescription>
                                        <CardTitle className="text-2xl">{recent_inquiries}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </div>
                            <div className="px-4 lg:px-6">
                                <AdminPropertyTable data={properties} />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
