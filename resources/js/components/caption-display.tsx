import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useClipboard } from "@/hooks/use-clipboard"
import { IconCopy, IconCheck, IconSparkles } from "@tabler/icons-react"
import type { PropertyForSocial } from "./social-image-picker"

interface CaptionDisplayProps {
    property: PropertyForSocial | null
    caption: string
    hashtags: string
    onCaptionChange: (value: string) => void
    onHashtagsChange: (value: string) => void
    onGenerateWithAI?: () => void
    isGenerating?: boolean
}

export function CaptionDisplay({
    property,
    caption,
    hashtags,
    onCaptionChange,
    onHashtagsChange,
    onGenerateWithAI,
    isGenerating = false,
}: CaptionDisplayProps) {
    const [copiedText, copy] = useClipboard()

    const listingUrl = property
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/listing/${property.id}`
        : ""

    const fullText = [caption, hashtags].filter(Boolean).join("\n\n")

    const handleCopy = () => {
        copy(fullText)
    }

    const justCopied = copiedText === fullText

    return (
        <Card>
            <CardHeader>
                <CardTitle>Caption & Hashtags</CardTitle>
                <CardDescription>
                    Edit the caption and hashtags, then copy to share on Instagram or Facebook.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="caption">Caption</Label>
                        {onGenerateWithAI && property && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onGenerateWithAI}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>Generating...</>
                                ) : (
                                    <>
                                        <IconSparkles className="mr-1.5 size-4" />
                                        Generate with AI
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <Textarea
                        id="caption"
                        placeholder="Select a property and images to generate a caption..."
                        value={caption}
                        onChange={(e) => onCaptionChange(e.target.value)}
                        rows={4}
                        className="resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Textarea
                        id="hashtags"
                        placeholder="#CostaRica #PuraVida #CostaRicaTravel"
                        value={hashtags}
                        onChange={(e) => onHashtagsChange(e.target.value)}
                        rows={2}
                        className="resize-none font-mono text-sm"
                    />
                </div>

                <Button
                    onClick={handleCopy}
                    disabled={!caption.trim() && !hashtags.trim()}
                    className="w-full sm:w-auto"
                >
                    {justCopied ? (
                        <>
                            <IconCheck className="mr-2 size-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <IconCopy className="mr-2 size-4" />
                            Copy to clipboard
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
