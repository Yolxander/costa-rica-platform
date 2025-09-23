import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  DollarSign
} from "lucide-react"

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: "Beachfront Villa in Manuel Antonio",
    location: "Manuel Antonio, Costa Rica",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop&crop=center",
    price: "$2,800/month",
    bedrooms: 3,
    bathrooms: 2,
    lastUpdated: "2 days ago"
  },
  {
    id: 2,
    title: "Mountain Retreat in Monteverde",
    location: "Monteverde, Costa Rica",
    status: "paused",
    thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop&crop=center",
    price: "$1,900/month",
    bedrooms: 2,
    bathrooms: 1,
    lastUpdated: "1 week ago"
  },
  {
    id: 3,
    title: "Luxury Oceanview Condo in Tamarindo",
    location: "Tamarindo, Costa Rica",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop&crop=center",
    price: "$3,500/month",
    bedrooms: 4,
    bathrooms: 3,
    lastUpdated: "3 days ago"
  },
  {
    id: 4,
    title: "Tropical House in La Fortuna",
    location: "La Fortuna, Costa Rica",
    status: "active",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop&crop=center",
    price: "$2,200/month",
    bedrooms: 3,
    bathrooms: 2,
    lastUpdated: "5 days ago"
  },
  {
    id: 5,
    title: "Beach House in Santa Teresa",
    location: "Santa Teresa, Costa Rica",
    status: "paused",
    thumbnail: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=300&h=200&fit=crop&crop=center",
    price: "$2,600/month",
    bedrooms: 2,
    bathrooms: 2,
    lastUpdated: "1 week ago"
  }
]

export default function ListingsPage() {
  const [properties, setProperties] = useState(mockProperties)
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

  const handleSaveProperty = (propertyData: any) => {
    if (editingProperty) {
      // Update existing property
      setProperties(prev => prev.map(p =>
        p.id === editingProperty.id ? { ...p, ...propertyData } : p
      ))
    } else {
      // Add new property
      const newProperty = {
        id: Date.now(),
        ...propertyData,
        status: "active",
        lastUpdated: "Just now"
      }
      setProperties(prev => [...prev, newProperty])
    }
    setShowModal(false)
    setEditingProperty(null)
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
                <div className="flex items-center justify-end mb-6">
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
