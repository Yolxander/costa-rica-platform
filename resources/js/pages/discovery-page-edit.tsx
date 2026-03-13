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
} from "@tabler/icons-react"
import { SharedData } from "@/types"

interface Property {
  id: number
  slug: string
  name: string
  location: string
  type: string
  images: string[]
  guests: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  base_price: number
  price_format: string | null
  currency: string
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
  show_vrbo_button: boolean
  show_website_button: boolean
  custom_message: string | null
  accent_color: string
  secondary_color: string
  host?: {
    name: string
    avatar: string | null
  }
  buttons: {
    book_direct: ButtonConfig
    airbnb: ButtonConfig
    bookingcom: ButtonConfig
    vrbo: ButtonConfig
    whatsapp: ButtonConfig
    website: ButtonConfig
  }
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
    show_vrbo_button: property.show_vrbo_button ?? true,
    show_website_button: property.show_website_button ?? true,
    airbnb_url: property.airbnb_url || "",
    bookingcom_url: property.bookingcom_url || "",
    vrbo_url: property.vrbo_url || "",
    website_url: property.website_url || "",
    whatsapp_number: property.whatsapp_number || "",
    custom_message: property.custom_message || "",
    highlighted_amenities: property.amenities?.slice(0, 6) || [],
    highlighted_images: property.images?.slice(1, 6) || [],
    show_welcome_message: true,
    show_booking_buttons: true,
    show_property_highlights: true,
    show_photo_gallery: true,
    show_contact_section: true,
    show_pricing: true,
    primary_color: property.accent_color ?? '#e78a53',
    secondary_color: property.secondary_color ?? '#5f8787',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/discovery-pages/${property.id}`)
  }

  return (
      <SidebarProvider
          style={
              {
                  '--sidebar-width': 'calc(var(--spacing) * 72)',
                  '--header-height': 'calc(var(--spacing) * 12)',
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
                              <form
                                  onSubmit={handleSubmit}
                                  className="grid gap-6 lg:grid-cols-7"
                              >
                                  {/* Main Settings */}
                                  <div className="space-y-6 lg:col-span-4">
                                      {/* Enable/Disable - Not Collapsible */}
                                      <Card>
                                          <CardContent>
                                              <div className="flex items-center justify-between">
                                                  <div className="space-y-0.5">
                                                      <Label htmlFor="discovery-enabled">
                                                          Enable Discovery Page
                                                      </Label>
                                                      <p className="text-sm text-muted-foreground">
                                                          When disabled,
                                                          visitors will see a
                                                          404 error
                                                      </p>
                                                  </div>
                                                  <Switch
                                                      id="discovery-enabled"
                                                      checked={
                                                          data.discovery_page_enabled
                                                      }
                                                      onCheckedChange={(
                                                          checked: boolean,
                                                      ) =>
                                                          setData(
                                                              'discovery_page_enabled',
                                                              checked,
                                                          )
                                                      }
                                                  />
                                              </div>
                                          </CardContent>
                                      </Card>

                                      {/* Primary & Secondary Colors */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Primary & Secondary
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              Customize your
                                                              button colors
                                                          </p>
                                                      </div>
                                                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                          <Plus className="size-4 group-data-[state=open]:hidden" />
                                                          <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                      </span>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-6 pb-6">
                                                      {/* Primary Color */}
                                                      <div className="space-y-2">
                                                          <Label htmlFor="primary-color">
                                                              Primary Color (Book
                                                              Direct)
                                                          </Label>
                                                          <div className="flex items-center gap-3">
                                                              <Input
                                                                  id="primary-color"
                                                                  type="color"
                                                                  value={
                                                                      data.primary_color
                                                                  }
                                                                  onChange={(
                                                                      e,
                                                                  ) =>
                                                                      setData(
                                                                          'primary_color',
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                  }
                                                                  className="h-10 w-20"
                                                              />
                                                              <Input
                                                                  type="text"
                                                                  value={
                                                                      data.primary_color
                                                                  }
                                                                  onChange={(
                                                                      e,
                                                                  ) =>
                                                                      setData(
                                                                          'primary_color',
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                  }
                                                                  placeholder="#e78a53"
                                                                  className="flex-1"
                                                              />
                                                          </div>
                                                          {errors.primary_color && (
                                                              <p className="text-sm text-red-500">
                                                                  {
                                                                      errors.primary_color
                                                                  }
                                                              </p>
                                                          )}
                                                      </div>

                                                      {/* Secondary Color */}
                                                      <div className="space-y-2">
                                                          <Label htmlFor="secondary-color">
                                                              Secondary Color
                                                              (Other Buttons)
                                                          </Label>
                                                          <div className="flex items-center gap-3">
                                                              <Input
                                                                  id="secondary-color"
                                                                  type="color"
                                                                  value={
                                                                      data.secondary_color
                                                                  }
                                                                  onChange={(
                                                                      e,
                                                                  ) =>
                                                                      setData(
                                                                          'secondary_color',
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                  }
                                                                  className="h-10 w-20"
                                                              />
                                                              <Input
                                                                  type="text"
                                                                  value={
                                                                      data.secondary_color
                                                                  }
                                                                  onChange={(
                                                                      e,
                                                                  ) =>
                                                                      setData(
                                                                          'secondary_color',
                                                                          e
                                                                              .target
                                                                              .value,
                                                                      )
                                                                  }
                                                                  placeholder="#5f8787"
                                                                  className="flex-1"
                                                              />
                                                          </div>
                                                          {errors.secondary_color && (
                                                              <p className="text-sm text-red-500">
                                                                  {
                                                                      errors.secondary_color
                                                                  }
                                                              </p>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>
                                      {/* Welcome Message */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Welcome Message
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              Add a custom
                                                              greeting for your
                                                              guests
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <Switch
                                                              id="toggle-welcome-message"
                                                              checked={
                                                                  data.show_welcome_message
                                                              }
                                                              onCheckedChange={(
                                                                  checked: boolean,
                                                              ) =>
                                                                  setData(
                                                                      'show_welcome_message',
                                                                      checked,
                                                                  )
                                                              }
                                                          />
                                                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                              <Plus className="size-4 group-data-[state=open]:hidden" />
                                                              <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                          </span>
                                                      </div>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-4 pb-6">
                                                      <div className="space-y-2">
                                                          <Label htmlFor="custom-message">
                                                              Message
                                                          </Label>
                                                          <Textarea
                                                              id="custom-message"
                                                              placeholder="Welcome to our vacation home! Book direct for the best rate..."
                                                              value={
                                                                  data.custom_message
                                                              }
                                                              onChange={(e) =>
                                                                  setData(
                                                                      'custom_message',
                                                                      e.target
                                                                          .value,
                                                                  )
                                                              }
                                                              maxLength={500}
                                                              rows={3}
                                                          />
                                                          <div className="flex justify-between text-sm text-muted-foreground">
                                                              <span>
                                                                  Optional
                                                                  message
                                                                  shown on your
                                                                  Discovery
                                                                  Page
                                                              </span>
                                                              <span>
                                                                  {data
                                                                          .custom_message
                                                                          ?.length ||
                                                                      0}
                                                                  /500
                                                              </span>
                                                          </div>
                                                          {errors.custom_message && (
                                                              <p className="text-sm text-red-500">
                                                                  {
                                                                      errors.custom_message
                                                                  }
                                                              </p>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>

                                      {/* Booking Buttons - Combined Visibility and Links */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Booking Buttons
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              Enable buttons and
                                                              add their links
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <Switch
                                                              id="toggle-booking-buttons"
                                                              checked={
                                                                  data.show_booking_buttons
                                                              }
                                                              onCheckedChange={(
                                                                  checked: boolean,
                                                              ) =>
                                                                  setData(
                                                                      'show_booking_buttons',
                                                                      checked,
                                                                  )
                                                              }
                                                          />
                                                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                              <Plus className="size-4 group-data-[state=open]:hidden" />
                                                              <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                          </span>
                                                      </div>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-6 pb-6">
                                                      {/* Book Direct - Toggle only, no URL */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-primary/10 p-2">
                                                                      <Home className="h-4 w-4 text-primary" />
                                                                  </div>
                                                                  <div>
                                                                      <Label htmlFor="btn-book-direct">
                                                                          Book
                                                                          Direct
                                                                      </Label>
                                                                      <p className="text-sm text-muted-foreground">
                                                                          Links
                                                                          to
                                                                          your
                                                                          full
                                                                          Sora
                                                                          listing
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="btn-book-direct"
                                                                  checked={
                                                                      data.show_book_direct_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_book_direct_button',
                                                                          checked,
                                                                      )
                                                                  }
                                                              />
                                                          </div>
                                                      </div>
                                                      <Separator />
                                                      {/* Airbnb - Toggle + URL */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-rose-500/10 p-2">
                                                                      <span className="text-xs font-bold text-rose-500">
                                                                          A
                                                                      </span>
                                                                  </div>
                                                                  <div>
                                                                      <Label htmlFor="btn-airbnb">
                                                                          Airbnb
                                                                      </Label>
                                                                      <p className="text-sm text-muted-foreground">
                                                                          Show
                                                                          Airbnb
                                                                          button
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="btn-airbnb"
                                                                  checked={
                                                                      data.show_airbnb_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_airbnb_button',
                                                                          checked,
                                                                      )
                                                              }
                                                          />
                                                          </div>
                                                          {data.show_airbnb_button && (
                                                              <div className="space-y-2 pl-11">
                                                                  <Label htmlFor="airbnb-url">
                                                                      Airbnb
                                                                      Listing
                                                                      URL
                                                                  </Label>
                                                                  <Input
                                                                      id="airbnb-url"
                                                                      type="url"
                                                                      placeholder="https://airbnb.com/rooms/12345"
                                                                      value={
                                                                          data.airbnb_url
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          setData(
                                                                              'airbnb_url',
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                      }
                                                                  />
                                                                  {errors.airbnb_url && (
                                                                      <p className="text-sm text-red-500">
                                                                          {
                                                                              errors.airbnb_url
                                                                          }
                                                                      </p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>
                                                      <Separator />
                                                      {/* Booking.com - Toggle + URL */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-blue-500/10 p-2">
                                                                      <span className="text-xs font-bold text-blue-500">
                                                                          B
                                                                      </span>
                                                                  </div>
                                                                  <div>
                                                                      <Label htmlFor="btn-bookingcom">
                                                                          Booking.com
                                                                      </Label>
                                                                      <p className="text-sm text-muted-foreground">
                                                                          Show
                                                                          Booking.com
                                                                          button
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="btn-bookingcom"
                                                                  checked={
                                                                      data.show_bookingcom_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_bookingcom_button',
                                                                          checked,
                                                                      )
                                                              }
                                                          />
                                                          </div>
                                                          {data.show_bookingcom_button && (
                                                              <div className="space-y-2 pl-11">
                                                                  <Label htmlFor="bookingcom-url">
                                                                      Booking.com
                                                                      Listing
                                                                      URL
                                                                  </Label>
                                                                  <Input
                                                                      id="bookingcom-url"
                                                                      type="url"
                                                                      placeholder="https://booking.com/hotel/xx/example.html"
                                                                      value={
                                                                          data.bookingcom_url
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          setData(
                                                                              'bookingcom_url',
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                      }
                                                                  />
                                                                  {errors.bookingcom_url && (
                                                                      <p className="text-sm text-red-500">
                                                                          {
                                                                              errors.bookingcom_url
                                                                          }
                                                                      </p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>
                                                      <Separator />
                                                      {/* VRBO - Toggle + URL */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-blue-400/10 p-2">
                                                                      <span className="text-xs font-bold text-blue-400">
                                                                          V
                                                                      </span>
                                                                  </div>
                                                                  <div>
                                                                      <Label htmlFor="btn-vrbo">
                                                                          VRBO
                                                                      </Label>
                                                                      <p className="text-sm text-muted-foreground">
                                                                          Show
                                                                          VRBO
                                                                          button
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="btn-vrbo"
                                                                  checked={
                                                                      data.show_vrbo_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_vrbo_button',
                                                                          checked,
                                                                      )
                                                              }
                                                          />
                                                          </div>
                                                          {data.show_vrbo_button && (
                                                              <div className="space-y-2 pl-11">
                                                                  <Label htmlFor="vrbo-url">
                                                                      VRBO
                                                                      Listing
                                                                      URL
                                                                  </Label>
                                                                  <Input
                                                                      id="vrbo-url"
                                                                      type="url"
                                                                      placeholder="https://vrbo.com/12345"
                                                                      value={
                                                                          data.vrbo_url
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          setData(
                                                                              'vrbo_url',
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                      }
                                                                  />
                                                                  {errors.vrbo_url && (
                                                                      <p className="text-sm text-red-500">
                                                                          {
                                                                              errors.vrbo_url
                                                                          }
                                                                      </p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>
                                                      <Separator />
                                                      {/* Personal Website - Toggle + URL */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-gray-500/10 p-2">
                                                                      <IconHome className="h-4 w-4 text-gray-500" />
                                                                  </div>
                                                                  <div>
                                                                      <Label htmlFor="btn-website">
                                                                          Personal
                                                                          Website
                                                                      </Label>
                                                                      <p className="text-sm text-muted-foreground">
                                                                          Show
                                                                          website
                                                                          button
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="btn-website"
                                                                  checked={
                                                                      data.show_website_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_website_button',
                                                                          checked,
                                                                      )
                                                              }
                                                          />
                                                          </div>
                                                          {data.show_website_button && (
                                                              <div className="space-y-2 pl-11">
                                                                  <Label htmlFor="website-url">
                                                                      Personal
                                                                      Website
                                                                      URL
                                                                  </Label>
                                                                  <Input
                                                                      id="website-url"
                                                                      type="url"
                                                                      placeholder="https://yourwebsite.com"
                                                                      value={
                                                                          data.website_url
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          setData(
                                                                              'website_url',
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                      }
                                                                  />
                                                                  {errors.website_url && (
                                                                      <p className="text-sm text-red-500">
                                                                          {
                                                                              errors.website_url
                                                                          }
                                                                      </p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>

                                      {/* Property Highlights */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Property
                                                              Highlights
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              Select amenities
                                                              to feature on your
                                                              Discovery Page
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <Switch
                                                              id="toggle-property-highlights"
                                                              checked={
                                                                  data.show_property_highlights
                                                              }
                                                              onCheckedChange={(
                                                                  checked: boolean,
                                                              ) =>
                                                                  setData(
                                                                      'show_property_highlights',
                                                                      checked,
                                                                  )
                                                              }
                                                          />
                                                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                              <Plus className="size-4 group-data-[state=open]:hidden" />
                                                              <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                          </span>
                                                      </div>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-4 pb-6">
                                                      <div className="space-y-3">
                                                          <p className="text-sm text-muted-foreground">
                                                              Choose up to 6
                                                              amenities from
                                                              your lisitng
                                                          </p>
                                                          {property.amenities &&
                                                          property.amenities
                                                              .length > 0 ? (
                                                              <div className="flex flex-wrap gap-2">
                                                                  {property.amenities.map(
                                                                      (
                                                                          amenity,
                                                                          index,
                                                                      ) => (
                                                                          <button
                                                                              key={
                                                                                  index
                                                                              }
                                                                              type="button"
                                                                              onClick={() => {
                                                                                  const current =
                                                                                      data.highlighted_amenities ||
                                                                                      [];
                                                                                  const isSelected =
                                                                                      current.includes(
                                                                                          amenity,
                                                                                      );
                                                                                  if (
                                                                                      isSelected
                                                                                  ) {
                                                                                      setData(
                                                                                          'highlighted_amenities',
                                                                                          current.filter(
                                                                                              (
                                                                                                  a,
                                                                                              ) =>
                                                                                                  a !==
                                                                                                  amenity,
                                                                                          ),
                                                                                      );
                                                                                  } else if (
                                                                                      current.length <
                                                                                      6
                                                                                  ) {
                                                                                      setData(
                                                                                          'highlighted_amenities',
                                                                                          [
                                                                                              ...current,
                                                                                              amenity,
                                                                                          ],
                                                                                      );
                                                                                  }
                                                                              }}
                                                                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                                                                                  (
                                                                                      data.highlighted_amenities ||
                                                                                      []
                                                                                  ).includes(
                                                                                      amenity,
                                                                                  )
                                                                                      ? 'border-primary bg-primary text-primary-foreground'
                                                                                      : 'border-border bg-secondary/50 text-secondary-foreground hover:bg-secondary'
                                                                              }`}
                                                                          >
                                                                              {(
                                                                                  data.highlighted_amenities ||
                                                                                  []
                                                                              ).includes(
                                                                                  amenity,
                                                                              ) && (
                                                                                  <Plus className="h-3 w-3 rotate-45" />
                                                                              )}
                                                                              {amenity.replace(
                                                                                  /_/g,
                                                                                  ' ',
                                                                              )}
                                                                          </button>
                                                                      ),
                                                                  )}
                                                              </div>
                                                          ) : (
                                                              <p className="text-sm text-muted-foreground italic">
                                                                  No amenities
                                                                  available. Add
                                                                  amenities to
                                                                  your property
                                                                  to feature
                                                                  them here.
                                                              </p>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>

                                      {/* Photo Gallery */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Photo Gallery
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              Select photos to
                                                              feature on your
                                                              Discovery Page
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <Switch
                                                              id="toggle-photo-gallery"
                                                              checked={
                                                                  data.show_photo_gallery
                                                              }
                                                              onCheckedChange={(
                                                                  checked: boolean,
                                                              ) =>
                                                                  setData(
                                                                      'show_photo_gallery',
                                                                      checked,
                                                                  )
                                                              }
                                                          />
                                                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                              <Plus className="size-4 group-data-[state=open]:hidden" />
                                                              <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                          </span>
                                                      </div>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-4 pb-6">
                                                      <div className="space-y-3">
                                                          <p className="text-sm text-muted-foreground">
                                                              Choose up to 5
                                                              photos from your
                                                              listing
                                                          </p>
                                                          {property.images &&
                                                          property.images
                                                              .length > 0 ? (
                                                              <div className="grid grid-cols-3 gap-2">
                                                                  {property.images.map(
                                                                      (
                                                                          image,
                                                                          index,
                                                                      ) => (
                                                                          <button
                                                                              key={
                                                                                  index
                                                                              }
                                                                              type="button"
                                                                              onClick={() => {
                                                                                  const current =
                                                                                      data.highlighted_images ||
                                                                                      []
                                                                                  const isSelected =
                                                                                      current.includes(
                                                                                          image,
                                                                                      )
                                                                                  if (
                                                                                      isSelected
                                                                                  ) {
                                                                                      setData(
                                                                                          'highlighted_images',
                                                                                          current.filter(
                                                                                              (
                                                                                                  img,
                                                                                              ) =>
                                                                                                  img !==
                                                                                                  image,
                                                                                          ),
                                                                                      )
                                                                                  } else if (
                                                                                      current.length <
                                                                                      5
                                                                                  ) {
                                                                                      setData(
                                                                                          'highlighted_images',
                                                                                          [
                                                                                              ...current,
                                                                                              image,
                                                                                          ],
                                                                                      )
                                                                                  }
                                                                              }}
                                                                              className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                                                                                  (
                                                                                      data.highlighted_images ||
                                                                                      []
                                                                                  ).includes(
                                                                                      image,
                                                                                  )
                                                                                      ? 'border-primary ring-2 ring-primary'
                                                                                      : 'border-border opacity-70 hover:opacity-100'
                                                                              }`}
                                                                          >
                                                                              <img
                                                                                  src={
                                                                                      image
                                                                                  }
                                                                                  alt={`Property ${index + 1}`}
                                                                                  className="h-full w-full object-cover"
                                                                              />
                                                                              {(
                                                                                  data.highlighted_images ||
                                                                                  []
                                                                              ).includes(
                                                                                  image,
                                                                              ) && (
                                                                                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                                                                                      <Plus className="h-6 w-6 rotate-45 text-primary" />
                                                                                  </div>
                                                                              )}
                                                                          </button>
                                                                      ),
                                                                  )}
                                                              </div>
                                                          ) : (
                                                              <p className="text-sm text-muted-foreground italic">
                                                                  No images
                                                                  available.
                                                                  Add images to
                                                                  your property
                                                                  to feature
                                                                  them here.
                                                              </p>
                                                          )}
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>

                                      {/* Contact & Pricing */}
                                      <Collapsible>
                                          <Card className="group overflow-hidden rounded-2xl border border-border/30 bg-background py-0 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                                              <CollapsibleTrigger asChild>
                                                  <button
                                                      className="group flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                                                      type="button"
                                                  >
                                                      <div className="pr-4">
                                                          <h3 className="text-base font-semibold">
                                                              Contact & Pricing
                                                          </h3>
                                                          <p className="text-sm text-muted-foreground">
                                                              WhatsApp contact
                                                              and price display
                                                          </p>
                                                      </div>
                                                      <div className="flex items-center gap-3">
                                                          <Switch
                                                              id="toggle-contact-section"
                                                              checked={
                                                                  data.show_contact_section
                                                              }
                                                              onCheckedChange={(
                                                                  checked: boolean,
                                                              ) =>
                                                                  setData(
                                                                      'show_contact_section',
                                                                      checked,
                                                                  )
                                                              }
                                                          />
                                                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-data-[state=open]:bg-secondary">
                                                              <Plus className="size-4 group-data-[state=open]:hidden" />
                                                              <Minus className="hidden size-4 group-data-[state=open]:block" />
                                                          </span>
                                                      </div>
                                                  </button>
                                              </CollapsibleTrigger>
                                              <CollapsibleContent>
                                                  <CardContent className="space-y-6 pb-6">
                                                      {/* WhatsApp Button */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-green-100 p-2">
                                                                      <IconBrandWhatsapp className="h-4 w-4 text-green-600" />
                                                                  </div>
                                                                  <div>
                                                                      <h4 className="text-sm font-medium">
                                                                          WhatsApp
                                                                          Button
                                                                      </h4>
                                                                      <p className="text-xs text-muted-foreground">
                                                                          Let
                                                                          guests
                                                                          contact
                                                                          you
                                                                          directly
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="show-whatsapp-button"
                                                                  checked={
                                                                      data.show_whatsapp_button
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_whatsapp_button',
                                                                          checked,
                                                                      )
                                                                  }
                                                              />
                                                          </div>
                                                          {data.show_whatsapp_button && (
                                                              <div className="pl-11">
                                                                  <Label
                                                                      htmlFor="whatsapp-number"
                                                                      className="mb-2 block text-xs"
                                                                  >
                                                                      WhatsApp
                                                                      Number
                                                                  </Label>
                                                                  <Input
                                                                      id="whatsapp-number"
                                                                      type="text"
                                                                      value={
                                                                          data.whatsapp_number
                                                                      }
                                                                      onChange={(
                                                                          e,
                                                                      ) =>
                                                                          setData(
                                                                              'whatsapp_number',
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                          )
                                                                      }
                                                                      placeholder="+1 234 567 8900"
                                                                  />
                                                                  {errors.whatsapp_number && (
                                                                      <p className="mt-1 text-xs text-red-500">
                                                                          {
                                                                              errors.whatsapp_number
                                                                          }
                                                                      </p>
                                                                  )}
                                                              </div>
                                                          )}
                                                      </div>

                                                      <Separator />

                                                      {/* Pricing Display */}
                                                      <div className="space-y-3">
                                                          <div className="flex items-center justify-between">
                                                              <div className="flex items-center gap-3">
                                                                  <div className="rounded-full bg-primary/10 p-2">
                                                                      <span className="text-xs font-semibold text-primary">
                                                                          $
                                                                      </span>
                                                                  </div>
                                                                  <div>
                                                                      <h4 className="text-sm font-medium">
                                                                          Show
                                                                          Pricing
                                                                      </h4>
                                                                      <p className="text-xs text-muted-foreground">
                                                                          Display
                                                                          starting
                                                                          price
                                                                          on
                                                                          Discovery
                                                                          Page
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <Switch
                                                                  id="show-pricing"
                                                                  checked={
                                                                      data.show_pricing
                                                                  }
                                                                  onCheckedChange={(
                                                                      checked: boolean,
                                                                  ) =>
                                                                      setData(
                                                                          'show_pricing',
                                                                          checked,
                                                                      )
                                                                  }
                                                              />
                                                          </div>
                                                      </div>
                                                  </CardContent>
                                              </CollapsibleContent>
                                          </Card>
                                      </Collapsible>

                                  </div>

                                  {/* Mobile Preview */}
                                  <div className="lg:col-span-3">
                                      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-4 overflow-hidden">
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
                                                  <div className="h-[580px] overflow-y-auto hide-scrollbar">
                                                      {/* Hero Image - Larger like actual page */}
                                                      <div className="relative h-56 w-full overflow-hidden">
                                                          {property.images &&
                                                          property.images
                                                              .length > 0 ? (
                                                              <img
                                                                  src={
                                                                      property
                                                                          .images[0]
                                                                  }
                                                                  alt={
                                                                      property.name
                                                                  }
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
                                                      <div className="relative -mt-12 px-4 pb-6">
                                                          {/* Property Info Card - Styled like actual page */}
                                                          <div className="mb-4 rounded-2xl border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                                                              <h1 className="mb-1 text-lg leading-tight font-bold text-card-foreground">
                                                                  {
                                                                      property.name
                                                                  }
                                                              </h1>
                                                              <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
                                                                  <IconMapPin className="h-3.5 w-3.5" />
                                                                  <span className="text-xs">
                                                                      {
                                                                          property.location
                                                                      }
                                                                  </span>
                                                              </div>
                                                              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                                  <span className="flex items-center gap-1">
                                                                      <IconUsers className="h-3.5 w-3.5" />
                                                                      Sleeps{' '}
                                                                      {property.guests ||
                                                                          4}
                                                                  </span>
                                                                  <span className="flex items-center gap-1">
                                                                      <IconBed className="h-3.5 w-3.5" />
                                                                      {property.bedrooms ||
                                                                          2}{' '}
                                                                      bedrooms
                                                                  </span>
                                                                  <span className="flex items-center gap-1">
                                                                      <IconBath className="h-3.5 w-3.5" />
                                                                      {property.bathrooms ||
                                                                          1}{' '}
                                                                      bathrooms
                                                                  </span>
                                                              </div>
                                                          </div>

                                                          {/* Custom Message - Styled like actual page */}
                                                          {data.show_welcome_message && data.custom_message && (
                                                              <div className="mb-4 rounded-xl border bg-muted/50 p-3">
                                                                  <p className="text-center text-xs text-muted-foreground italic">
                                                                      &ldquo;
                                                                      {
                                                                          data.custom_message
                                                                      }
                                                                      &rdquo;
                                                                  </p>
                                                              </div>
                                                          )}

                                                          {/* Booking Buttons - Styled like actual page */}
                                                          {data.show_booking_buttons && (
                                                              <div className="space-y-3">
                                                              {/* Book Direct - Primary CTA */}
                                                              {data.show_book_direct_button && (
                                                                  <button
                                                                      type="button"
                                                                      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white"
                                                                      style={{
                                                                          backgroundColor:
                                                                              data.primary_color,
                                                                      }}
                                                                  >
                                                                      <IconHome className="h-5 w-5" />
                                                                      Book
                                                                      Direct
                                                                      (Best
                                                                      Price)
                                                                  </button>
                                                              )}

                                                              {/* External Platforms */}
                                                              {data.show_airbnb_button &&
                                                                  data.airbnb_url && (
                                                                      <button
                                                                          type="button"
                                                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                                                          style={{
                                                                              backgroundColor: data.secondary_color,
                                                                              borderColor: data.secondary_color,
                                                                          }}
                                                                      >
                                                                          <IconBrandAirbnb className="h-5 w-5 text-rose-500" />
                                                                          <span className="flex-1 text-white">Book on Airbnb</span>
                                                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                                                      </button>
                                                                  )}

                                                              {data.show_bookingcom_button &&
                                                                  data.bookingcom_url && (
                                                                      <button
                                                                          type="button"
                                                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                                                          style={{
                                                                              backgroundColor: data.secondary_color,
                                                                              borderColor: data.secondary_color,
                                                                          }}
                                                                      >
                                                                          <IconBrandBooking className="h-5 w-5 text-blue-500" />
                                                                          <span className="flex-1 text-white">Book on Booking.com</span>
                                                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                                                      </button>
                                                                  )}

                                                              {data.show_vrbo_button &&
                                                                  data.vrbo_url && (
                                                                      <button
                                                                          type="button"
                                                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                                                          style={{
                                                                              backgroundColor: data.secondary_color,
                                                                              borderColor: data.secondary_color,
                                                                          }}
                                                                      >
                                                                          <IconHome className="h-5 w-5 text-sky-400" />
                                                                          <span className="flex-1 text-white">Book on VRBO</span>
                                                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                                                      </button>
                                                                  )}

                                                              {data.show_website_button &&
                                                                  data.website_url && (
                                                                      <button
                                                                          type="button"
                                                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                                                          style={{
                                                                              backgroundColor: data.secondary_color,
                                                                              borderColor: data.secondary_color,
                                                                          }}
                                                                      >
                                                                          <IconExternalLink className="h-5 w-5 text-emerald-400" />
                                                                          <span className="flex-1 text-white">Visit Our Website</span>
                                                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                                                      </button>
                                                                  )}
                                                          </div>
                                                          )}

                                                          {/* Amenities Preview - Using highlighted_amenities */}
                                                          {data.show_property_highlights &&
                                                              data
                                                                  .highlighted_amenities
                                                                  .length >
                                                                  0 && (
                                                                  <div className="mt-6">
                                                                      <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                                                          Property
                                                                          Highlights
                                                                      </h3>
                                                                      <div className="flex flex-wrap justify-center gap-2">
                                                                          {data.highlighted_amenities
                                                                              .slice(
                                                                                  0,
                                                                                  6,
                                                                              )
                                                                              .map(
                                                                                  (
                                                                                      amenity,
                                                                                      index,
                                                                                  ) => (
                                                                                      <div
                                                                                          key={
                                                                                              index
                                                                                          }
                                                                                          className="flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-[10px]"
                                                                                      >
                                                                                          <span>
                                                                                              {amenity.replace(
                                                                                                  /_/g,
                                                                                                  ' ',
                                                                                              )}
                                                                                          </span>
                                                                                      </div>
                                                                                  ),
                                                                              )}
                                                                      </div>
                                                                  </div>
                                                              )}

                                                          {/* Photo Gallery Preview */}
                                                          {data.show_photo_gallery && data.highlighted_images &&
                                                              data.highlighted_images
                                                                  .length > 0 && (
                                                                  <div className="mt-6">
                                                                      <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                                                          Photo
                                                                          Gallery
                                                                      </h3>
                                                                      <div className="flex gap-2 overflow-x-auto pb-2">
                                                                          {data.highlighted_images.map(
                                                                              (
                                                                                  image,
                                                                                  index,
                                                                              ) => (
                                                                                      <div
                                                                                          key={
                                                                                              index
                                                                                          }
                                                                                          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border"
                                                                                      >
                                                                                          <img
                                                                                              src={
                                                                                                  image
                                                                                              }
                                                                                              alt={`${property.name} ${index + 1}`}
                                                                                              className="h-full w-full object-cover"
                                                                                          />
                                                                                      </div>
                                                                                  ),
                                                                              )}
                                                                      </div>
                                                                  </div>
                                                              )}

                                                          {/* Contact & Pricing Preview */}
                                                          {data.show_contact_section && (
                                                              <>
                                                                  {/* Contact Options */}
                                                                  {data.show_whatsapp_button &&
                                                                      data.whatsapp_number && (
                                                                          <div className="mt-6 border-t pt-4">
                                                                              <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                                                                  Contact
                                                                                  Host
                                                                              </h3>
                                                                              <div className="flex justify-center gap-2">
                                                                                  <button
                                                                                      type="button"
                                                                                      className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 text-xs text-green-600 hover:bg-green-100"
                                                                                  >
                                                                                      <IconBrandWhatsapp className="h-4 w-4" />
                                                                                      WhatsApp
                                                                                  </button>
                                                                              </div>
                                                                          </div>
                                                                      )}

                                                                  {/* Price Info */}
                                                                  {data.show_pricing &&
                                                                      property.base_price >
                                                                          0 && (
                                                                      <div className="mt-6 text-center">
                                                                          <p className="text-xs text-muted-foreground">
                                                                              Starting
                                                                              from{' '}
                                                                              <span className="font-semibold text-foreground">
                                                                                  {property.price_format ||
                                                                                      `$${property.base_price}/night`}
                                                                              </span>
                                                                          </p>
                                                                      </div>
                                                                  )}
                                                              </>
                                                          )}

                                                          {/* Footer - Styled like actual page */}
                                                          <div className="mt-8 border-t pt-4 text-center">
                                                              <div className="mb-2 flex items-center justify-center gap-2">
                                                                  <div className="flex h-6 w-6 items-center justify-center">
                                                                      <img
                                                                          src="/brisa-logo.png"
                                                                          alt="Sora Logo"
                                                                          className="h-4 w-auto"
                                                                      />
                                                                  </div>
                                                                  <span className="text-xs font-medium text-muted-foreground">
                                                                      Powered by
                                                                      Sora
                                                                  </span>
                                                              </div>
                                                              <p className="text-[10px] text-muted-foreground/60">
                                                                  Book directly
                                                                  with{' '}
                                                                  {property.host
                                                                      ?.name ||
                                                                      'the host'}{' '}
                                                                  for the best
                                                                  experience
                                                              </p>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Quick Info */}
                                          <div className="items-center text-center text-xs text-muted-foreground">
                                              <Button
                                                  type="submit"
                                                  className="w-[320px] justify-center"
                                                  disabled={processing}
                                              >
                                                  {processing
                                                      ? 'Saving...'
                                                      : 'Save Changes'}
                                              </Button>
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
  );
}
