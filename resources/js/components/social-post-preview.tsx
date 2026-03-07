import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import {
    IconBrandInstagram,
    IconBrandFacebook,
    IconHeart,
    IconMessageCircle,
    IconSend,
    IconBookmark,
    IconLetterCase,
    IconHash,
    IconLink,
    IconMapPin,
    IconMessageCircle2,
    IconScissors,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type PreviewPlatform = "instagram" | "facebook"

interface SocialPostPreviewProps {
    selectedImages: string[]
    caption: string
    hashtags: string
    location?: string
}

const URL_REGEX = /https?:\/\/[^\s]+/g
const INSTAGRAM_CAPTION_LIMIT = 2200

export function SocialPostPreview({
    selectedImages,
    caption,
    hashtags,
    location = "Costa Rica",
}: SocialPostPreviewProps) {
    const [platform, setPlatform] = useState<PreviewPlatform>("instagram")
    const [truncateCaption, setTruncateCaption] = useState(false)
    const [firstComment, setFirstComment] = useState(false)
    const [showHashtags, setShowHashtags] = useState(true)
    const [showUrl, setShowUrl] = useState(true)
    const [showLocation, setShowLocation] = useState(false)
    const [showCharCount, setShowCharCount] = useState(false)

    const primaryImage = selectedImages[0]

    // Build caption parts based on toggles
    let captionText = caption
    if (!showUrl) {
        captionText = caption.replace(URL_REGEX, "").replace(/\s+/g, " ").trim()
    }

    const hashtagText = showHashtags ? hashtags : ""

    let mainCaption: string
    let firstCommentText: string

    if (firstComment) {
        mainCaption = captionText
        firstCommentText = hashtagText
    } else {
        mainCaption = [captionText, hashtagText].filter(Boolean).join("\n\n")
        firstCommentText = ""
    }

    const charCount = mainCaption.length + (firstComment ? firstCommentText.length : 0)

    return (
        <Card className="gap-4 py-4">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
                <div>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>
                        See how your post will look on social media
                    </CardDescription>
                </div>
                <div className="flex rounded-lg border p-0.5 bg-muted/30">
                    <button
                        type="button"
                        onClick={() => setPlatform("instagram")}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            platform === "instagram"
                                ? "bg-background shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <IconBrandInstagram className="size-4" />
                        Instagram
                    </button>
                    <button
                        type="button"
                        onClick={() => setPlatform("facebook")}
                        className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            platform === "facebook"
                                ? "bg-background shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <IconBrandFacebook className="size-4" />
                        Facebook
                    </button>
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-6 lg:items-start">
                    {/* Preview options - toggles on the left, 2 columns when space allows */}
                    <div className="grid grid-cols-2 gap-2 content-start">
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="Truncate caption"
                            pressed={truncateCaption}
                            onPressedChange={setTruncateCaption}
                        >
                            <IconScissors className="size-3.5" />
                            Truncate caption
                        </Toggle>
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="First comment mode"
                            pressed={firstComment}
                            onPressedChange={setFirstComment}
                        >
                            <IconMessageCircle2 className="size-3.5" />
                            First comment
                        </Toggle>
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="Show hashtags"
                            pressed={showHashtags}
                            onPressedChange={setShowHashtags}
                        >
                            <IconHash className="size-3.5" />
                            Hashtags
                        </Toggle>
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="Show URL"
                            pressed={showUrl}
                            onPressedChange={setShowUrl}
                        >
                            <IconLink className="size-3.5" />
                            Show URL
                        </Toggle>
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="Location tag"
                            pressed={showLocation}
                            onPressedChange={setShowLocation}
                        >
                            <IconMapPin className="size-3.5" />
                            Location
                        </Toggle>
                        <Toggle
                            size="sm"
                            variant="outline"
                            aria-label="Character count"
                            pressed={showCharCount}
                            onPressedChange={setShowCharCount}
                        >
                            <IconLetterCase className="size-3.5" />
                            Char count
                        </Toggle>
                    </div>

                    {/* Post preview on the right */}
                    {!primaryImage ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-16 rounded-lg border border-dashed bg-muted/30">
                            <p className="text-sm text-muted-foreground">
                                Select images in step 1 to see the preview
                            </p>
                        </div>
                    ) : (
                        <div className="flex justify-center min-w-0">
                            <div
                                className={cn(
                                    "overflow-hidden rounded-lg border bg-white text-black dark:bg-zinc-900 dark:text-white shrink-0",
                                    platform === "instagram"
                                        ? "w-full max-w-[375px]"
                                        : "w-full max-w-[500px]"
                                )}
                            >
                                {platform === "instagram" ? (
                                    <InstagramPreview
                                        images={selectedImages}
                                        mainCaption={mainCaption}
                                        firstCommentText={firstCommentText}
                                        truncateCaption={truncateCaption}
                                        showLocation={showLocation}
                                        location={location}
                                        showCharCount={showCharCount}
                                        charCount={charCount}
                                        captionLimit={INSTAGRAM_CAPTION_LIMIT}
                                    />
                                ) : (
                                    <FacebookPreview
                                        images={selectedImages}
                                        mainCaption={mainCaption}
                                        firstCommentText={firstCommentText}
                                        truncateCaption={truncateCaption}
                                        showLocation={showLocation}
                                        location={location}
                                        showCharCount={showCharCount}
                                        charCount={charCount}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function InstagramPreview({
    images,
    mainCaption,
    firstCommentText,
    truncateCaption,
    showLocation,
    location,
    showCharCount,
    charCount,
    captionLimit,
}: {
    images: string[]
    mainCaption: string
    firstCommentText: string
    truncateCaption: boolean
    showLocation: boolean
    location: string
    showCharCount: boolean
    charCount: number
    captionLimit: number
}) {
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const currentImage = images[activeImageIndex]

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
                <div className="size-8 rounded-full bg-gradient-to-br from-amber-500 via-pink-500 to-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm">your_username</span>
                    {showLocation && (
                        <p className="text-xs text-muted-foreground truncate">{location}</p>
                    )}
                </div>
                <button type="button" className="text-sm text-muted-foreground hover:underline shrink-0">
                    •••
                </button>
            </div>

            {/* Image - Instagram uses 1:1 square */}
            <div className="relative aspect-square bg-black">
                <img
                    src={currentImage}
                    alt="Post"
                    className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-black"
                            onClick={() => setActiveImageIndex((i) => (i - 1 + images.length) % images.length)}
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-black"
                            onClick={() => setActiveImageIndex((i) => (i + 1) % images.length)}
                        >
                            ›
                        </button>
                        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">
                            {activeImageIndex + 1}/{images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 px-4 py-2 border-b">
                <div className="flex gap-4">
                    <IconHeart className="size-6" />
                    <IconMessageCircle className="size-6" />
                    <IconSend className="size-6" />
                </div>
                <IconBookmark className="size-6 ml-auto" />
            </div>

            {/* Caption */}
            <div className="px-4 py-3 text-sm">
                <span className="font-semibold mr-1">your_username</span>
                <span
                    className={cn(
                        "whitespace-pre-wrap break-words",
                        truncateCaption && "line-clamp-2"
                    )}
                >
                    {mainCaption || "Your caption will appear here..."}
                </span>
                {truncateCaption && mainCaption.length > 100 && (
                    <span className="text-muted-foreground"> more</span>
                )}
            </div>

            {/* First comment (hashtags when first comment mode) */}
            {firstCommentText && (
                <div className="px-4 pb-3 text-sm border-t pt-2">
                    <div>
                        <span className="font-semibold mr-1">your_username</span>
                        <span className="whitespace-pre-wrap break-words">{firstCommentText}</span>
                    </div>
                </div>
            )}

            {/* Character count */}
            {showCharCount && (
                <div className="px-4 pb-2 text-xs text-muted-foreground">
                    {charCount} / {captionLimit}
                </div>
            )}
        </div>
    )
}

function FacebookPreview({
    images,
    mainCaption,
    firstCommentText,
    truncateCaption,
    showLocation,
    location,
    showCharCount,
    charCount,
}: {
    images: string[]
    mainCaption: string
    firstCommentText: string
    truncateCaption: boolean
    showLocation: boolean
    location: string
    showCharCount: boolean
    charCount: number
}) {
    const displayCaption = [mainCaption, firstCommentText].filter(Boolean).join("\n\n")

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="size-10 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px]">Your Page Name</p>
                    <p className="text-xs text-muted-foreground">
                        {showLocation ? `${location} · ` : ""}Sponsored · 🌐
                    </p>
                </div>
                <button type="button" className="text-muted-foreground hover:bg-muted rounded-full p-1">
                    •••
                </button>
            </div>

            {/* Caption above image (Facebook style) */}
            {displayCaption && (
                <div
                    className={cn(
                        "px-4 pt-2 pb-3 text-[15px] whitespace-pre-wrap break-words",
                        truncateCaption && "line-clamp-3"
                    )}
                >
                    {displayCaption}
                </div>
            )}

            {/* Image(s) */}
            <div className={images.length > 1 ? "grid grid-cols-2 gap-0.5" : ""}>
                {images.length === 1 ? (
                    <div className="aspect-[4/3] bg-black">
                        <img
                            src={images[0]}
                            alt="Post"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    images.slice(0, 4).map((url, i) => (
                        <div key={url} className="aspect-square bg-black">
                            <img
                                src={url}
                                alt={`Post ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Character count */}
            {showCharCount && (
                <div className="px-4 pt-2 text-xs text-muted-foreground">
                    {charCount} characters
                </div>
            )}

            {/* Reactions bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t text-muted-foreground">
                <span className="text-sm">👍 Like · 💬 Comment · ↩ Share</span>
            </div>
        </div>
    )
}
