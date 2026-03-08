import * as React from "react"
import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/image-upload"

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "parking", label: "Parking" },
  { id: "pool", label: "Pool" },
  { id: "kitchen", label: "Kitchen" },
  { id: "tv", label: "TV" },
  { id: "mountain_view", label: "Mountain View" },
  { id: "gym", label: "Gym" },
  { id: "security", label: "Security" },
  { id: "air_conditioning", label: "Air Conditioning" },
  { id: "washer", label: "Washer" },
  { id: "dryer", label: "Dryer" },
  { id: "hot_tub", label: "Hot Tub" },
  { id: "pet_friendly", label: "Pet Friendly" },
  { id: "no_smoking", label: "No Smoking" },
]

interface PropertyForModal {
  id?: number
  name: string
  type: string
  location: string
  description: string
  images?: string[]
  amenities?: string[]
  pricing: { base_price: number; price_format: string }
  capacity: { guests: number; bedrooms: number; bathrooms: number }
}

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property?: PropertyForModal
  onSave?: (data: Record<string, string>) => void
}

const initialFormData = {
  propertyName: "",
  propertyType: "",
  location: "",
  description: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  maxGuests: "",
}

function parseBedrooms(val: string): number {
  if (val === "5+") return 5
  const n = parseInt(val, 10)
  return isNaN(n) ? 1 : Math.max(0, n)
}

function parseBathrooms(val: string): number {
  if (val === "3+") return 3
  const n = parseFloat(val)
  return isNaN(n) ? 1 : Math.max(1, Math.ceil(n))
}

export function AddPropertyModal({ isOpen, onClose, property, onSave }: AddPropertyModalProps) {
  const isEdit = !!property

  const [formData, setFormData] = useState(initialFormData)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (property && isOpen) {
      const bedroomsStr =
        property.capacity.bedrooms >= 5 ? "5+" : String(property.capacity.bedrooms)
      const bathroomsNum = property.capacity.bathrooms
      const bathroomsStr =
        bathroomsNum >= 3 ? "3+" : String(bathroomsNum)
      setFormData({
        propertyName: property.name,
        propertyType: property.type?.toLowerCase() || "",
        location: property.location,
        description: property.description,
        price: property.pricing.base_price ? String(property.pricing.base_price) : "",
        bedrooms: bedroomsStr,
        bathrooms: bathroomsStr,
        maxGuests: String(property.capacity.guests),
      })
    } else if (!isEdit && isOpen) {
      setFormData(initialFormData)
    }
  }, [property, isOpen, isEdit])

  useEffect(() => {
    if (property?.images && Array.isArray(property.images)) {
      setImageUrls(property.images)
    } else if (!isEdit && isOpen) {
      setImageUrls([])
      setImageFiles([])
    }
  }, [property?.images, isEdit, isOpen])

  useEffect(() => {
    if (property?.amenities && Array.isArray(property.amenities)) {
      const normalized = property.amenities
        .map((a) => AMENITY_OPTIONS.find((o) => o.id.toLowerCase() === String(a).toLowerCase())?.id)
        .filter((id): id is string => !!id)
      setAmenities(normalized)
    } else if (!isEdit && isOpen) {
      setAmenities([])
    }
  }, [property?.amenities, isEdit, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setAmenities(prev =>
      prev.includes(amenityId) ? prev.filter((id) => id !== amenityId) : [...prev, amenityId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const typeCapitalized = formData.propertyType ? formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1) : "House"
    const payload: Record<string, unknown> = {
      name: formData.propertyName,
      description: formData.description || null,
      type: typeCapitalized,
      location: formData.location || "Costa Rica",
      base_price: parseFloat(formData.price) || 0,
      currency: "USD",
      guests: parseInt(formData.maxGuests, 10) || 1,
      bedrooms: parseBedrooms(formData.bedrooms),
      bathrooms: parseBathrooms(formData.bathrooms),
      amenities,
      image_urls: imageUrls,
    }
    if (imageFiles.length > 0) {
      payload.image_files = imageFiles
    }
    const options = {
      onFinish: () => setSubmitting(false),
      onSuccess: () => {
        onClose()
        if (!isEdit) setFormData(initialFormData)
      },
    }
    if (isEdit && property?.id) {
      router.put(`/properties/${property.id}`, payload, options)
      onSave?.(formData)
    } else {
      router.post("/properties", payload, options)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your property details below."
              : "Fill in the details below to add a new property to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details & Photos</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name *</Label>
                  <Input
                    id="propertyName"
                    placeholder="Enter property name"
                    value={formData.propertyName}
                    onChange={(e) => handleInputChange("propertyName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange("propertyType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter property location (e.g., Tamarindo, Guanacaste)"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, amenities, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => handleInputChange("bedrooms", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5+">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => handleInputChange("bathrooms", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                      <SelectItem value="3">3 Bathrooms</SelectItem>
                      <SelectItem value="3+">3+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Max Guests *</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    placeholder="Enter max guests"
                    value={formData.maxGuests}
                    onChange={(e) => handleInputChange("maxGuests", e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-6 mt-6">
              <ImageUpload
                value={imageUrls}
                files={imageFiles}
                onChange={(urls, files) => {
                  setImageUrls(urls)
                  setImageFiles(files)
                }}
              />
            </TabsContent>
            <TabsContent value="amenities" className="space-y-6 mt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select the amenities your property offers. Check or uncheck to add or remove.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity.id}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={amenities.includes(amenity.id)}
                        onCheckedChange={() => handleAmenityToggle(amenity.id)}
                      />
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : (isEdit ? "Update Property" : "Add Property")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
