import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { IconEdit } from "@tabler/icons-react"
import { EMAIL_TEMPLATES, type EmailTemplateId } from "@/data/email-templates"
import { EmailBlankChat, type ChatMessage } from "./email-blank-chat"

interface EmailComposeStepProps {
    subject: string
    onSubjectChange: (v: string) => void
    html: string
    onHtmlChange: (v: string) => void
    templateId: string
    onTemplateChange: (id: string) => void
    senderName?: string
    selectedPropertyName?: string | null
    selectedPropertyId?: number | null
    chatMessages?: ChatMessage[]
    onChatSend?: (prompt: string) => void
    onChatConfirm?: () => void
    onChatDecline?: () => void
    isGenerating?: boolean
    isConfirming?: boolean
}

export function EmailComposeStep({
    subject,
    onSubjectChange,
    html,
    onHtmlChange,
    templateId,
    onTemplateChange,
    senderName = "Your name",
    selectedPropertyName,
    selectedPropertyId,
    chatMessages = [],
    onChatSend,
    onChatConfirm,
    onChatDecline,
    isGenerating = false,
    isConfirming = false,
}: EmailComposeStepProps) {
    const applyTemplate = (id: string) => {
        onTemplateChange(id)
        const t = EMAIL_TEMPLATES[id as EmailTemplateId]
        if (t) {
            onSubjectChange(t.subject)
            onHtmlChange(t.html)
        }
    }

    const isBlank = templateId === "blank"

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconEdit className="size-5" />
                    Compose email
                </CardTitle>
                <CardDescription>
                    Choose a template, then edit the subject and HTML body. Personalization is applied automatically.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Personalization preview */}
                <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-2">
                    <p className="text-sm font-medium text-foreground">Personalization</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span><strong className="text-foreground">First name</strong> — per recipient</span>
                        <span><strong className="text-foreground">Host</strong> — {senderName || "—"}</span>
                        <span><strong className="text-foreground">Property</strong> — {selectedPropertyName || "—"}</span>
                        <span><strong className="text-foreground">Listing URL</strong> — added per property</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <Select value={templateId} onValueChange={applyTemplate}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(EMAIL_TEMPLATES) as EmailTemplateId[]).map((id) => (
                                <SelectItem key={id} value={id}>
                                    {EMAIL_TEMPLATES[id].name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject line</Label>
                    <Input
                        id="subject"
                        placeholder="e.g. Open dates at Beachfront Villa — reply to book"
                        value={subject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    {isBlank ? (
                        <>
                            <Label>Create your email</Label>
                            <EmailBlankChat
                                messages={chatMessages}
                                onSend={onChatSend ?? (() => {})}
                                onConfirm={onChatConfirm ?? (() => {})}
                                onDecline={onChatDecline}
                                isGenerating={isGenerating}
                                isConfirming={isConfirming}
                            />
                        </>
                    ) : (
                        <>
                            <Label htmlFor="body">HTML body</Label>
                            <Textarea
                                id="body"
                                placeholder="Edit HTML content..."
                                value={html}
                                onChange={(e) => onHtmlChange(e.target.value)}
                                rows={12}
                                className="resize-none font-mono text-sm"
                            />
                        </>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    From: {senderName} · Unsubscribe link will be added automatically
                </p>
            </CardContent>
        </Card>
    )
}
