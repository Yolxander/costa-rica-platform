import { Head } from "@inertiajs/react"
import { useState, useEffect } from "react"
import {
  IconMapPin,
  IconUsers,
  IconBed,
  IconBath,
  IconHome,
  IconBrandAirbnb,
  IconBrandBooking,
  IconBrandWhatsapp,
  IconExternalLink,
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
  highlighted_amenities: string[]
  highlighted_images: string[]
  base_price: number
  price_format: string | null
  currency: string
  custom_message: string | null
  primary_color: string
  secondary_color: string
  show_welcome_message?: boolean
  show_booking_buttons?: boolean
  show_property_highlights?: boolean
  show_photo_gallery?: boolean
  show_contact_section?: boolean
  show_pricing?: boolean
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

export default function DiscoveryPage({ property: initialProperty }: DiscoveryPageProps) {
  const [draftOverrides, setDraftOverrides] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'discovery-page-preview-update') {
        setDraftOverrides(event.data.payload)
      }
    }
    window.addEventListener('message', handleMessage)

    // Notify parent that iframe is ready to receive messages
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'discovery-page-preview-ready' }, '*')
    }

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Section visibility flags — use draft overrides if available, otherwise read from server props
  const showWelcomeMessage = draftOverrides ? (draftOverrides.show_welcome_message as boolean) !== false : (initialProperty.show_welcome_message !== false)
  const showBookingButtons = draftOverrides ? (draftOverrides.show_booking_buttons as boolean) !== false : (initialProperty.show_booking_buttons !== false)
  const showPropertyHighlights = draftOverrides ? (draftOverrides.show_property_highlights as boolean) !== false : (initialProperty.show_property_highlights !== false)
  const showPhotoGallery = draftOverrides ? (draftOverrides.show_photo_gallery as boolean) !== false : (initialProperty.show_photo_gallery !== false)
  const showContactSection = draftOverrides ? (draftOverrides.show_contact_section as boolean) !== false : (initialProperty.show_contact_section !== false)
  const showPricing = draftOverrides ? (draftOverrides.show_pricing as boolean) !== false : (initialProperty.show_pricing !== false)

  // Merge draft overrides into property
  const property = draftOverrides
    ? {
        ...initialProperty,
        primary_color: (draftOverrides.primary_color as string) ?? initialProperty.primary_color,
        secondary_color: (draftOverrides.secondary_color as string) ?? initialProperty.secondary_color,
        custom_message: draftOverrides.show_welcome_message
          ? (draftOverrides.custom_message as string) || null
          : null,
        highlighted_amenities: (draftOverrides.highlighted_amenities as string[]) ?? initialProperty.highlighted_amenities,
        highlighted_images: (draftOverrides.highlighted_images as string[]) ?? initialProperty.highlighted_images,
        buttons: {
          book_direct: {
            visible: draftOverrides.show_book_direct_button as boolean,
            url: initialProperty.buttons.book_direct.url,
          },
          airbnb: {
            visible: draftOverrides.show_airbnb_button as boolean,
            url: (draftOverrides.airbnb_url as string) || initialProperty.buttons.airbnb.url,
          },
          bookingcom: {
            visible: draftOverrides.show_bookingcom_button as boolean,
            url: (draftOverrides.bookingcom_url as string) || initialProperty.buttons.bookingcom.url,
          },
          vrbo: {
            visible: draftOverrides.show_vrbo_button as boolean,
            url: (draftOverrides.vrbo_url as string) || initialProperty.buttons.vrbo.url,
          },
          whatsapp: {
            visible: draftOverrides.show_whatsapp_button as boolean,
            url: draftOverrides.whatsapp_number
              ? `https://wa.me/${(draftOverrides.whatsapp_number as string).replace(/\D/g, '')}`
              : initialProperty.buttons.whatsapp.url,
          },
          website: {
            visible: draftOverrides.show_website_button as boolean,
            url: (draftOverrides.website_url as string) || initialProperty.buttons.website.url,
          },
        },
      }
    : initialProperty

  const displayAmenities = property.highlighted_amenities?.length > 0
    ? property.highlighted_amenities
    : property.amenities?.slice(0, 6) ?? []

  const displayImages = property.highlighted_images?.length > 0
    ? property.highlighted_images
    : property.images?.slice(1, 6) ?? []

  return (
      <>
          <Head title={`${property.name} - Book Your Stay`} />
          <div className="min-h-screen bg-background">
              {/* Hero Image */}
              <div className="relative h-56 w-full overflow-hidden">
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
              <div className="relative -mt-12 px-4 pb-6">
                  <div className="mx-auto max-w-md">
                      {/* Property Info Card */}
                      <div className="mb-4 rounded-2xl border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                          <h1 className="mb-1 text-lg leading-tight font-bold text-card-foreground">
                              {property.name}
                          </h1>
                          <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
                              <IconMapPin className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                  {property.location}
                              </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                  <IconUsers className="h-3.5 w-3.5" />
                                  Sleeps {property.guests}
                              </span>
                              <span className="flex items-center gap-1">
                                  <IconBed className="h-3.5 w-3.5" />
                                  {property.bedrooms} bedrooms
                              </span>
                              <span className="flex items-center gap-1">
                                  <IconBath className="h-3.5 w-3.5" />
                                  {property.bathrooms} bathrooms
                              </span>
                          </div>
                      </div>

                      {/* Custom Message */}
                      {showWelcomeMessage && property.custom_message && (
                          <div className="mb-4 rounded-xl border bg-muted/50 p-3">
                              <p className="text-center text-xs text-muted-foreground italic">
                                  &ldquo;{property.custom_message}&rdquo;
                              </p>
                          </div>
                      )}

                      {/* Booking Buttons */}
                      {showBookingButtons && (
                      <div className="space-y-3">
                          {/* Book Direct - Primary CTA */}
                          {property.buttons.book_direct.visible && (
                              <a
                                  href={
                                      property.buttons.book_direct.url ||
                                      `/${property.slug}`
                                  }
                                  className="block"
                              >
                                  <button
                                      type="button"
                                      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white"
                                      style={{
                                          backgroundColor: property.primary_color,
                                      }}
                                  >
                                      <IconHome className="h-5 w-5" />
                                      Book Direct (Best Price)
                                  </button>
                              </a>
                          )}

                          {/* External Platforms */}
                          {property.buttons.airbnb.visible &&
                              property.buttons.airbnb.url && (
                                  <a
                                      href={property.buttons.airbnb.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                  >
                                      <button
                                          type="button"
                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                          style={{
                                              backgroundColor: property.secondary_color,
                                              borderColor: property.secondary_color,
                                          }}
                                      >
                                          <IconBrandAirbnb className="h-5 w-5 text-rose-500" />
                                          <span className="flex-1 text-white">Book on Airbnb</span>
                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                      </button>
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
                                      <button
                                          type="button"
                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                          style={{
                                              backgroundColor: property.secondary_color,
                                              borderColor: property.secondary_color,
                                          }}
                                      >
                                          <IconBrandBooking className="h-5 w-5 text-blue-500" />
                                          <span className="flex-1 text-white">Book on Booking.com</span>
                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                      </button>
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
                                      <button
                                          type="button"
                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                          style={{
                                              backgroundColor: property.secondary_color,
                                              borderColor: property.secondary_color,
                                          }}
                                      >
                                          <IconHome className="h-5 w-5 text-sky-400" />
                                          <span className="flex-1 text-white">Book on VRBO</span>
                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                      </button>
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
                                      <button
                                          type="button"
                                          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 text-sm font-medium shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                                          style={{
                                              backgroundColor: property.secondary_color,
                                              borderColor: property.secondary_color,
                                          }}
                                      >
                                          <IconExternalLink className="h-5 w-5 text-emerald-400" />
                                          <span className="flex-1 text-white">Visit Our Website</span>
                                          <IconExternalLink className="h-4 w-4 text-white opacity-70 transition-opacity group-hover:opacity-100" />
                                      </button>
                                  </a>
                              )}
                      </div>
                      )}

                      {/* Property Highlights */}
                      {showPropertyHighlights && displayAmenities.length > 0 && (
                          <div className="mt-6">
                              <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                  Property Highlights
                              </h3>
                              <div className="flex flex-wrap justify-center gap-2">
                                  {displayAmenities.map((amenity, index) => (
                                      <div
                                          key={index}
                                          className="flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-[10px]"
                                      >
                                          <span>
                                              {amenity.replace(/_/g, ' ')}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* Photo Gallery */}
                      {showPhotoGallery && displayImages.length > 0 && (
                          <div className="mt-6">
                              <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                  Photo Gallery
                              </h3>
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                  {displayImages.map((image, index) => (
                                      <div
                                          key={index}
                                          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border"
                                      >
                                          <img
                                              src={image}
                                              alt={`${property.name} ${index + 1}`}
                                              className="h-full w-full object-cover"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* Contact Host */}
                      {showContactSection && property.buttons.whatsapp.visible &&
                          property.buttons.whatsapp.url && (
                              <div className="mt-6 border-t pt-4">
                                  <h3 className="mb-3 text-center text-xs font-medium text-muted-foreground">
                                      Contact Host
                                  </h3>
                                  <div className="flex justify-center gap-2">
                                      <a
                                          href={property.buttons.whatsapp.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                      >
                                          <button
                                              type="button"
                                              className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 text-xs text-green-600 hover:bg-green-100"
                                          >
                                              <IconBrandWhatsapp className="h-4 w-4" />
                                              WhatsApp
                                          </button>
                                      </a>
                                  </div>
                              </div>
                          )}

                      {/* Price Info */}
                      {showPricing && property.base_price > 0 && (
                          <div className="mt-6 text-center">
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
                                  Powered by Sora
                              </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground/60">
                              Book directly with the host for the best experience
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </>
  );
}
