import { Button } from "@/components/ui/button"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { IconArrowLeft, IconArrowRight, IconPhoto, IconEdit, IconEye, IconDeviceFloppy } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { SocialImagePicker, type PropertyForSocial } from "./social-image-picker"
import { CaptionDisplay } from "./caption-display"
import { SocialPostPreview } from "./social-post-preview"

const STEPS = [
    { id: 1, label: "Select images", icon: IconPhoto },
    { id: 2, label: "Caption & hashtags", icon: IconEdit },
    { id: 3, label: "Preview", icon: IconEye },
]

interface SocialPostWizardProps {
    properties: PropertyForSocial[]
    selectedPropertyId: number | null
    onPropertyChange: (propertyId: number | null) => void
    selectedImages: string[]
    onSelectionChange: (images: string[]) => void
    caption: string
    hashtags: string
    onCaptionChange: (value: string) => void
    onHashtagsChange: (value: string) => void
    onGenerateWithAI?: () => void
    isGenerating?: boolean
    /** When provided, step 3 shows "Save post" that POSTs to this URL with getSavePayload() */
    saveUrl?: string
    /** When editing, PUT to this URL instead of POST */
    updateUrl?: string
    getSavePayload?: () => { property_id: number | null; images: string[]; caption: string; hashtags: string; location: string }
    /** Start on this step (e.g. 3 for preview) */
    initialStep?: number
    /** Override location for preview when property is null (e.g. from saved post) */
    locationForPreview?: string
}

export function SocialPostWizard({
    properties,
    selectedPropertyId,
    onPropertyChange,
    selectedImages,
    onSelectionChange,
    caption,
    hashtags,
    onCaptionChange,
    onHashtagsChange,
    onGenerateWithAI,
    isGenerating = false,
    saveUrl,
    updateUrl,
    getSavePayload,
    initialStep,
    locationForPreview,
}: SocialPostWizardProps) {
    const [step, setStep] = useState(initialStep ?? 1)

    const selectedProperty = properties.find((p) => p.id === selectedPropertyId) ?? null

    const canProceedFromStep1 = selectedImages.length > 0
    const canProceedFromStep2 = true

    const goNext = () => {
        if (step === 1 && canProceedFromStep1) setStep(2)
        else if (step === 2) setStep(3)
    }

    const goBack = () => {
        if (step === 2) setStep(1)
        else if (step === 3) setStep(2)
    }

    const handleSavePost = () => {
        if (!getSavePayload) return
        const payload = getSavePayload()
        if (updateUrl) {
            router.put(updateUrl, payload)
        } else if (saveUrl) {
            router.post(saveUrl, payload)
        }
    }

    return (
        <div className="space-y-4">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-1 sm:gap-4 flex-wrap">
                {STEPS.map((s, i) => (
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
                            <s.icon className="size-4" />
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
                ))}
            </div>

            {/* Step content */}
            <div className="space-y-4">
                {step === 1 && (
                    <SocialImagePicker
                            properties={properties}
                            selectedPropertyId={selectedPropertyId}
                            onPropertyChange={onPropertyChange}
                            selectedImages={selectedImages}
                            onSelectionChange={onSelectionChange}
                        />
                )}

                {step === 2 && (
                        <CaptionDisplay
                            property={selectedProperty}
                            caption={caption}
                            hashtags={hashtags}
                            onCaptionChange={onCaptionChange}
                            onHashtagsChange={onHashtagsChange}
                            onGenerateWithAI={onGenerateWithAI}
                            isGenerating={isGenerating}
                        />
                )}

                {step === 3 && (
                                        <SocialPostPreview
                                            selectedImages={selectedImages}
                                            caption={caption}
                                            hashtags={hashtags}
                                            location={selectedProperty?.location ?? locationForPreview}
                                        />
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
                        {step < 3 ? (
                            <Button
                                onClick={goNext}
                                disabled={
                                    (step === 1 && !canProceedFromStep1) ||
                                    (step === 2 && !canProceedFromStep2)
                                }
                            >
                                Next
                                <IconArrowRight className="ml-2 size-4" />
                            </Button>
                        ) : (saveUrl || updateUrl) && getSavePayload ? (
                            <Button onClick={handleSavePost} className="gap-2">
                                <IconDeviceFloppy className="size-4" />
                                {updateUrl ? "Update" : "Save post"}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Create another post
                            </Button>
                        )}
                </div>
            </div>
        </div>
    )
}
