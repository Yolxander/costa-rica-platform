import { PropertyForm } from "@/components/property-form"

interface PropertyModalProps {
  isOpen: boolean
  onClose: () => void
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
}

export function PropertyModal({ isOpen, onClose, property, onSave }: PropertyModalProps) {
  if (!isOpen) return null

  const handleSave = (propertyData: any) => {
    onSave(propertyData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-4xl max-h-[90vh] w-full mx-4 bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          <PropertyForm
            property={property}
            onSave={handleSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
