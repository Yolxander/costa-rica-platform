import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconEye, IconMail, IconSend } from "@tabler/icons-react"
import { toast } from "sonner"
import {
    substituteParams,
    buildPropertyImageHtml,
    type EmailTemplateParams,
} from "@/data/email-templates"

interface EmailPreviewStepProps {
    subject: string
    html: string
    recipientCount: number
    params?: EmailTemplateParams
    /** Selected property name from Audience step — ensures {{ params.PROPERTY_NAME }} is replaced correctly */
    selectedPropertyName?: string | null
}

export function EmailPreviewStep({
    subject,
    html,
    recipientCount,
    params = {},
    selectedPropertyName,
}: EmailPreviewStepProps) {
    const propertyName = selectedPropertyName ?? params.PROPERTY_NAME ?? "your favorite rental"
    const mergedParams = useMemo(
        () => ({
            ...params,
            PROPERTY_NAME: propertyName,
        }),
        [params, propertyName]
    )

    const replacePropertyName = (str: string) =>
        str.replace(/\{\{\s*params\.PROPERTY_NAME\s*\}\}/g, propertyName)

    const previewHtml = useMemo(() => {
        const withImage = mergedParams.PROPERTY_IMAGE
            ? html.replace(
                /\{\{\s*params\.PROPERTY_IMAGE\s*\}\}/g,
                buildPropertyImageHtml(mergedParams.PROPERTY_IMAGE as string)
            )
            : html.replace(
                /\{\{\s*params\.PROPERTY_IMAGE\s*\}\}/g,
                ""
            )
        return replacePropertyName(substituteParams(withImage, mergedParams))
    }, [html, mergedParams, propertyName])

    const previewSubject = useMemo(
        () => replacePropertyName(substituteParams(subject, mergedParams)),
        [subject, mergedParams, propertyName]
    )

    const handleTestSend = () => {
        toast.info("Test send coming soon — email delivery not yet configured.")
    }

    const handleSendNow = () => {
        toast.info("Send now coming soon — email delivery not yet configured.")
    }

    const handleSchedule = () => {
        toast.info("Schedule coming soon — email delivery not yet configured.")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconEye className="size-5" />
                    Preview & send
                </CardTitle>
                <CardDescription>
                    Review your email and send or schedule
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
                    {/* Email preview - iframe for HTML */}
                    <div className="rounded-lg border bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                        <div className="border-b px-4 py-3 bg-muted/50">
                            <p className="text-xs text-muted-foreground">Subject</p>
                            <p className="font-medium">{previewSubject || "(No subject)"}</p>
                        </div>
                        <div className="min-h-[400px]">
                            <iframe
                                title="Email preview"
                                srcDoc={previewHtml}
                                className="w-full h-[420px] border-0 bg-white"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 flex flex-col">
                        <p className="text-sm font-medium">{recipientCount} recipient{recipientCount !== 1 ? "s" : ""}</p>
                        <Button variant="outline" onClick={handleTestSend} className="w-full sm:w-auto">
                            <IconMail className="mr-2 size-4" />
                            Send test
                        </Button>
                        <Button onClick={handleSendNow} className="w-full sm:w-auto" disabled={recipientCount === 0}>
                            <IconSend className="mr-2 size-4" />
                            Send now
                        </Button>
                        <Button variant="outline" onClick={handleSchedule} disabled={recipientCount === 0}>
                            Schedule
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Email delivery (SMTP / Resend) will be configured in a future update.
                </p>
            </CardContent>
        </Card>
    )
}
