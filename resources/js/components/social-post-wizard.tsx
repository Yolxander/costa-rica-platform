import { Button } from "@/components/ui/button"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { IconArrowLeft, IconArrowRight, IconBrandInstagram, IconBrandFacebook, IconEdit, IconSend, IconEye, IconSparkles } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const STEPS = [
    { id: 1, label: "Platform", icon: IconBrandInstagram },
    { id: 2, label: "Compose", icon: IconEdit },
    { id: 3, label: "Preview", icon: IconEye },
    { id: 4, label: "Publish", icon: IconSend },
]

interface Property {
    id: number
    name: string
    slug?: string
    discovery_page_enabled?: boolean
    discovery_page_url?: string
}

interface SocialPostWizardProps {
    properties: Property[]
    saveUrl?: string
    updateUrl?: string
    initialStep?: number
    initialPropertyId?: string
    initialIncludeDiscoveryLink?: boolean
}

export function SocialPostWizard({
    properties,
    saveUrl,
    updateUrl,
    initialStep,
    initialPropertyId,
    initialIncludeDiscoveryLink,
}: SocialPostWizardProps) {
    const [step, setStep] = useState(initialStep ?? 1)
    const [platform, setPlatform] = useState<"instagram" | "facebook">("instagram")
    const [propertyId, setPropertyId] = useState<string>(initialPropertyId ?? "")
    const [caption, setCaption] = useState("")
    const [hashtags, setHashtags] = useState("")
    const [location, setLocation] = useState("")
    const [scheduledAt, setScheduledAt] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isGenerating, setIsGenerating] = useState(false)
    const [includeDiscoveryLink, setIncludeDiscoveryLink] = useState(initialIncludeDiscoveryLink ?? false)

    const selectedProperty = propertyId
        ? properties.find((p) => p.id === Number(propertyId)) ?? null
        : null

    const canProceedFromStep1 = !!platform
    const canProceedFromStep2 = !!caption.trim()

    const goNext = () => {
        if (step === 1 && canProceedFromStep1) setStep(2)
        else if (step === 2 && canProceedFromStep2) setStep(3)
        else if (step === 3) setStep(4)
    }

    const goBack = () => {
        if (step === 2) setStep(1)
        else if (step === 3) setStep(2)
        else if (step === 4) setStep(3)
    }

    const handleSubmit = (e?: React.MouseEvent) => {
        e?.preventDefault()
        console.log("handleSubmit called, saveUrl:", saveUrl, "updateUrl:", updateUrl)

        const payload = {
            platform,
            property_id: propertyId ? Number(propertyId) : null,
            caption,
            hashtags,
            location,
            link_url: includeDiscoveryLink && selectedProperty?.discovery_page_url ? selectedProperty.discovery_page_url : null,
            scheduled_at: scheduledAt || null,
        }

        console.log("Submitting payload:", payload)

        setIsSubmitting(true)

        if (updateUrl) {
            router.put(updateUrl, payload, {
                onSuccess: () => {
                    toast.success("Post updated")
                    setIsSubmitting(false)
                },
                onError: (errors) => {
                    console.error("Update error:", errors)
                    toast.error("Failed to update post")
                    setIsSubmitting(false)
                },
            })
        } else if (saveUrl) {
            router.post(saveUrl, payload, {
                onSuccess: () => {
                    toast.success(scheduledAt ? "Post scheduled" : "Post published")
                    setIsSubmitting(false)
                },
                onError: (errors) => {
                    console.error("Save error:", errors)
                    toast.error("Failed to save post")
                    setIsSubmitting(false)
                },
            })
        } else {
            console.error("No saveUrl or updateUrl provided")
            toast.error("Configuration error: No URL provided")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1 sm:gap-4 flex-wrap">
                {STEPS.map((s, i) => {
                    const Icon = s.id === 1
                        ? (platform === "facebook" ? IconBrandFacebook : IconBrandInstagram)
                        : s.icon
                    return (
                        <div key={s.id} className="flex items-center">
                            <button
                                type="button"
                                onClick={() => step > s.id && setStep(s.id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                                    step === s.id
                                        ? "bg-primary text-primary-foreground"
                                        : step > s.id
                                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                                            : "bg-muted text-muted-foreground"
                                )}
                            >
                                <Icon className="size-4" />
                                <span className="hidden sm:inline">{s.label}</span>
                                <span className="sm:hidden">{s.id}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={cn(
                                        "mx-1 h-0.5 w-4 sm:w-8",
                                        step > s.id ? "bg-primary" : "bg-muted"
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step content */}
            <div className="space-y-4">
                {/* Step 1: Platform Selection */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Platform</CardTitle>
                            <CardDescription>Select where you want to publish your post</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <button
                                    onClick={() => setPlatform("instagram")}
                                    className={cn(
                                        "p-6 rounded-xl border-2 transition-all text-left",
                                        platform === "instagram"
                                            ? "border-pink-500 bg-pink-50/50"
                                            : "border-muted hover:border-muted-foreground/30"
                                    )}
                                >
                                    <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 w-fit mb-4">
                                        <div className="rounded-full bg-white p-1.5">
                                            <IconBrandInstagram className="h-6 w-6 text-pink-600" />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold mb-1">Instagram</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Share photos and stories with your followers
                                    </p>
                                </button>

                                <button
                                    onClick={() => setPlatform("facebook")}
                                    className={cn(
                                        "p-6 rounded-xl border-2 transition-all text-left",
                                        platform === "facebook"
                                            ? "border-blue-500 bg-blue-50/50"
                                            : "border-muted hover:border-muted-foreground/30"
                                    )}
                                >
                                    <IconBrandFacebook className="h-8 w-8 text-blue-600 mb-4" />
                                    <h3 className="font-semibold mb-1">Facebook</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Post to your page and reach your audience
                                    </p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Compose */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Post</CardTitle>
                            <CardDescription>Add your caption, hashtags, and select a property</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Property Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="property">Property (Optional)</Label>
                                <Select
                                    value={propertyId}
                                    onValueChange={setPropertyId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a property" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {properties.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Caption */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="caption">Caption</Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsGenerating(true)
                                            // Simulate AI generation
                                            setTimeout(() => {
                                                const propertyName = selectedProperty?.name || "this beautiful property"
                                                setCaption(`Discover the magic of ${propertyName}! 🏡✨\n\nPerfect for your next getaway with stunning views and all the amenities you need for a memorable stay.`)
                                                setHashtags("#vacation #travel #airbnb #vrbo #costarica #puravida #holiday #rental #property")
                                                setIsGenerating(false)
                                                toast.success("Caption generated!")
                                            }, 1500)
                                        }}
                                        disabled={isGenerating}
                                        className="gap-1 text-xs"
                                    >
                                        <IconSparkles className="h-3.5 w-3.5" />
                                        {isGenerating ? "Generating..." : "Generate with AI"}
                                    </Button>
                                </div>
                                <Textarea
                                    id="caption"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write your post caption..."
                                    rows={4}
                                />
                            </div>

                            {/* Hashtags */}
                            <div className="space-y-2">
                                <Label htmlFor="hashtags">Hashtags</Label>
                                <Input
                                    id="hashtags"
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    placeholder="#vacation #rental #travel"
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location (Optional)</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Add location"
                                />
                            </div>

                            {/* Discovery Page Link */}
                            {selectedProperty?.discovery_page_enabled && selectedProperty?.discovery_page_url && (
                                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="discovery-link"
                                        checked={includeDiscoveryLink}
                                        onChange={(e) => setIncludeDiscoveryLink(e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="discovery-link" className="text-sm cursor-pointer">
                                        Include Discovery Page link
                                    </Label>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        ({selectedProperty.discovery_page_url})
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Preview */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>Review your post before publishing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    {platform === "instagram" ? (
                                        <IconBrandInstagram className="h-5 w-5 text-pink-600" />
                                    ) : (
                                        <IconBrandFacebook className="h-5 w-5 text-blue-600" />
                                    )}
                                    <span className="font-medium capitalize">{platform}</span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">
                                    {caption || "Your caption will appear here..."}
                                </p>
                                {hashtags && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {hashtags}
                                    </p>
                                )}
                                {selectedProperty && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Property: {selectedProperty.name}
                                    </p>
                                )}
                                {includeDiscoveryLink && selectedProperty?.discovery_page_url && (
                                    <p className="text-sm text-primary mt-2">
                                        Link: {selectedProperty.discovery_page_url}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Publish */}
                {step === 4 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule or Publish</CardTitle>
                            <CardDescription>Choose when to publish your post</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Post Now */}
                            <button
                                onClick={() => setScheduledAt("")}
                                className={cn(
                                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                                    !scheduledAt
                                        ? "border-primary bg-primary/5"
                                        : "border-muted hover:border-muted-foreground/30"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <IconSend className="h-5 w-5" />
                                    <div>
                                        <h4 className="font-medium">Post Now</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Publish immediately to {platform}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Schedule */}
                            <button
                                onClick={() => {
                                    if (!scheduledAt) {
                                        const tomorrow = new Date()
                                        tomorrow.setDate(tomorrow.getDate() + 1)
                                        setScheduledAt(tomorrow.toISOString().slice(0, 16))
                                    }
                                }}
                                className={cn(
                                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                                    scheduledAt
                                        ? "border-primary bg-primary/5"
                                        : "border-muted hover:border-muted-foreground/30"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <IconArrowRight className="h-5 w-5" />
                                    <div>
                                        <h4 className="font-medium">Schedule</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Choose a date and time
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {scheduledAt && (
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="schedule-time">Schedule Date & Time</Label>
                                    <Input
                                        id="schedule-time"
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                    <Button
                        variant="outline"
                        onClick={goBack}
                        disabled={step === 1}
                    >
                        <IconArrowLeft className="mr-2 size-4" />
                        Back
                    </Button>
                    {step < 4 ? (
                        <Button
                            onClick={goNext}
                            disabled={
                                (step === 1 && !canProceedFromStep1) ||
                                (step === 2 && !canProceedFromStep2)
                            }
                        >
                            Next
                            <IconArrowRight className="mr-2 size-4" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !caption.trim()}
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !caption.trim()}
                                className="gap-2"
                            >
                                <IconSend className="size-4" />
                                {isSubmitting
                                    ? "Publishing..."
                                    : scheduledAt
                                        ? "Schedule Post"
                                        : "Publish Now"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
