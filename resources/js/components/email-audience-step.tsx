import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconUsers } from "@tabler/icons-react"

export type EmailSegmentId =
    | "didnt_book"
    | "booked_before"
    | "recent_30"
    | "recent_60"
    | "recent_90"
    | "all"
    | "by_property"

const SEGMENT_LABELS: Record<string, string> = {
    didnt_book: "Didn't book",
    booked_before: "Booked before",
    recent_30: "Recent inquirers (30 days)",
    recent_60: "Recent inquirers (60 days)",
    recent_90: "Recent inquirers (90 days)",
    all: "All guests",
    by_property: "By property",
}

interface EmailAudienceStepProps {
    segmentId: EmailSegmentId | ""
    onSegmentChange: (id: EmailSegmentId | "") => void
    propertyId: number | null
    onPropertyChange: (id: number | null) => void
    segments: Record<string, number>
    propertyCounts: Record<number, number>
    properties: Array<{ id: number; name: string }>
}

export function EmailAudienceStep({
    segmentId,
    onSegmentChange,
    propertyId,
    onPropertyChange,
    segments,
    propertyCounts,
    properties,
}: EmailAudienceStepProps) {
    const recipientCount = (() => {
        if (segmentId === "by_property" && propertyId) {
            return propertyCounts[propertyId] ?? 0
        }
        if (segmentId && segmentId in segments) {
            return segments[segmentId] ?? 0
        }
        return 0
    })()

    const segmentOptions: Array<{ id: EmailSegmentId; label: string; count: number }> = [
        { id: "didnt_book", label: SEGMENT_LABELS.didnt_book, count: segments.didnt_book ?? 0 },
        { id: "booked_before", label: SEGMENT_LABELS.booked_before, count: segments.booked_before ?? 0 },
        { id: "recent_30", label: SEGMENT_LABELS.recent_30, count: segments.recent_30 ?? 0 },
        { id: "recent_60", label: SEGMENT_LABELS.recent_60, count: segments.recent_60 ?? 0 },
        { id: "recent_90", label: SEGMENT_LABELS.recent_90, count: segments.recent_90 ?? 0 },
        { id: "all", label: SEGMENT_LABELS.all, count: segments.all ?? 0 },
        { id: "by_property", label: SEGMENT_LABELS.by_property, count: 0 },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconUsers className="size-5" />
                    Select audience
                </CardTitle>
                <CardDescription>
                    Choose who will receive your email campaign
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Segment</Label>
                    <Select
                        value={segmentId || undefined}
                        onValueChange={(v) => {
                            onSegmentChange((v || "") as EmailSegmentId | "")
                            if (v !== "by_property") onPropertyChange(null)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a segment" />
                        </SelectTrigger>
                        <SelectContent>
                            {segmentOptions.map((opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                    {opt.label}
                                    {opt.id !== "by_property" && ` (${opt.count})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {segmentId === "by_property" && (
                    <div className="space-y-2">
                        <Label>Property</Label>
                        <Select
                            value={propertyId ? String(propertyId) : ""}
                            onValueChange={(v) => onPropertyChange(v ? Number(v) : null)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent>
                                {properties.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name} ({propertyCounts[p.id] ?? 0})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="rounded-lg border bg-muted/30 px-4 py-3">
                    <p className="text-sm font-medium">
                        {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
                    </p>
                    {recipientCount === 0 && segmentId && (
                        <p className="text-xs text-muted-foreground mt-1">
                            No recipients match this segment yet.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
