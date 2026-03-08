import { AddPropertyModal } from "@/components/add-property-modal"

interface PropertyDetails {
    id: number
    name: string
    type: string
    status: string
    location: string
    description: string
    amenities: string[]
    images: string[]
    house_rules: string[]
    policies: string[]
    pricing: {
        base_price: number
        price_format: string
        currency: string
    }
    capacity: {
        guests: number
        bedrooms: number
        bathrooms: number
    }
}

interface EditPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    property: PropertyDetails
    onSave?: (data: unknown) => void
}

export function EditPropertyModal({
    isOpen,
    onClose,
    property,
    onSave,
}: EditPropertyModalProps) {
    const propertyForModal = {
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        description: property.description,
        images: property.images ?? [],
        amenities: property.amenities ?? [],
        pricing: {
            base_price: property.pricing.base_price,
            price_format: property.pricing.price_format,
        },
        capacity: {
            guests: property.capacity.guests,
            bedrooms: property.capacity.bedrooms,
            bathrooms: property.capacity.bathrooms,
        },
    }

    return (
        <AddPropertyModal
            isOpen={isOpen}
            onClose={onClose}
            property={propertyForModal}
            onSave={(data) => onSave?.(data)}
        />
    )
}
