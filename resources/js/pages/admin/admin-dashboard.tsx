import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminSectionCards } from "@/components/admin-section-cards"
import { AdminPropertyTable } from "@/components/admin-property-table"
import { AdminSiteAnalytics } from "@/components/admin-site-analytics"
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
        approval_status: string
        host_name: string
        views_7d: string
        views_30d: string
        inquiries: string
        bookings: string
        created_at: string
    }>
    hosts: Array<{
        id: number
        name: string
        email: string
        properties_count: number
        subscription_status: string
        subscription_expires: string | null
        joined_at: string
    }>
    total_listings: number
    active_listings: number
    pending_approvals: number
    expiring_subscriptions: number
    recent_inquiries: number
    yearly_revenue: number
    site_analytics: Array<{
        date: string
        page_views: number
        unique_visitors: number
        property_views: number
        inquiry_submissions: number
        bounce_rate: number
        avg_session_duration: number
    }>
}

export default function AdminDashboardPage() {
    const {
        properties,
        hosts,
        total_listings,
        active_listings,
        pending_approvals,
        expiring_subscriptions,
        recent_inquiries,
        yearly_revenue,
        site_analytics
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
                            <AdminSectionCards
                                total_page_views={site_analytics.reduce((sum, day) => sum + day.page_views, 0)}
                                total_unique_visitors={site_analytics.reduce((sum, day) => sum + day.unique_visitors, 0)}
                                total_property_views={site_analytics.reduce((sum, day) => sum + day.property_views, 0)}
                                total_inquiry_submissions={site_analytics.reduce((sum, day) => sum + day.inquiry_submissions, 0)}
                            />
                            <div className="px-4 lg:px-6">
                                <AdminSiteAnalytics site_analytics={site_analytics} />
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
