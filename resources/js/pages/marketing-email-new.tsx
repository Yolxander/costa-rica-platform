import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Button } from "@/components/ui/button"
import { EmailCampaignWizard } from "@/components/email-campaign-wizard"
import { IconArrowLeft } from "@tabler/icons-react"

interface InitialCampaign {
    id: number
    subject: string
    body: string
    segment_type: string
    property_id: number | null
    recipient_count: number
}

interface MarketingEmailNewProps extends SharedData {
    properties: Array<{
        id: number
        slug: string
        name: string
        location: string
        description?: string
        amenities?: string[]
        images?: string[]
        guests?: number
        rating?: number | null
    }>
    emailSegments: Record<string, number>
    emailPropertyCounts: Record<number, number>
    initialCampaign?: InitialCampaign | null
    initialStep?: number | null
}

export default function MarketingEmailNewPage() {
    const { properties, emailSegments, emailPropertyCounts, auth, initialCampaign, initialStep } =
        usePage<MarketingEmailNewProps>().props

    const isEdit = !!initialCampaign

    return (
        <>
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
                                <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
                                    <Link href="/marketing" className="gap-2">
                                        <IconArrowLeft className="size-4" />
                                        Back to Marketing
                                    </Link>
                                </Button>

                                <div className="mt-6">
                                    <EmailCampaignWizard
                                        segments={emailSegments}
                                        propertyCounts={emailPropertyCounts}
                                        properties={properties}
                                        hostName={auth?.user?.name}
                                        saveUrl={isEdit ? undefined : "/marketing/email"}
                                        updateUrl={isEdit ? `/marketing/email/${initialCampaign?.id}` : undefined}
                                        initialCampaign={initialCampaign ?? undefined}
                                        initialStep={initialStep ?? undefined}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
