import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { PropertyDetailsContent } from "@/components/property-details-content"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"

interface PropertyDetailsPageProps {
    property: {
        id: number
        name: string
        type: string
        status: string
        location: string
        description: string
        amenities: string[]
        images: string[]
        house_rules: string[]
        policies: string[]
        pricing: {
            base_price: number
            price_format: string
            currency: string
            cleaning_fee: number
            service_fee: number
        }
        capacity: {
            guests: number
            bedrooms: number
            bathrooms: number
        }
        availability: {
            check_in: string
            check_out: string
            minimum_stay: number
        }
        performance: {
            views_7d: number
            views_30d: number
            inquiries: number
            bookings: number
            rating: number
            reviews: number
        }
        recent_inquiries: Array<{
            id: number
            guest_name: string
            guest_email: string
            check_in: string
            check_out: string
            guests: number
            message: string
            status: 'pending' | 'responded' | 'confirmed' | 'declined'
            created_at: string
        }>
        upcoming_bookings: Array<{
            id: number
            guest_name: string
            check_in: string
            check_out: string
            guests: number
            total_amount: number
            status: 'confirmed' | 'pending' | 'cancelled'
        }>
    }
}

export default function PropertyDetailsPage() {
    const { property } = usePage<PropertyDetailsPageProps>().props

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
                            <PropertyDetailsContent property={property} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
