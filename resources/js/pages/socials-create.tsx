import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, Link, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import { SocialPostWizard } from "@/components/social-post-wizard"
import { SharedData } from "@/types"

interface Property {
    id: number
    name: string
}

interface SocialsCreateProps extends SharedData {
    properties: Property[]
    platform?: "facebook" | "instagram"
    [key: string]: unknown
}

export default function SocialsCreatePage() {
    const { properties = [] } = usePage<SocialsCreateProps>().props

    return (
        <>
            <Head title="Create Social Post - Sora" />
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
                            <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <Link href="/socials">
                                        <Button variant="ghost" size="icon">
                                            <IconArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <div>
                                        <h1 className="text-2xl font-semibold tracking-tight">Create Post</h1>
                                        <p className="text-muted-foreground">
                                            Create and schedule your social media post
                                        </p>
                                    </div>
                                </div>

                                {/* Wizard */}
                                <SocialPostWizard
                                    properties={properties}
                                    saveUrl="/socials"
                                />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
