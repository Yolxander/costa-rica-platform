import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { PropertyModal } from "@/components/property-modal"
import { ListingsTable } from "@/components/listings-table"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  MoreHorizontal,
  Plus,
  Edit,
  Copy,
  Archive,
  MapPin,
  Calendar,
  DollarSign,
  Download,
} from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"

interface ListingsPageProps extends SharedData {
  properties: Array<{
    id: number
    title: string
    location: string
    status: string
    price: string
    bedrooms: number
    bathrooms: number
    lastUpdated: string
    thumbnail: string
  }>
}

export default function ListingsPage() {
  const { properties: dbProperties } = usePage<ListingsPageProps>().props
  const [properties, setProperties] = useState(dbProperties)
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowModal(true)
  }

  const handleEditProperty = (property: any) => {
    setEditingProperty(property)
    setShowModal(true)
  }

  const parsePrice = (priceStr: string | number): number => {
    if (typeof priceStr === "number") return priceStr
    const match = String(priceStr).replace(/[^0-9.]/g, "")
    return parseFloat(match) || 0
  }

  const handleSaveProperty = (propertyData: any) => {
    const payload: Record<string, unknown> = {
      name: propertyData.title || propertyData.name || "",
      description: propertyData.description ?? null,
      type: "House",
      location: propertyData.location ?? "Costa Rica",
      base_price: parsePrice(propertyData.price ?? 0),
      currency: "USD",
      guests: 1,
      bedrooms: parseInt(propertyData.bedrooms, 10) || 1,
      bathrooms: parseFloat(propertyData.bathrooms) || 1,
      amenities: propertyData.amenities ?? [],
      house_rules: propertyData.houseRules ?? [],
      policies: propertyData.policies ?? [],
      image_urls: propertyData.photos ?? [],
    }
    if (propertyData.image_files?.length) {
      payload.image_files = propertyData.image_files
    }
    const options = {
      onSuccess: () => {
        setShowModal(false)
        setEditingProperty(null)
      },
    }
    if (editingProperty?.id) {
      router.put(`/properties/${editingProperty.id}`, payload, options)
    } else {
      router.post("/properties", payload, options)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProperty(null)
  }

  const handleDuplicateProperty = (property: any) => {
    const duplicatedProperty = {
      ...property,
      id: Date.now(),
      title: `${property.title} (Copy)`,
      lastUpdated: "Just now"
    }
    setProperties(prev => [...prev, duplicatedProperty])
  }

  const handleArchiveProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId))
  }


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Link href="/import">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Import listing
                      </Button>
                    </Link>
                  </div>
                  <Button className="flex items-center gap-2" onClick={handleAddProperty}>
                    <Plus className="h-4 w-4" />
                    Add Property
                  </Button>
                </div>

                <ListingsTable
                  data={properties}
                  onEdit={handleEditProperty}
                  onDuplicate={handleDuplicateProperty}
                  onArchive={handleArchiveProperty}
                />

                {properties.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Get started by adding your first property listing
                        </p>
                        <Button onClick={handleAddProperty}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Property
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <PropertyModal
        isOpen={showModal}
        onClose={handleCloseModal}
        property={editingProperty}
        onSave={handleSaveProperty}
      />
    </SidebarProvider>
  )
}
