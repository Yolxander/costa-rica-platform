import { Button } from "@/components/ui/button"
import { useState, useCallback } from "react"
import { router } from "@inertiajs/react"
import { IconArrowLeft, IconArrowRight, IconUsers, IconEdit, IconEye, IconDeviceFloppy } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { EmailAudienceStep, type EmailSegmentId } from "./email-audience-step"
import { EmailComposeStep } from "./email-compose-step"
import { EmailPreviewStep } from "./email-preview-step"
import type { ChatMessage } from "./email-blank-chat"
import {
    EMAIL_TEMPLATES,
    type EmailTemplateId,
    type EmailTemplateParams,
} from "@/data/email-templates"

const STEPS = [
    { id: 1, label: "Audience", icon: IconUsers },
    { id: 2, label: "Compose", icon: IconEdit },
    { id: 3, label: "Preview", icon: IconEye },
]

export interface PropertyForEmail {
    id: number
    slug: string
    name: string
    location: string
    description?: string
    images?: string[]
    guests?: number
    rating?: number | null
}

interface InitialCampaign {
    id: number
    subject: string
    body: string
    segment_type: string
    property_id: number | null
    recipient_count: number
}

interface EmailCampaignWizardProps {
    segments: Record<string, number>
    propertyCounts: Record<number, number>
    properties: PropertyForEmail[]
    hostName?: string
    /** When provided, step 3 shows "Save draft" that POSTs to this URL */
    saveUrl?: string
    /** When editing, PUT to this URL instead of POST to saveUrl */
    updateUrl?: string
    /** Prefill wizard for edit mode */
    initialCampaign?: InitialCampaign | null
    /** Start on this step (e.g. 3 for preview) */
    initialStep?: number
}

function getCsrfToken(): string {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    if (meta?.content) return meta.content
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[1]) : ""
}

function getListingUrl(slug: string): string {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/${slug}`
    }
    return `/${slug}`
}

export function EmailCampaignWizard({
    segments,
    propertyCounts,
    properties,
    hostName = "Your name",
    saveUrl,
    updateUrl,
    initialCampaign,
    initialStep,
}: EmailCampaignWizardProps) {
    const init = initialCampaign ?? null
    const [step, setStep] = useState(initialStep ?? 1)
    const [segmentId, setSegmentId] = useState<EmailSegmentId | "">(
        (init?.segment_type as EmailSegmentId) ?? ""
    )
    const [propertyId, setPropertyId] = useState<number | null>(init?.property_id ?? null)
    const [subject, setSubject] = useState(init?.subject ?? "")
    const [templateId, setTemplateId] = useState<EmailTemplateId>("blank")
    const [html, setHtml] = useState<string>(init?.body ?? EMAIL_TEMPLATES.blank.html)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isConfirming, setIsConfirming] = useState(false)

    const recipientCount = (() => {
        if (segmentId === "by_property" && propertyId) return propertyCounts[propertyId] ?? 0
        if (segmentId && segmentId in segments) return segments[segmentId] ?? 0
        return 0
    })()

    const selectedProperty = propertyId
        ? properties.find((p) => p.id === propertyId) ?? null
        : properties[0] ?? null

    const templateParams: EmailTemplateParams = {
        FIRST_NAME: "there",
        HOST_NAME: hostName,
        PROPERTY_NAME: selectedProperty?.name ?? "your favorite rental",
        PROPERTY_LOCATION: selectedProperty?.location ?? "Costa Rica",
        PROPERTY_DESCRIPTION: selectedProperty?.description
            ? selectedProperty.description.slice(0, 200) + "..."
            : "",
        PROPERTY_IMAGE: selectedProperty?.images?.[0] ?? "",
        LISTING_URL: selectedProperty ? getListingUrl(selectedProperty.slug) : "",
        MAX_GUESTS: selectedProperty?.guests?.toString() ?? "",
        RATING: selectedProperty?.rating?.toString() ?? "",
        AVAILABLE_DATES: "",
        CUSTOM_BODY: templateId === "blank" && html.includes("CUSTOM_BODY")
            ? "<p><em>Add content or generate with AI</em></p>"
            : undefined,
    }

    const handleTemplateChange = useCallback((id: string) => {
        setTemplateId(id as EmailTemplateId)
        setChatMessages([])
        setPendingPrompt(null)
        const t = EMAIL_TEMPLATES[id as EmailTemplateId]
        if (t) {
            setSubject(t.subject)
            setHtml(t.html)
        }
    }, [])

    const handleChatSend = useCallback(async (prompt: string) => {
        setChatMessages((prev) => [...prev, { role: "user", content: prompt }])
        setPendingPrompt(prompt)
        setIsGenerating(true)
        try {
            const res = await fetch("/marketing/email/understand", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ prompt }),
            })
            const data = await res.json()
            if (res.ok && data.summary) {
                const fullSummary = `${data.summary}\n\nShould I proceed to create the email?`
                setChatMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        type: "summary",
                        content: fullSummary,
                        showConfirm: true,
                    },
                ])
            } else {
                toast.error(data.error || "Failed to understand")
                setChatMessages((prev) => prev.slice(0, -1))
                setPendingPrompt(null)
            }
        } catch {
            toast.error("Failed to understand. Please try again.")
            setChatMessages((prev) => prev.slice(0, -1))
            setPendingPrompt(null)
        } finally {
            setIsGenerating(false)
        }
    }, [])

    const handleChatConfirm = useCallback(async () => {
        if (!pendingPrompt) return
        setIsConfirming(true)
        try {
            const res = await fetch("/marketing/email/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": getCsrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    prompt: pendingPrompt,
                    property_id: selectedProperty?.id ?? null,
                }),
            })
            const data = await res.json()
            if (res.ok && data.html) {
                setHtml(data.html)
                if (data.subject) setSubject(data.subject)
                setChatMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        type: "ready",
                        content: "The email was created. You can click the \"Next\" button on the bottom right to continue.",
                    },
                ])
                setPendingPrompt(null)
                toast.success("Email created")
            } else {
                toast.error(data.error || "Failed to generate")
            }
        } catch {
            toast.error("Failed to generate. Please try again.")
        } finally {
            setIsConfirming(false)
        }
    }, [pendingPrompt, selectedProperty?.id])

    const handleChatDecline = useCallback(() => {
        setChatMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                type: "declined",
                content: "No problem. You can describe your email again below.",
            },
        ])
        setPendingPrompt(null)
    }, [])

    const canProceedFromStep1 = !!segmentId && !!propertyId
    const hasGeneratedBlank = chatMessages.some(
        (m) => m.role === "assistant" && m.type === "ready"
    )
    const canProceedFromStep2 =
        !!subject.trim() &&
        !!html.trim() &&
        (templateId !== "blank" || hasGeneratedBlank)

    const goNext = () => {
        if (step === 1 && canProceedFromStep1) setStep(2)
        else if (step === 2 && canProceedFromStep2) setStep(3)
    }

    const goBack = () => {
        if (step === 2) setStep(1)
        else if (step === 3) setStep(2)
    }

    const handleSaveDraft = () => {
        const payload = {
            segment_id: segmentId,
            property_id: propertyId,
            subject,
            body: html,
            recipient_count: recipientCount,
        }
        if (updateUrl) {
            if (!segmentId || !propertyId) return
            router.put(updateUrl, payload)
        } else if (saveUrl) {
            if (!segmentId || !propertyId) return
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
                    <EmailAudienceStep
                        segmentId={segmentId}
                        onSegmentChange={setSegmentId}
                        propertyId={propertyId}
                        onPropertyChange={setPropertyId}
                        segments={segments}
                        propertyCounts={propertyCounts}
                        properties={properties.map((p) => ({ id: p.id, name: p.name }))}
                    />
                )}

                {step === 2 && (
                    <EmailComposeStep
                        subject={subject}
                        onSubjectChange={setSubject}
                        html={html}
                        onHtmlChange={setHtml}
                        templateId={templateId}
                        onTemplateChange={handleTemplateChange}
                        senderName={hostName}
                        chatMessages={chatMessages}
                        onChatSend={handleChatSend}
                        onChatConfirm={handleChatConfirm}
                        onChatDecline={handleChatDecline}
                        isGenerating={isGenerating}
                        isConfirming={isConfirming}
                    />
                )}

                {step === 3 && (
                    <EmailPreviewStep
                        subject={subject}
                        html={html}
                        recipientCount={recipientCount}
                        params={templateParams}
                        selectedPropertyName={selectedProperty?.name}
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
                            <IconArrowRight className="mr-2 size-4" />
                        </Button>
                    ) : (saveUrl || updateUrl) ? (
                        <Button onClick={handleSaveDraft} className="gap-2">
                            <IconDeviceFloppy className="size-4" />
                            {updateUrl ? "Update" : "Save draft"}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setStep(1)}
                        >
                            Create another campaign
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
