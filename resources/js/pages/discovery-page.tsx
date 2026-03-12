import { Head, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  IconMapPin,
  IconUsers,
  IconBed,
  IconBath,
  IconHome,
  IconWifi,
  IconCar,
  IconSwimming,
  IconCoffee,
  IconBrandAirbnb,
  IconBrandBooking,
  IconBrandWhatsapp,
  IconExternalLink,
  IconChevronRight,
  IconWashMachine,
  IconFlame,
  IconDeviceTv,
  IconSnowflake,
} from "@tabler/icons-react"

interface ButtonConfig {
  visible: boolean
  url: string | null
}

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
  custom_message: string | null
  accent_color: string
  host: {
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

interface DiscoveryPageProps {
  property: Property
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: IconWifi,
  parking: IconCar,
  pool: IconSwimming,
  kitchen: IconCoffee,
  hottub: IconBath,
  washer: IconWashMachine,
  dryer: IconWashMachine,
  tv: IconDeviceTv,
  hdtv: IconDeviceTv,
  ac: IconSnowflake,
  heating: IconFlame,
  WiFi: IconWifi,
  Parking: IconCar,
  Pool: IconSwimming,
  Kitchen: IconCoffee,
  HotTub: IconBath,
  Washer: IconWashMachine,
  Dryer: IconWashMachine,
  TV: IconDeviceTv,
  HDTV: IconDeviceTv,
  AC: IconSnowflake,
  Heating: IconFlame,
}

export default function DiscoveryPage({ property }: DiscoveryPageProps) {
  const getAmenityIcon = (amenity: string) => {
    const normalized = amenity.toLowerCase().replace(/[_\s]/g, "")
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (normalized.includes(key.toLowerCase())) {
        return Icon
      }
    }
    return null
  }

  return (
      <>
          <Head title={`${property.name} - Book Your Stay`} />
          <div className="min-h-screen bg-background">
              {/* Hero Image */}
              <div className="relative h-[45vh] w-full overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                      <img
                          src={property.images[0]}
                          alt={property.name}
                          className="h-full w-full object-cover"
                      />
                  ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                          <IconHome className="h-20 w-20 text-muted-foreground/30" />
                      </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
              </div>

              {/* Content Container */}
              <div className="relative -mt-16 px-4 pb-8">
                  <div className="mx-auto max-w-md">
                      {/* Property Info Card */}
                      <div className="mb-6 rounded-2xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm">
                          <h1 className="mb-2 text-2xl font-bold text-card-foreground">
                              {property.name}
                          </h1>
                          <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                              <IconMapPin className="h-4 w-4" />
                              <span className="text-sm">
                                  {property.location}
                              </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                  <IconUsers className="h-4 w-4" />
                                  Sleeps {property.guests}
                              </span>
                              <span className="flex items-center gap-1">
                                  <IconBed className="h-4 w-4" />
                                  {property.bedrooms} bedrooms
                              </span>
                              <span className="flex items-center gap-1">
                                  <IconBath className="h-4 w-4" />
                                  {property.bathrooms} bathrooms
                              </span>
                          </div>
                      </div>

                      {/* Custom Message */}
                      {property.custom_message && (
                          <div className="mb-6 rounded-xl border bg-muted/50 p-4">
                              <p className="text-center text-sm text-muted-foreground italic">
                                  &ldquo;{property.custom_message}&rdquo;
                              </p>
                          </div>
                      )}

                      {/* Booking Buttons */}
                      <div className="space-y-4">
                          {/* Book Direct - Primary CTA */}
                          {property.buttons.book_direct.visible && (
                              <Link
                                  href={
                                      property.buttons.book_direct.url ||
                                      `/${property.slug}`
                                  }
                                  className="block"
                              >
                                  <Button className="h-14 w-full text-base font-semibold">
                                      <IconHome className="mr-2 h-5 w-5" />
                                      Book Direct (Best Price)
                                  </Button>
                              </Link>
                          )}

                          {/* Check Availability */}
                          <Link href={`/${property.slug}`} className="block">
                              <Button variant="outline" className="h-12 w-full">
                                  Check Availability
                                  <IconChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                          </Link>

                          {/* External Platforms */}
                          {property.buttons.airbnb.visible &&
                              property.buttons.airbnb.url && (
                                  <a
                                      href={property.buttons.airbnb.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <Button
                                          variant="outline"
                                          className="h-12 w-full border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                                      >
                                          <IconBrandAirbnb className="mr-2 h-5 w-5" />
                                          Book on Airbnb
                                          <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </a>
                              )}

                          {property.buttons.bookingcom.visible &&
                              property.buttons.bookingcom.url && (
                                  <a
                                      href={property.buttons.bookingcom.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <Button
                                          variant="outline"
                                          className="h-12 w-full border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                      >
                                          <IconBrandBooking className="mr-2 h-5 w-5" />
                                          Book on Booking.com
                                          <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </a>
                              )}

                          {property.buttons.vrbo.visible &&
                              property.buttons.vrbo.url && (
                                  <a
                                      href={property.buttons.vrbo.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <Button
                                          variant="outline"
                                          className="h-12 w-full border-blue-100 bg-blue-50/50 text-blue-500 hover:bg-blue-50"
                                      >
                                          Book on VRBO
                                          <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </a>
                              )}

                          {property.buttons.website.visible &&
                              property.buttons.website.url && (
                                  <a
                                      href={property.buttons.website.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <Button
                                          variant="outline"
                                          className="h-12 w-full"
                                      >
                                          Visit Our Website
                                          <IconExternalLink className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </a>
                              )}
                      </div>

                      {/* Amenities Preview */}
                      {property.amenities && property.amenities.length > 0 && (
                          <div className="mt-8">
                              <h3 className="mb-4 text-center text-sm font-medium text-muted-foreground">
                                  Property Highlights
                              </h3>
                              <div className="flex flex-wrap justify-center gap-3">
                                  {property.amenities
                                      .slice(0, 6)
                                      .map((amenity, index) => {
                                          const Icon = getAmenityIcon(amenity);
                                          return (
                                              <div
                                                  key={index}
                                                  className="flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1.5 text-xs text-white"
                                              >
                                                  {Icon && (
                                                      <Icon className="h-3.5 w-3.5" />
                                                  )}
                                                  <span>
                                                      {amenity.replace(
                                                          /_/g,
                                                          ' ',
                                                      )}
                                                  </span>
                                              </div>
                                          );
                                      })}
                              </div>
                          </div>
                      )}

                      {/* Photo Gallery Preview */}
                      {property.images && property.images.length > 1 && (
                          <div className="mt-8">
                              <h3 className="mb-4 text-center text-sm font-medium text-muted-foreground">
                                  Photo Gallery
                              </h3>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                  {property.images
                                      .slice(1, 6)
                                      .map((image, index) => (
                                          <div
                                              key={index}
                                              className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border"
                                          >
                                              <img
                                                  src={image}
                                                  alt={`${property.name} ${index + 2}`}
                                                  className="h-full w-full object-cover"
                                              />
                                          </div>
                                      ))}
                              </div>
                          </div>
                      )}

                      {/* Contact Options */}
                      {(property.buttons.whatsapp.visible ||
                          property.buttons.website.visible) && (
                          <div className="mt-8 border-t pt-6">
                              <h3 className="mb-4 text-center text-sm font-medium text-muted-foreground">
                                  Contact Host
                              </h3>
                              <div className="flex justify-center gap-3">
                                  {property.buttons.whatsapp.visible &&
                                      property.buttons.whatsapp.url && (
                                          <a
                                              href={
                                                  property.buttons.whatsapp.url
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                          >
                                              <Button
                                                  variant="outline"
                                                  className="h-12 border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                              >
                                                  <IconBrandWhatsapp className="mr-2 h-5 w-5" />
                                                  WhatsApp
                                              </Button>
                                          </a>
                                      )}
                                  <Link
                                      href={`/${property.slug}`}
                                      className="block"
                                  >
                                      <Button
                                          variant="outline"
                                          className="h-12"
                                      >
                                          View Full Listing
                                      </Button>
                                  </Link>
                              </div>
                          </div>
                      )}

                      {/* Price Info */}
                      {property.base_price > 0 && (
                          <div className="mt-8 text-center">
                              <p className="text-xs text-muted-foreground">
                                  Starting from{' '}
                                  <span className="font-semibold text-foreground">
                                      {property.price_format ||
                                          `$${property.base_price}/night`}
                                  </span>
                              </p>
                          </div>
                      )}

                      {/* Footer */}
                      <div className="mt-12 border-t pt-6 text-center">
                          <div className="mb-3 flex items-center justify-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center">
                                  <img
                                      src="/brisa-logo.png"
                                      alt="Sora Logo"
                                      className="h-6 w-auto"
                                  />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">
                                  Powered by Sora
                              </span>
                          </div>
                          <p className="text-xs text-muted-foreground/60">
                              Book directly with {property.host.name} for the
                              best experience
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
}
