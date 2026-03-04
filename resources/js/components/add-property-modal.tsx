import * as React from "react"
import { useState, useEffect } from "react"
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

interface PropertyForModal {
  id?: number
  name: string
  type: string
  location: string
  description: string
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

export function AddPropertyModal({ isOpen, onClose, property, onSave }: AddPropertyModalProps) {
  const isEdit = !!property

  const [formData, setFormData] = useState(initialFormData)

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && onSave) {
      onSave(formData)
    } else {
      // TODO: Implement property creation logic
      console.log("Property data:", formData)
    }
    onClose()
    if (!isEdit) {
      setFormData(initialFormData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your property details below."
              : "Fill in the details below to add a new property to your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Update Property" : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
