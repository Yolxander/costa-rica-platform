import { IconCopy, IconCheck } from "@tabler/icons-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SharePropertyModalProps {
    isOpen: boolean
    onClose: () => void
    propertyName: string
}

export function SharePropertyModal({
    isOpen,
    onClose,
    propertyName,
}: SharePropertyModalProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const input = document.createElement("input")
            input.value = shareUrl
            document.body.appendChild(input)
            input.select()
            document.execCommand("copy")
            document.body.removeChild(input)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Share Property</DialogTitle>
                    <DialogDescription>
                        Share &quot;{propertyName}&quot; with potential guests or collaborators.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="share-url">Property link</Label>
                        <div className="flex gap-2">
                            <Input
                                id="share-url"
                                readOnly
                                value={shareUrl}
                                className="font-mono text-sm"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopyLink}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <IconCheck className="size-4 text-green-600" />
                                ) : (
                                    <IconCopy className="size-4" />
                                )}
                            </Button>
                        </div>
                        {copied && (
                            <p className="text-sm text-green-600">Link copied to clipboard!</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                            Share on social media
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    window.open(
                                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                                        "_blank"
                                    )
                                }
                            >
                                Facebook
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    window.open(
                                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${propertyName}`)}`,
                                        "_blank"
                                    )
                                }
                            >
                                Twitter
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    window.open(
                                        `https://wa.me/?text=${encodeURIComponent(`${propertyName} - ${shareUrl}`)}`,
                                        "_blank"
                                    )
                                }
                            >
                                WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
