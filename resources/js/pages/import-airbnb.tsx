import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    IconDownload,
    IconArrowLeft,
    IconLoader2,
    IconPhoto,
    IconMapPin,
    IconBed,
    IconBath,
    IconUsers,
    IconStar,
    IconCircleCheck,
    IconAlertCircle,
    IconEdit,
} from "@tabler/icons-react"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

interface ImportedData {
    name: string | null
    description: string | null
    images: string[]
    location: string | null
    type: string
    base_price: number
    currency: string
    guests: number
    bedrooms: number
    bathrooms: number
    amenities: string[]
    rating: number
    reviews: number
}

export default function ImportAirbnbPage() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<ImportedData | null>(null)

    // Editable fields after preview
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editLocation, setEditLocation] = useState("")
    const [editType, setEditType] = useState("")
    const [editPrice, setEditPrice] = useState(0)
    const [editGuests, setEditGuests] = useState(1)
    const [editBedrooms, setEditBedrooms] = useState(1)
    const [editBathrooms, setEditBathrooms] = useState(1)

    function normalizeAirbnbUrl(input: string): string {
        try {
            const url = new URL(input.trim())
            const match = url.pathname.match(/\/rooms\/(\d+)/)
            if (match) {
                return `${url.protocol}//${url.hostname}/rooms/${match[1]}`
            }
        } catch {
            /* invalid URL */
        }
        return input.trim()
    }

    async function handlePreview(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setPreview(null)
        setLoading(true)

        const normalizedUrl = normalizeAirbnbUrl(url)
        if (!normalizedUrl) {
            setError("Please enter a valid Airbnb listing URL.")
            setLoading(false)
            return
        }

        try {
            const csrfToken =
                document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
                (() => {
                    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
                    return match ? decodeURIComponent(match[1]) : ""
                })()
            const res = await fetch("/import-airbnb/preview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ url: normalizedUrl }),
                credentials: "same-origin",
            })

            let json: Record<string, unknown>
            try {
                json = (await res.json()) as Record<string, unknown>
            } catch {
                setError(res.status === 419 ? "Session expired. Please refresh the page and try again." : "An unexpected error occurred. Please try again.")
                return
            }

            if (!res.ok || !json.success) {
                const validationErrors = json.errors as Record<string, string[]> | undefined
                if (validationErrors) {
                    const firstError = (Object.values(validationErrors).flat()[0] as string) || "Invalid URL. Please check the Airbnb listing URL."
                    setError(firstError)
                } else {
                    setError((json.error as string) || "Failed to import listing.")
                }
                toast.error("Could not import listing")
                return
            }

            const data = json.data as ImportedData
            setPreview(data)
            setEditName(data.name ?? "")
            setEditDescription(data.description ?? "")
            setEditLocation(data.location ?? "")
            setEditType(data.type)
            setEditPrice(data.base_price)
            setEditGuests(data.guests)
            setEditBedrooms(data.bedrooms)
            setEditBathrooms(data.bathrooms)
        } catch {
            setError("A network error occurred. Please check your connection and try again.")
            toast.error("Import failed")
        } finally {
            setLoading(false)
        }
    }

    function handleConfirmImport() {
        if (!preview) return
        setSaving(true)

        router.post(
            "/import-airbnb",
            {
                name: editName,
                description: editDescription,
                type: editType,
                location: editLocation,
                base_price: editPrice,
                currency: preview.currency,
                guests: editGuests,
                bedrooms: editBedrooms,
                bathrooms: editBathrooms,
                amenities: preview.amenities,
                images: preview.images,
                rating: preview.rating,
                reviews: preview.reviews,
            },
            {
                onSuccess: () => {
                    toast.success("Listing imported successfully!")
                },
                onError: (errors) => {
                    const firstError = Object.values(errors).flat()[0] as string
                    setError(firstError)
                    setSaving(false)
                },
                onFinish: () => {
                    setSaving(false)
                },
            },
        )
    }

    function handleReset() {
        setPreview(null)
        setError(null)
        setUrl("")
    }

    return (
        <>
            <Head title="Import from Airbnb - Brisa" />
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

                                {/* Step 1: URL Input */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <IconDownload className="size-6 text-primary" />
                                            <CardTitle>Import from Airbnb</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Paste your Airbnb listing URL and we&apos;ll import photos, title, description, and amenities. Some listings may not import if Airbnb blocks automated access—you can add those manually.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handlePreview} className="space-y-4">
                                            <div>
                                                <Label htmlFor="airbnb-url">Airbnb Listing URL</Label>
                                                <Input
                                                    id="airbnb-url"
                                                    type="url"
                                                    placeholder="https://www.airbnb.com/rooms/12345"
                                                    className="mt-2"
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    disabled={loading || !!preview}
                                                    required
                                                />
                                            </div>

                                            {error && (
                                                <Alert variant="destructive">
                                                    <IconAlertCircle className="size-4" />
                                                    <AlertDescription>{error}</AlertDescription>
                                                </Alert>
                                            )}

                                            {!preview && (
                                                <Button type="submit" disabled={loading || !url.trim()}>
                                                    {loading ? (
                                                        <>
                                                            <IconLoader2 className="mr-2 size-4 animate-spin" />
                                                            Fetching listing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IconDownload className="mr-2 size-4" />
                                                            Import Listing
                                                        </>
                                                    )}
                                                </Button>
                                            )}

                                            {preview && (
                                                <Button type="button" variant="outline" onClick={handleReset}>
                                                    <IconArrowLeft className="mr-2 size-4" />
                                                    Import a different listing
                                                </Button>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Step 2: Preview & Edit */}
                                {preview && (
                                    <Card className="mt-6">
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <IconCircleCheck className="size-6 text-green-500" />
                                                <CardTitle>Listing Preview</CardTitle>
                                            </div>
                                            <CardDescription>
                                                Review and edit the imported data before saving. You can modify any field below.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Images */}
                                            {preview.images.length > 0 && (
                                                <div>
                                                    <Label className="mb-2 flex items-center gap-1">
                                                        <IconPhoto className="size-4" />
                                                        Photos ({preview.images.length})
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                                        {preview.images.slice(0, 8).map((img, i) => (
                                                            <div
                                                                key={i}
                                                                className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`Photo ${i + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = "none"
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {preview.images.length > 8 && (
                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            +{preview.images.length - 8} more photos will be imported
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <Separator />

                                            {/* Editable Fields */}
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="edit-name">
                                                        <IconEdit className="mr-1 inline size-3.5" />
                                                        Listing Name
                                                    </Label>
                                                    <Input
                                                        id="edit-name"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="edit-description">Description</Label>
                                                    <textarea
                                                        id="edit-description"
                                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-location">
                                                        <IconMapPin className="mr-1 inline size-3.5" />
                                                        Location
                                                    </Label>
                                                    <Input
                                                        id="edit-location"
                                                        value={editLocation}
                                                        onChange={(e) => setEditLocation(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-type">Property Type</Label>
                                                    <Input
                                                        id="edit-type"
                                                        value={editType}
                                                        onChange={(e) => setEditType(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-price">
                                                        Nightly Price ({preview.currency})
                                                        {preview.base_price <= 0 && (
                                                            <span className="ml-1 text-muted-foreground font-normal">
                                                                — enter manually if not detected
                                                            </span>
                                                        )}
                                                    </Label>
                                                    <Input
                                                        id="edit-price"
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        placeholder="e.g. 150"
                                                        value={editPrice || ""}
                                                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-guests">
                                                        <IconUsers className="mr-1 inline size-3.5" />
                                                        Max Guests
                                                    </Label>
                                                    <Input
                                                        id="edit-guests"
                                                        type="number"
                                                        min={1}
                                                        value={editGuests}
                                                        onChange={(e) => setEditGuests(parseInt(e.target.value) || 1)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-bedrooms">
                                                        <IconBed className="mr-1 inline size-3.5" />
                                                        Bedrooms
                                                    </Label>
                                                    <Input
                                                        id="edit-bedrooms"
                                                        type="number"
                                                        min={0}
                                                        value={editBedrooms}
                                                        onChange={(e) => setEditBedrooms(parseInt(e.target.value) || 0)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-bathrooms">
                                                        <IconBath className="mr-1 inline size-3.5" />
                                                        Bathrooms
                                                    </Label>
                                                    <Input
                                                        id="edit-bathrooms"
                                                        type="number"
                                                        min={1}
                                                        value={editBathrooms}
                                                        onChange={(e) => setEditBathrooms(parseInt(e.target.value) || 1)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Amenities */}
                                            {preview.amenities.length > 0 && (
                                                <div>
                                                    <Label className="mb-2 block">Amenities</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {preview.amenities.map((amenity, i) => (
                                                            <Badge key={i} variant="secondary">
                                                                {amenity}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rating */}
                                            {preview.rating > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium text-foreground">{preview.rating.toFixed(2)}</span>
                                                    <span>({preview.reviews} reviews)</span>
                                                </div>
                                            )}

                                            <Separator />

                                            {/* Actions */}
                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={handleConfirmImport}
                                                    disabled={saving || !editName.trim()}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <IconLoader2 className="mr-2 size-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IconCircleCheck className="mr-2 size-4" />
                                                            Confirm &amp; Save Listing
                                                        </>
                                                    )}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={handleReset}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}
