import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  Mountain,
  Dumbbell,
  Shield,
  Clock
} from "lucide-react"

interface PropertyFormProps {
  property?: {
    id?: number
    title: string
    description: string
    location: string
    price: string
    bedrooms: number
    bathrooms: number
    amenities: string[]
    photos: string[]
    houseRules: string[]
    policies: string[]
  }
  onSave: (property: any) => void
  onCancel: () => void
}

const amenityOptions = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "kitchen", label: "Kitchen", icon: Coffee },
  { id: "tv", label: "TV", icon: Tv },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "mountain_view", label: "Mountain View", icon: Mountain },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "security", label: "Security", icon: Shield },
]

const houseRuleOptions = [
  "No smoking",
  "No pets",
  "No parties",
  "No loud music after 10 PM",
  "Check-in after 3 PM",
  "Check-out before 11 AM",
  "No unregistered guests",
  "Keep noise levels down",
]

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    location: property?.location || "",
    price: property?.price || "",
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    amenities: property?.amenities || [],
    photos: property?.photos || [],
    houseRules: property?.houseRules || [],
    policies: property?.policies || [],
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const handleHouseRuleToggle = (rule: string) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.includes(rule)
        ? prev.houseRules.filter(r => r !== rule)
        : [...prev.houseRules, rule]
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {property ? "Edit Property" : "Add New Property"}
        </h2>
        <p className="text-muted-foreground">
          {property ? "Update your property details" : "Create a new property listing"}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Photos & Video</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="rules">Rules & Policies</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Modern Downtown Apartment"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="e.g., $2,500/month"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your property..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter property address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange("bathrooms", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Photos & Video Tab */}
              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Upload Photos & Videos</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Drop files here or click to upload
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="sr-only"
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, MP4 up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tv className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Select Amenities</Label>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {amenityOptions.map((amenity) => {
                      const Icon = amenity.icon
                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => handleAmenityToggle(amenity.id)}
                        >
                          <Checkbox
                            checked={formData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                          />
                          <Icon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium">{amenity.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* Rules & Policies Tab */}
              <TabsContent value="rules" className="space-y-6">
                <div>
                  <Label className="text-base font-medium">House Rules</Label>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {houseRuleOptions.map((rule) => (
                      <div
                        key={rule}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleHouseRuleToggle(rule)}
                      >
                        <Checkbox
                          checked={formData.houseRules.includes(rule)}
                          onChange={() => handleHouseRuleToggle(rule)}
                        />
                        <span className="text-sm font-medium">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Custom Policies</Label>
                  <Textarea
                    placeholder="Add any custom policies or additional rules..."
                    rows={4}
                    value={formData.policies.join('\n')}
                    onChange={(e) => handleInputChange("policies", e.target.value.split('\n').filter(p => p.trim()))}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {property ? "Update Property" : "Create Property"}
              </Button>
            </div>
          </form>
    </div>
  )
}
