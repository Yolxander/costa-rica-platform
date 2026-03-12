import { useState } from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Eye,
  Edit,
  Copy,
  Plus,
  ImageIcon,
  MapPin,
} from "lucide-react"
import { SharedData } from "@/types"

interface Property {
  id: number
  slug: string
  name: string
  location: string
  thumbnail: string | null
  discovery_url: string
  is_enabled: boolean
  views_30d: number
}

interface DiscoveryPagesProps extends SharedData {
  properties: Property[]
}

export default function DiscoveryPages() {
  const { properties } = usePage<DiscoveryPagesProps>().props
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
        <Head title="Discovery Pages" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground mt-1">
                      Manage your shareable booking hubs for social media and direct marketing
                    </p>
                  </div>
                  <Link href="/listings">
                    <Button variant="outline" className="flex items-center gap-2 bg-primary text-white">
                      <Plus className="h-4 w-4" />
                      Add Page
                    </Button>
                  </Link>
                </div>

                {/* Properties Grid */}
                {properties.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property, index) => (
                      <Card
                        key={property.id}
                        className="group flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-background p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                          {property.thumbnail ? (
                            <img
                              src={property.thumbnail}
                              alt={property.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                          )}
                          <div className="absolute left-3 top-3">
                            <span
                              className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                property.is_enabled
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {property.is_enabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1 px-2 pt-4 pb-2">
                          <h3 className="text-lg font-semibold tracking-tight line-clamp-1">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>

                          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="font-medium">{property.views_30d || 0} views (30d)</span>
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link href={property.discovery_url} target="_blank">
                              <Button variant="outline" size="sm" className="h-8 rounded-full">
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/discovery-pages/${property.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-8 rounded-full">
                                <Edit className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-full"
                              onClick={() => copyToClipboard(property.discovery_url, property.id)}
                            >
                              {copiedId === property.id ? (
                                <>
                                  <Copy className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="py-12 rounded-3xl">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-muted p-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">No Discovery Pages yet</h3>
                      <p className="mb-4 max-w-md text-muted-foreground">
                        Discovery Pages are automatically created for each property. Add your first property to
                        get started.
                      </p>
                      <Link href="/listings">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Property
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
