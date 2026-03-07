import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Head, usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialPostWizard } from "@/components/social-post-wizard"
import { EmailCampaignWizard } from "@/components/email-campaign-wizard"
import type { PropertyForSocial } from "@/components/social-image-picker"
import { IconMail, IconBrandInstagram } from "@tabler/icons-react"
import { toast } from "sonner"
import { useState, useEffect, useCallback } from "react"

function getCsrfToken(): string {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    if (meta?.content) return meta.content
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ''
}

interface MarketingProps extends SharedData {
    properties: PropertyForSocial[]
    emailSegments: Record<string, number>
    emailPropertyCounts: Record<number, number>
}

function truncate(str: string, maxLen: number): string {
    if (!str || str.length <= maxLen) return str
    return str.slice(0, maxLen).trim() + "..."
}

function generateCaption(property: PropertyForSocial): string {
    const listingUrl = typeof window !== "undefined"
        ? `${window.location.origin}/listing/${property.id}`
        : `/listing/${property.id}`
    const desc = truncate(property.description || "", 120)
    const amenities = (property.amenities || []).slice(0, 3)
    const amenityStr = amenities.length > 0 ? amenities.join(", ") : ""

    const parts: string[] = []
    parts.push(`Escape to ${property.name} in ${property.location}.`)
    if (desc) parts.push(desc)
    if (amenityStr) parts.push(`Amenities: ${amenityStr}.`)
    parts.push(`Book direct: ${listingUrl}`)

    return parts.join(" ")
}

const BASE_HASHTAGS = ["#CostaRica", "#PuraVida", "#CostaRicaTravel"]
const KNOWN_LOCATIONS = [
    "Tamarindo", "Manuel Antonio", "Guanacaste", "Nosara", "San Jose", "San José",
    "Jaco", "Monteverde", "Uvita", "Puerto Viejo", "La Fortuna", "Playa Flamingo",
    "Playa Conchal", "Santa Teresa", "Cahuita", "Tortuguero", "Arenal",
]

function generateHashtags(property: PropertyForSocial): string {
    const location = (property.location || "").toLowerCase()
    const locationHashtags: string[] = []

    for (const place of KNOWN_LOCATIONS) {
        if (location.includes(place.toLowerCase().replace("ó", "o"))) {
            const tag = "#" + place.replace(/\s/g, "")
            if (!locationHashtags.includes(tag)) {
                locationHashtags.push(tag)
            }
        }
    }

    const all = [...BASE_HASHTAGS, ...locationHashtags, "#CostaRicaRental", "#VacationRental"]
    return [...new Set(all)].join(" ")
}

export default function MarketingPage() {
    const { properties, emailSegments = {}, emailPropertyCounts = {}, auth } = usePage<MarketingProps>().props
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
        properties.length > 0 ? properties[0].id : null
    )
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const [caption, setCaption] = useState("")
    const [hashtags, setHashtags] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const selectedProperty = properties.find((p) => p.id === selectedPropertyId) ?? null

    const refreshCaptionFromProperty = useCallback((property: PropertyForSocial | null) => {
        if (!property) {
            setCaption("")
            setHashtags(BASE_HASHTAGS.join(" ") + " #CostaRicaRental #VacationRental")
            return
        }
        setCaption(generateCaption(property))
        setHashtags(generateHashtags(property))
    }, [])

    useEffect(() => {
        refreshCaptionFromProperty(selectedProperty)
    }, [selectedProperty, refreshCaptionFromProperty])

    const handlePropertyChange = (propertyId: number | null) => {
        setSelectedPropertyId(propertyId)
        setSelectedImages([])
        const prop = propertyId ? properties.find((p) => p.id === propertyId) ?? null : null
        refreshCaptionFromProperty(prop)
    }

    const handleGenerateWithAI = useCallback(async () => {
        if (!selectedPropertyId) return
        setIsGenerating(true)
        try {
            const res = await fetch("/marketing/social/generate-caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ property_id: selectedPropertyId }),
            })
            const data = await res.json()
            if (res.ok && data.caption) {
                setCaption(data.caption)
                toast.success("Caption generated")
            } else {
                toast.error(data.error || "Failed to generate caption")
            }
        } catch {
            toast.error("Failed to generate caption. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }, [selectedPropertyId])

    return (
        <>
            <Head title="Marketing - Brisa" />
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
                                <Tabs defaultValue="social" className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                        <div>
                                            <h1 className="text-2xl font-bold">Marketing</h1>
                                            <p className="text-muted-foreground">
                                                Email campaigns and social content tools
                                            </p>
                                        </div>
                                        <TabsList>
                                            <TabsTrigger value="email" className="gap-2">
                                                <IconMail className="size-4" />
                                                Email
                                            </TabsTrigger>
                                            <TabsTrigger value="social" className="gap-2">
                                                <IconBrandInstagram className="size-4" />
                                                Social
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="email" className="mt-6">
                                        <EmailCampaignWizard
                                            segments={emailSegments}
                                            propertyCounts={emailPropertyCounts}
                                            properties={properties}
                                            hostName={auth?.user?.name}
                                        />
                                    </TabsContent>

                                    <TabsContent value="social" className="mt-6">
                                        <SocialPostWizard
                                            properties={properties}
                                            selectedPropertyId={selectedPropertyId}
                                            onPropertyChange={handlePropertyChange}
                                            selectedImages={selectedImages}
                                            onSelectionChange={setSelectedImages}
                                            caption={caption}
                                            hashtags={hashtags}
                                            onCaptionChange={setCaption}
                                            onHashtagsChange={setHashtags}
                                            onGenerateWithAI={handleGenerateWithAI}
                                            isGenerating={isGenerating}
                                        />
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
