import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IconPhoto, IconCheck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export interface PropertyForSocial {
    id: number
    slug: string
    name: string
    location: string
    description: string
    amenities: string[]
    images: string[]
}

interface SocialImagePickerProps {
    properties: PropertyForSocial[]
    selectedPropertyId: number | null
    onPropertyChange: (propertyId: number | null) => void
    selectedImages: string[]
    onSelectionChange: (images: string[]) => void
}

export function SocialImagePicker({
    properties,
    selectedPropertyId,
    onPropertyChange,
    selectedImages,
    onSelectionChange,
}: SocialImagePickerProps) {
    const selectedProperty = properties.find((p) => p.id === selectedPropertyId)
    const images = selectedProperty?.images ?? []

    const toggleImage = (url: string) => {
        if (selectedImages.includes(url)) {
            onSelectionChange(selectedImages.filter((u) => u !== url))
        } else {
            onSelectionChange([...selectedImages, url])
        }
    }

    const selectAll = () => {
        if (selectedImages.length === images.length) {
            onSelectionChange([])
        } else {
            onSelectionChange([...images])
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <IconPhoto className="size-5" />
                        Select Images
                    </CardTitle>
                    <CardDescription>
                        Choose property photos for your social post. Select one or more images.
                    </CardDescription>
                </div>
                <div className="space-y-2 shrink-0 sm:w-fit">
                    <label className="text-sm font-medium">Property</label>
                    <Select
                        value={selectedPropertyId ? String(selectedPropertyId) : ""}
                        onValueChange={(v) => {
                            onPropertyChange(v ? Number(v) : null)
                            onSelectionChange([])
                        }}
                    >
                        <SelectTrigger>
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
            </CardHeader>
            <CardContent className="space-y-4">
                {selectedProperty && (
                    <>
                        {images.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed bg-muted/30">
                                <IconPhoto className="size-12 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    No images for this property yet. Add images in Listings.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {images.length} image{images.length !== 1 ? "s" : ""} available
                                    </p>
                                    <button
                                        type="button"
                                        onClick={selectAll}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {selectedImages.length === images.length ? "Deselect all" : "Select all"}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {images.map((url, idx) => {
                                        const isSelected = selectedImages.includes(url)
                                        return (
                                            <button
                                                key={url}
                                                type="button"
                                                onClick={() => toggleImage(url)}
                                                className={cn(
                                                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring",
                                                    isSelected
                                                        ? "border-primary ring-2 ring-primary/20"
                                                        : "border-transparent hover:border-muted-foreground/30"
                                                )}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`${selectedProperty.name} ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="rounded-full bg-primary p-1.5">
                                                            <IconCheck className="size-4 text-primary-foreground" />
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </>
                )}

                {!selectedProperty && properties.length > 0 && (
                    <p className="text-sm text-muted-foreground py-4">Select a property to see its images.</p>
                )}
            </CardContent>
        </Card>
    )
}
