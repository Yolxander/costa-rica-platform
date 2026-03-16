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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Share2,
  Edit,
  Copy,
  Plus,
  ImageIcon,
  BarChart3,
} from "lucide-react"
import { SharedData } from "@/types"
import { toast } from "sonner"

interface Property {
  id: number
  slug: string
  name: string
  location: string
  thumbnail: string | null
  discovery_url: string
  is_enabled: boolean
  views_7d: number
  views_30d: number
}

interface DiscoveryPagesProps extends SharedData {
  properties: Property[]
}

export default function DiscoveryPages() {
  const { properties } = usePage<DiscoveryPagesProps>().props
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [viewPeriod, setViewPeriod] = useState<"7d" | "30d">("30d")

  const copyToClipboard = (url: string, id: number) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
    } else {
      const textarea = document.createElement("textarea")
      textarea.value = url
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    setCopiedId(id)
    toast.success("Link copied to clipboard!", {
      description: url,
      position: "bottom-right",
    })
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
                        <div className="relative aspect-[9/10] w-full overflow-hidden rounded-2xl">
                          <iframe
                            src={`/stay/${property.slug}`}
                            className="h-full w-full border-0 pointer-events-none"
                            title={property.name}
                          />
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

                            <button
                              className="absolute right-3 top-3 inline-flex items-center justify-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
                              onClick={() => copyToClipboard(property.discovery_url, property.id)}
                            >
                              <Copy className="h-3 w-3" />
                              {copiedId === property.id ? "Copied!" : "Copy Link"}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1 px-2 pt-4 pb-2">
                          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center justify-center">
                                  <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-small">
                                  {viewPeriod === "7d"
                                      ? (property.views_7d || 0)
                                      : (property.views_30d || 0)
                                  } views
                                </span>
                              </span>
                            <Select
                              value={viewPeriod}
                              onValueChange={(value: "7d" | "30d") => setViewPeriod(value)}
                            >
                              <SelectTrigger className="h-4 w-[95px] text-[10px] rounded-full border-muted-foreground/20 px-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link href={`/discovery-pages/${property.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-8 rounded-full">
                                <Edit className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </Link>
                              <Link href={`/socials/create?property_id=${property.id}&include_discovery_link=1`}>
                                  <Button size="sm" className="h-8 rounded-full bg-primary text-white">
                                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                                      Share on Social Media
                                  </Button>
                              </Link>
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
