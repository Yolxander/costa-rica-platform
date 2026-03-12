import { useState } from "react"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Home,
  Copy,
  Check,
} from "lucide-react"
import { SharedData } from "@/types"

interface Property {
  id: number
  slug: string
  name: string
  location: string
  images: string[]
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
  const [copied, setCopied] = useState(false)
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + discoveryUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                {/* Header */}
                <div className="mb-8">
                  <Link href="/discovery-pages">
                    <Button variant="ghost" className="mb-4 pl-0">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Discovery Pages
                    </Button>
                  </Link>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight">{property.name}</h1>
                      <p className="text-muted-foreground mt-1">{property.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={copyToClipboard}>
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <Link href={discoveryUrl} target="_blank">
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                  {/* Main Settings */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Enable/Disable */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Discovery Page Status</CardTitle>
                        <CardDescription>
                          Enable or disable your public Discovery Page
                        </CardDescription>
                      </CardHeader>
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
                        {data.discovery_page_enabled && (
                          <>
                            <Separator className="my-4" />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ExternalLink className="h-4 w-4" />
                              <span>Public URL:</span>
                              <code className="rounded bg-muted px-2 py-1">{discoveryUrl}</code>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Button Visibility */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Button Visibility</CardTitle>
                        <CardDescription>
                          Choose which buttons appear on your Discovery Page
                        </CardDescription>
                      </CardHeader>
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
                    </Card>

                    {/* External Links */}
                    <Card>
                      <CardHeader>
                        <CardTitle>External Links</CardTitle>
                        <CardDescription>
                          Add your listings from other platforms
                        </CardDescription>
                      </CardHeader>
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
                    </Card>

                    {/* Customization */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Customization</CardTitle>
                        <CardDescription>
                          Personalize your Discovery Page appearance
                        </CardDescription>
                      </CardHeader>
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
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Save Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Save Changes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button type="submit" className="w-full" disabled={processing}>
                          {processing ? "Saving..." : "Save Changes"}
                        </Button>
                        <Link href="/discovery-pages">
                          <Button variant="outline" className="w-full">
                            Cancel
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Preview Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Status:</span>{" "}
                            <Badge variant={data.discovery_page_enabled ? "default" : "secondary"}>
                              {data.discovery_page_enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Visible buttons:</span>
                            <ul className="mt-1 space-y-1">
                              {data.show_book_direct_button && (
                                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Home className="h-3 w-3" /> Book Direct
                                </li>
                              )}
                              {data.show_airbnb_button && data.airbnb_url && (
                                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="text-xs font-bold">A</span> Airbnb
                                </li>
                              )}
                              {data.show_bookingcom_button && data.bookingcom_url && (
                                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="text-xs font-bold">B</span> Booking.com
                                </li>
                              )}
                              {data.show_whatsapp_button && data.whatsapp_number && (
                                <li className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="text-xs font-bold">W</span> WhatsApp
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Accent color:</span>
                            <div
                              className="mt-1 h-4 w-full rounded"
                              style={{ backgroundColor: data.accent_color }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tips</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Share your Discovery Page link on social media bios</li>
                          <li>• Add it to your Google Business Profile</li>
                          <li>• Include it in email signatures</li>
                          <li>• Use QR codes for printed materials</li>
                        </ul>
                      </CardContent>
                    </Card>
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
