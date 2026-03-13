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
    IconBrandFacebook,
    IconBrandInstagram,
    IconPlus,
    IconEye,
    IconTrash,
    IconShare,
} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { router } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface SocialPost {
    id: number
    caption: string | null
    hashtags: string | null
    location: string | null
    property_name: string | null
    images_count: number
    created_at: string
    platform: "facebook" | "instagram"
    status?: "draft" | "scheduled" | "published"
}

interface SocialsProps extends SharedData {
    facebookPosts: SocialPost[]
    instagramPosts: SocialPost[]
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatTime(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}

function truncate(str: string | null, maxLen: number): string {
    if (!str || str.length <= maxLen) return str || ""
    return str.slice(0, maxLen).trim() + "..."
}

function PostCard({ post, onDelete }: { post: SocialPost; onDelete?: (id: number) => void }) {
    const [showViewModal, setShowViewModal] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        setIsDeleting(true)
        router.delete(`/socials/${post.id}`, {
            onSuccess: () => {
                toast.success("Post deleted")
                setShowDeleteDialog(false)
                onDelete?.(post.id)
            },
            onError: () => {
                toast.error("Failed to delete post")
                setIsDeleting(false)
            },
        })
    }

    const handleShare = () => {
        setShowShareModal(true)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <Card className="overflow-hidden flex flex-col py-0">
            <CardContent className="p-0 flex-1 flex flex-col">
                {/* Header with platform */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        {post.platform === "instagram" ? (
                            <>
                                <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                                    <div className="rounded-full bg-white p-0.5">
                                        <IconBrandInstagram className="h-4 w-4 text-pink-600" />
                                    </div>
                                </div>
                                <span className="text-sm font-medium">Instagram</span>
                            </>
                        ) : (
                            <>
                                <IconBrandFacebook className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium">Facebook</span>
                            </>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {post.status === "draft" && "Draft"}
                        {post.status === "scheduled" && "Scheduled"}
                        {post.status === "published" && "Published"}
                    </span>
                </div>

                {/* Title */}
                <div className="px-4 pt-4">
                    <h3 className="font-semibold text-base line-clamp-1">
                        {post.caption ? truncate(post.caption, 30) : "Untitled post"}
                    </h3>
                </div>

                {/* Description */}
                <div className="px-4 pt-2 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                        {post.caption ? truncate(post.caption, 200) : "No description"}
                    </p>
                </div>

                {/* Date and Time */}
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-8 text-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="font-medium">{formatDate(post.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="font-medium">{formatTime(post.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer with user and actions */}
                <div className="flex items-center justify-between bg-muted/30 px-4 py-3 mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">U</span>
                        </div>
                        <span className="text-sm font-medium">You</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowViewModal(true)}
                        >
                            <IconEye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <IconTrash className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={handleShare}
                        >
                            <IconShare className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>

            {/* View Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Post Details</DialogTitle>
                        <DialogDescription>
                            {post.platform === "instagram" ? "Instagram" : "Facebook"} post - {post.status}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label className="text-sm font-medium">Caption</Label>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{post.caption || "No caption"}</p>
                        </div>
                        {post.hashtags && (
                            <div>
                                <Label className="text-sm font-medium">Hashtags</Label>
                                <p className="text-sm text-muted-foreground mt-1">{post.hashtags}</p>
                            </div>
                        )}
                        {post.location && (
                            <div>
                                <Label className="text-sm font-medium">Location</Label>
                                <p className="text-sm text-muted-foreground mt-1">{post.location}</p>
                            </div>
                        )}
                        {post.property_name && (
                            <div>
                                <Label className="text-sm font-medium">Property</Label>
                                <p className="text-sm text-muted-foreground mt-1">{post.property_name}</p>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <div>
                                <Label className="text-sm font-medium">Date</Label>
                                <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Time</Label>
                                <p className="text-sm text-muted-foreground">{formatTime(post.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Share Modal */}
            <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Share Post</DialogTitle>
                        <DialogDescription>Copy the link to share this post</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                            <Input
                                value={`${window.location.origin}/socials/${post.id}`}
                                readOnly
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(`${window.location.origin}/socials/${post.id}`)}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default function SocialsPage() {
    const {
        facebookPosts = [],
        instagramPosts = [],
        flash,
    } = usePage<SocialsProps>().props

    useEffect(() => {
        if ((flash as { success?: string })?.success) {
            toast.success((flash as { success?: string }).success!)
        }
    }, [(flash as { success?: string })?.success])

    const allPosts = [...facebookPosts, ...instagramPosts]

    return (
        <>
            <Head title="Social Media - Sora" />
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
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-muted-foreground mt-1">
                                            Manage your Facebook and Instagram posts
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline">
                                            <Link href="/socials/create" className="gap-2">
                                                <IconPlus className="size-4" />
                                                Create Post
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Tabs for Facebook/Instagram */}
                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="flex h-11 w-full max-w-[400px] gap-1 rounded-lg bg-muted p-1">
                                        <TabsTrigger
                                            value="all"
                                            className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <span className="truncate">All Posts</span>
                                            <span className="flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {allPosts.length}
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="facebook"
                                            className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <IconBrandFacebook className="size-4 shrink-0 text-blue-600" />
                                            <span className="truncate">Facebook</span>
                                            <span className="flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {facebookPosts.length}
                                            </span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="instagram"
                                            className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <IconBrandInstagram className="size-4 shrink-0 text-pink-600" />
                                            <span className="truncate">Instagram</span>
                                            <span className="flex shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 px-2 py-0.5 text-xs font-medium tabular-nums">
                                                {instagramPosts.length}
                                            </span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* All Posts Tab */}
                                    <TabsContent value="all" className="mt-6">
                                        {allPosts.length === 0 ? (
                                            <Card>
                                                <CardContent className="py-12 text-center">
                                                    <p className="text-muted-foreground">No posts yet. Create your first social media post.</p>
                                                    <Button asChild variant="outline" className="mt-4">
                                                        <Link href="/socials/create" className="gap-2">
                                                            <IconPlus className="size-4" />
                                                            Create Post
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {allPosts.map((post) => (
                                                    <PostCard key={post.id} post={post} />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Facebook Tab */}
                                    <TabsContent value="facebook" className="mt-6">
                                        {facebookPosts.length === 0 ? (
                                            <Card>
                                                <CardContent className="py-12 text-center">
                                                    <IconBrandFacebook className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                                                    <p className="text-muted-foreground">No Facebook posts yet.</p>
                                                    <Button asChild variant="outline" className="mt-4">
                                                        <Link href="/socials/create?platform=facebook" className="gap-2">
                                                            <IconPlus className="size-4" />
                                                            Create Facebook Post
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {facebookPosts.map((post) => (
                                                    <PostCard key={post.id} post={post} />
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Instagram Tab */}
                                    <TabsContent value="instagram" className="mt-6">
                                        {instagramPosts.length === 0 ? (
                                            <Card>
                                                <CardContent className="py-12 text-center">
                                                    <IconBrandInstagram className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                                                    <p className="text-muted-foreground">No Instagram posts yet.</p>
                                                    <Button asChild variant="outline" className="mt-4">
                                                        <Link href="/socials/create?platform=instagram" className="gap-2">
                                                            <IconPlus className="size-4" />
                                                            Create Instagram Post
                                                        </Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {instagramPosts.map((post) => (
                                                    <PostCard key={post.id} post={post} />
                                                ))}
                                            </div>
                                        )}
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
