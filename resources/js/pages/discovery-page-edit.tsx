import { Head, useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Home,
  Minus,
  Plus,
} from "lucide-react"
import {
  IconBrandAirbnb,
  IconBrandBooking,
  IconBrandWhatsapp,
  IconMapPin,
  IconUsers,
  IconBed,
  IconBath,
  IconHome,
  IconExternalLink,
  IconChevronRight,
} from "@tabler/icons-react"
import { SharedData } from "@/types"

interface Property {
  id: number
  slug: string
  name: string
  location: string
  images: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  airbnb_url: string | null
  bookingcom_url: string | null
  vrbo_url: string | null
  website_url: string | null
  whatsapp_number: string | null
  discovery_page_enabled: boolean
  show_book_direct_button: boolean
  show_airbnb_button: boolean
  show_bookingcom_button: boolean
  show_whatsapp_button: boolean
  custom_message: string | null
  accent_color: string
}

interface DiscoveryPageEditProps extends SharedData {
  property: Property
}

export default function DiscoveryPageEdit() {
  const { property } = usePage<DiscoveryPageEditProps>().props
  const discoveryUrl = `/stay/${property.slug}`

  const { data, setData, put, processing, errors } = useForm({
    discovery_page_enabled: property.discovery_page_enabled,
    show_book_direct_button: property.show_book_direct_button,
    show_airbnb_button: property.show_airbnb_button,
    show_bookingcom_button: property.show_bookingcom_button,
    show_whatsapp_button: property.show_whatsapp_button,
    airbnb_url: property.airbnb_url || "",
    bookingcom_url: property.bookingcom_url || "",
    vrbo_url: property.vrbo_url || "",
    website_url: property.website_url || "",
    whatsapp_number: property.whatsapp_number || "",
    custom_message: property.custom_message || "",
    accent_color: property.accent_color || "#10b981",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/discovery-pages/${property.id}`)
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
        <Head title={`Edit Discovery Page - ${property.name}`} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-7">
                  {/* Main Settings */}
                  <div className="space-y-6 lg:col-span-4">
                    {/* Enable/Disable - Not Collapsible */}
                    <Card>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="discovery-enabled">Enable Discovery Page</Label>
                            <p className="text-sm text-muted-foreground">
                              When disabled, visitors will see a 404 error
                            </p>
                          </div>
                          <Switch
                            id="discovery-enabled"
                            checked={data.discovery_page_enabled}
                            onCheckedChange={(checked: boolean) =>
                              setData("discovery_page_enabled", checked)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Button Visibility */}
                    <Collapsible>
                      <Card className="group rounded-2xl border border-border/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="flex w-full items-center justify-between p-5 text-left cursor-pointer hover:bg-muted/50 transition-colors group" type="button">
                            <div className="pr-4">
                              <h3 className="text-base font-semibold">Button Visibility</h3>
                              <p className="text-sm text-muted-foreground">Choose which buttons appear on your Discovery Page</p>
                            </div>
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 bg-primary text-background group-data-[state=open]:bg-secondary">
                              <Plus className="size-4 group-data-[state=open]:hidden" />
                              <Minus className="size-4 hidden group-data-[state=open]:block" />
                            </span>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                  <Home className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <Label htmlFor="btn-book-direct">Book Direct</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Links to your full Sora listing
                                  </p>
                                </div>
                              </div>
                              <Switch
                                id="btn-book-direct"
                                checked={data.show_book_direct_button}
                                onCheckedChange={(checked: boolean) =>
                                  setData("show_book_direct_button", checked)
                                }
                              />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-rose-500/10 p-2">
                                  <span className="text-xs font-bold text-rose-500">A</span>
                                </div>
                                <div>
                                  <Label htmlFor="btn-airbnb">Airbnb</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Link to your Airbnb listing
                                  </p>
                                </div>
                              </div>
                              <Switch
                                id="btn-airbnb"
                                checked={data.show_airbnb_button}
                                onCheckedChange={(checked: boolean) =>
                                  setData("show_airbnb_button", checked)
                                }
                              />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-500/10 p-2">
                                  <span className="text-xs font-bold text-blue-500">B</span>
                                </div>
                                <div>
                                  <Label htmlFor="btn-bookingcom">Booking.com</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Link to your Booking.com listing
                                  </p>
                                </div>
                              </div>
                              <Switch
                                id="btn-bookingcom"
                                checked={data.show_bookingcom_button}
                                onCheckedChange={(checked: boolean) =>
                                  setData("show_bookingcom_button", checked)
                                }
                              />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-500/10 p-2">
                                  <span className="text-xs font-bold text-green-500">W</span>
                                </div>
                                <div>
                                  <Label htmlFor="btn-whatsapp">WhatsApp</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Let guests message you directly
                                  </p>
                                </div>
                              </div>
                              <Switch
                                id="btn-whatsapp"
                                checked={data.show_whatsapp_button}
                                onCheckedChange={(checked: boolean) =>
                                  setData("show_whatsapp_button", checked)
                                }
                              />
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* External Links */}
                    <Collapsible>
                      <Card className="group rounded-2xl border border-border/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="flex w-full items-center justify-between p-5 text-left cursor-pointer hover:bg-muted/50 transition-colors group" type="button">
                            <div className="pr-4">
                              <h3 className="text-base font-semibold">External Links</h3>
                              <p className="text-sm text-muted-foreground">Add your listings from other platforms</p>
                            </div>
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 bg-primary text-background group-data-[state=open]:bg-secondary">
                              <Plus className="size-4 group-data-[state=open]:hidden" />
                              <Minus className="size-4 hidden group-data-[state=open]:block" />
                            </span>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="airbnb-url">Airbnb Listing URL</Label>
                              <Input
                                id="airbnb-url"
                                type="url"
                                placeholder="https://airbnb.com/rooms/12345"
                                value={data.airbnb_url}
                                onChange={(e) => setData("airbnb_url", e.target.value)}
                              />
                              {errors.airbnb_url && (
                                <p className="text-sm text-red-500">{errors.airbnb_url}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bookingcom-url">Booking.com Listing URL</Label>
                              <Input
                                id="bookingcom-url"
                                type="url"
                                placeholder="https://booking.com/hotel/xx/example.html"
                                value={data.bookingcom_url}
                                onChange={(e) => setData("bookingcom_url", e.target.value)}
                              />
                              {errors.bookingcom_url && (
                                <p className="text-sm text-red-500">{errors.bookingcom_url}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="vrbo-url">VRBO Listing URL</Label>
                              <Input
                                id="vrbo-url"
                                type="url"
                                placeholder="https://vrbo.com/12345"
                                value={data.vrbo_url}
                                onChange={(e) => setData("vrbo_url", e.target.value)}
                              />
                              {errors.vrbo_url && (
                                <p className="text-sm text-red-500">{errors.vrbo_url}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="website-url">Personal Website</Label>
                              <Input
                                id="website-url"
                                type="url"
                                placeholder="https://yourwebsite.com"
                                value={data.website_url}
                                onChange={(e) => setData("website_url", e.target.value)}
                              />
                              {errors.website_url && (
                                <p className="text-sm text-red-500">{errors.website_url}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
                              <Input
                                id="whatsapp-number"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={data.whatsapp_number}
                                onChange={(e) => setData("whatsapp_number", e.target.value)}
                              />
                              {errors.whatsapp_number && (
                                <p className="text-sm text-red-500">{errors.whatsapp_number}</p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                Include country code (e.g., +1 for US)
                              </p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Customization */}
                    <Collapsible>
                      <Card className="group rounded-2xl border border-border/30 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="flex w-full items-center justify-between p-5 text-left cursor-pointer hover:bg-muted/50 transition-colors group" type="button">
                            <div className="pr-4">
                              <h3 className="text-base font-semibold">Customization</h3>
                              <p className="text-sm text-muted-foreground">Personalize your Discovery Page appearance</p>
                            </div>
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 bg-primary text-background group-data-[state=open]:bg-secondary">
                              <Plus className="size-4 group-data-[state=open]:hidden" />
                              <Minus className="size-4 hidden group-data-[state=open]:block" />
                            </span>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="custom-message">Welcome Message</Label>
                              <Textarea
                                id="custom-message"
                                placeholder="Welcome to our vacation home! Book direct for the best rate..."
                                value={data.custom_message}
                                onChange={(e) => setData("custom_message", e.target.value)}
                                maxLength={500}
                                rows={3}
                              />
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Optional message shown on your Discovery Page</span>
                                <span>{data.custom_message?.length || 0}/500</span>
                              </div>
                              {errors.custom_message && (
                                <p className="text-sm text-red-500">{errors.custom_message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="accent-color">Accent Color</Label>
                              <div className="flex items-center gap-3">
                                <Input
                                  id="accent-color"
                                  type="color"
                                  value={data.accent_color}
                                  onChange={(e) => setData("accent_color", e.target.value)}
                                  className="h-10 w-20"
                                />
                                <Input
                                  type="text"
                                  value={data.accent_color}
                                  onChange={(e) => setData("accent_color", e.target.value)}
                                  placeholder="#10b981"
                                  className="flex-1"
                                />
                              </div>
                              {errors.accent_color && (
                                <p className="text-sm text-red-500">{errors.accent_color}</p>
                              )}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    <Button type="submit" className="w-full" disabled={processing}>
                      {processing ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>

                  {/* Mobile Preview */}
                  <div className="lg:col-span-3">
                    <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-hidden space-y-4">

                      {/* Phone Frame */}
                      <div className="mx-auto w-[320px] rounded-[2.5rem] border-4 border-muted bg-muted p-2 shadow-xl">
                        <div className="relative overflow-hidden rounded-[2rem] bg-background">
                          {/* Status Bar */}
                          <div className="flex items-center justify-between bg-background px-4 py-2 text-[10px] font-medium">
                            <span>9:41</span>
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 rounded-full bg-foreground"></div>
                              <div className="h-2 w-2 rounded-full bg-foreground"></div>
                            </div>
                          </div>

                          {/* Scrollable Content */}
                          <div className="h-[580px] overflow-y-auto">
                            {/* Hero Image */}
                            <div className="relative h-40 w-full overflow-hidden">
                              {property.images && property.images.length > 0 ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-muted">
                                  <IconHome className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
                            </div>

                            {/* Content */}
                            <div className="relative -mt-8 px-3 pb-4">
                              {/* Property Info Card */}
                              <div className="mb-3 rounded-xl border bg-card/80 p-3 shadow-sm backdrop-blur-sm">
                                <h1 className="mb-1 text-base font-bold text-card-foreground">
                                  {property.name}
                                </h1>
                                <div className="mb-2 flex items-center gap-1 text-muted-foreground">
                                  <IconMapPin className="h-3 w-3" />
                                  <span className="text-xs">{property.location}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-0.5">
                                    <IconUsers className="h-3 w-3" />
                                    Sleeps {property.guests || 4}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <IconBed className="h-3 w-3" />
                                    {property.bedrooms || 2} bedrooms
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <IconBath className="h-3 w-3" />
                                    {property.bathrooms || 1} bathrooms
                                  </span>
                                </div>
                              </div>

                              {/* Custom Message */}
                              {data.custom_message && (
                                <div className="mb-3 rounded-lg border bg-muted/50 p-2">
                                  <p className="text-center text-xs text-muted-foreground italic">
                                    &ldquo;{data.custom_message}&rdquo;
                                  </p>
                                </div>
                              )}

                              {/* Booking Buttons */}
                              <div className="space-y-2">
                                {data.show_book_direct_button && (
                                  <button
                                    type="button"
                                    className="flex h-10 w-full items-center justify-center gap-1 rounded-md text-xs font-semibold text-white"
                                    style={{ backgroundColor: data.accent_color }}
                                  >
                                    <IconHome className="h-4 w-4" />
                                    Book Direct (Best Price)
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-input bg-background text-xs hover:bg-accent"
                                >
                                  Check Availability
                                  <IconChevronRight className="ml-auto h-3 w-3 opacity-50" />
                                </button>

                                {data.show_airbnb_button && data.airbnb_url && (
                                  <button
                                    type="button"
                                    className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-rose-200 bg-rose-50 text-xs text-rose-600"
                                  >
                                    <IconBrandAirbnb className="h-4 w-4" />
                                    Book on Airbnb
                                    <IconExternalLink className="ml-auto h-3 w-3 opacity-50" />
                                  </button>
                                )}

                                {data.show_bookingcom_button && data.bookingcom_url && (
                                  <button
                                    type="button"
                                    className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 text-xs text-blue-600"
                                  >
                                    <IconBrandBooking className="h-4 w-4" />
                                    Book on Booking.com
                                    <IconExternalLink className="ml-auto h-3 w-3 opacity-50" />
                                  </button>
                                )}

                                {data.show_whatsapp_button && data.whatsapp_number && (
                                  <button
                                    type="button"
                                    className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-green-200 bg-green-50 text-xs text-green-600"
                                  >
                                    <IconBrandWhatsapp className="h-4 w-4" />
                                    WhatsApp
                                  </button>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="mt-6 text-center">
                                <p className="text-[10px] text-muted-foreground/60">
                                  Powered by Sora
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="text-center text-xs text-muted-foreground">
                        <Badge variant={data.discovery_page_enabled ? "default" : "secondary"} className="text-[10px]">
                          {data.discovery_page_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
