import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconDownload, IconArrowLeft } from "@tabler/icons-react"

export default function ImportAirbnbPage() {
    return (
        <>
            <Head title="Import from Airbnb - Costa Rica Rental Hub" />
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
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                <Link
                                    href="/listings"
                                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    <IconArrowLeft className="size-4" />
                                    Back to listings
                                </Link>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <IconDownload className="size-6 text-primary" />
                                            <CardTitle>Import from Airbnb</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Paste your Airbnb listing URL and we&apos;ll import photos, title, description, and amenities.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="airbnb-url">Airbnb Listing URL</Label>
                                                <Input
                                                    id="airbnb-url"
                                                    type="url"
                                                    placeholder="https://www.airbnb.com/rooms/..."
                                                    className="mt-2"
                                                />
                                            </div>
                                            <Button disabled>
                                                Import Listing (Coming in Phase 6)
                                            </Button>
                                            <p className="text-sm text-muted-foreground">
                                                Full Airbnb import with scraping will be available in the next phase.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
