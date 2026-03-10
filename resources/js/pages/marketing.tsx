import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, Link, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconMail, IconBrandInstagram, IconPlus, IconDots, IconEdit, IconEye } from "@tabler/icons-react"
import { useEffect } from "react"
import { toast } from "sonner"

const SEGMENT_LABELS: Record<string, string> = {
    didnt_book: "Didn't book",
    booked_before: "Booked before",
    recent_30: "Recent inquirers (30 days)",
    recent_60: "Recent inquirers (60 days)",
    recent_90: "Recent inquirers (90 days)",
    all: "All guests",
    by_property: "By property",
}

interface EmailCampaign {
    id: number
    subject: string
    name: string | null
    segment_type: string
    recipient_count: number
    status: string
    property_name: string | null
    created_at: string
}

interface SocialPost {
    id: number
    caption: string | null
    hashtags: string | null
    location: string | null
    property_name: string | null
    images_count: number
    created_at: string
}

interface MarketingProps extends SharedData {
    emailCampaigns: EmailCampaign[]
    socialPosts: SocialPost[]
}

function truncate(str: string | null, maxLen: number): string {
    if (!str || str.length <= maxLen) return str
    return str.slice(0, maxLen).trim() + "..."
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function MarketingPage() {
    const {
        emailCampaigns = [],
        socialPosts = [],
        flash,
    } = usePage<MarketingProps>().props

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success)
        }
    }, [flash?.success])

    return (
        <>
            <Head title="Marketing - Sora" />
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
                            <div className="px-4 lg:px-6 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold">Marketing</h1>
                                        <p className="text-muted-foreground">
                                            Email campaigns and social content tools
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild>
                                            <Link href="/marketing/email/new" className="gap-2">
                                                <IconMail className="size-4" />
                                                Create Email Campaign
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href="/marketing/social/new" className="gap-2">
                                                <IconBrandInstagram className="size-4" />
                                                Create Social Post
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <Tabs defaultValue="emails" className="w-full space-y-6">
                                    <TabsList className="flex h-11 w-full max-w-[360px] gap-1 rounded-lg bg-muted p-1 sm:max-w-[400px]">
                                        <TabsTrigger
                                            value="emails"
                                            className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <IconMail className="size-4 shrink-0" />
                                            <span className="truncate">Email Campaigns</span>
                                            <span className="flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {emailCampaigns.length}
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="posts"
                                            className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <IconBrandInstagram className="size-4 shrink-0" />
                                            <span className="truncate">Social Posts</span>
                                            <span className="flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {socialPosts.length}
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="emails" className="mt-0">
                                        <Card>
                                            <CardContent className="pt-6">
                                                {emailCampaigns.length === 0 ? (
                                                    <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                                                        <p>No campaigns yet. Create your first email campaign.</p>
                                                        <Button asChild variant="outline" className="mt-4">
                                                            <Link href="/marketing/email/new" className="gap-2">
                                                                <IconPlus className="size-4" />
                                                                Create Email Campaign
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b">
                                                                    <th className="text-left py-3 px-2 font-medium">Subject</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Segment</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Recipients</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Status</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Created</th>
                                                                    <th className="w-[60px] py-3 px-2"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {emailCampaigns.map((c) => (
                                                                    <tr key={c.id} className="border-b hover:bg-muted/50">
                                                                        <td className="py-3 px-2">{truncate(c.subject, 50)}</td>
                                                                        <td className="py-3 px-2">
                                                                            {SEGMENT_LABELS[c.segment_type] ?? c.segment_type}
                                                                        </td>
                                                                        <td className="py-3 px-2">{c.recipient_count}</td>
                                                                        <td className="py-3 px-2 capitalize">{c.status}</td>
                                                                        <td className="py-3 px-2">{formatDate(c.created_at)}</td>
                                                                        <td className="py-3 px-2">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="size-8">
                                                                                        <IconDots className="size-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem asChild>
                                                                                        <Link href={`/marketing/email/${c.id}/edit`} className="gap-2 cursor-pointer">
                                                                                            <IconEdit className="size-4" />
                                                                                            Edit
                                                                                        </Link>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem asChild>
                                                                                        <Link href={`/marketing/email/${c.id}/edit?preview=1`} className="gap-2 cursor-pointer">
                                                                                            <IconEye className="size-4" />
                                                                                            Preview
                                                                                        </Link>
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="posts" className="mt-0">
                                        <Card>
                                            <CardContent className="">
                                                {socialPosts.length === 0 ? (
                                                    <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                                                        <p>No posts yet. Create your first social post.</p>
                                                        <Button asChild variant="outline" className="mt-4">
                                                            <Link href="/marketing/social/new" className="gap-2">
                                                                <IconPlus className="size-4" />
                                                                Create Social Post
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="border-b">
                                                                    <th className="text-left py-3 px-2 font-medium">Caption</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Property</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Images</th>
                                                                    <th className="text-left py-3 px-2 font-medium">Created</th>
                                                                    <th className="w-[60px] py-3 px-2"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {socialPosts.map((p) => (
                                                                    <tr key={p.id} className="border-b hover:bg-muted/50">
                                                                        <td className="py-3 px-2 max-w-xs">
                                                                            {truncate(p.caption ?? "", 60)}
                                                                        </td>
                                                                        <td className="py-3 px-2">{p.property_name ?? "—"}</td>
                                                                        <td className="py-3 px-2">{p.images_count}</td>
                                                                        <td className="py-3 px-2">{formatDate(p.created_at)}</td>
                                                                        <td className="py-3 px-2">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="size-8">
                                                                                        <IconDots className="size-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem asChild>
                                                                                        <Link href={`/marketing/social/${p.id}/edit`} className="gap-2 cursor-pointer">
                                                                                            <IconEdit className="size-4" />
                                                                                            Edit
                                                                                        </Link>
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem asChild>
                                                                                        <Link href={`/marketing/social/${p.id}/edit?preview=1`} className="gap-2 cursor-pointer">
                                                                                            <IconEye className="size-4" />
                                                                                            Preview
                                                                                        </Link>
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
