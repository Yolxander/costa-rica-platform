import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { IconBell, IconCirclePlusFilled, IconArrowLeft } from "@tabler/icons-react"
import { usePage, router } from "@inertiajs/react"
import { useState } from "react"
import { QuickAddModal } from "@/components/quick-add-modal"
import { AddPropertyModal } from "@/components/add-property-modal"

export function SiteHeader() {
  const page = usePage()
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false)
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const handleQuickAddClick = () => {
    setIsQuickAddModalOpen(true)
  }

  const handleCloseQuickAddModal = () => {
    setIsQuickAddModalOpen(false)
  }

  const handleAddProperty = () => {
    setIsAddPropertyModalOpen(true)
  }

  const handleCloseAddPropertyModal = () => {
    setIsAddPropertyModalOpen(false)
  }

  const handleUpdateAvailability = () => {
    router.visit('/calendar')
  }

  const handleUploadImage = () => {
    console.log("Upload image clicked")
  }

  const shouldShowBackButton = () => {
    const url = page.url
    // /discovery-pages/*/edit
    if (url.match(/\/discovery-pages\/\d+\/edit/)) return true
    // /property/*
    if (url.match(/\/property\/\d+/)) return true
    // /socials/create
    if (url === '/socials/create') return true
    // /marketing/email/new
    if (url === '/marketing/email/new') return true
    return false
  }

  const getBackUrl = () => {
    const url = page.url
    if (url.match(/\/discovery-pages\/\d+\/edit/)) return '/listings'
    if (url.match(/\/property\/\d+/)) return '/listings'
    if (url === '/socials/create') return '/socials'
    if (url === '/marketing/email/new') return '/marketing'
    return '/'
  }

  const getHeaderTitle = () => {
    if (page.url === "/dashboard" || page.url === "/") {
      return "Dashboard"
    }
    if (page.url === "/listings") {
      return "Listings Management"
    }
    if (page.url.startsWith("/property/")) {
      return "Property Details"
    }
    if (page.url === "/inquiries") {
      return "Inquiries & Messaging"
    }
    if (page.url === "/calendar") {
      return "Calendar & Availability"
    }
    // Marketing routes
    if (page.url.match(/\/marketing\/social\/\d+\/edit/)) {
      const isPreview = page.url.includes("preview=1")
      return isPreview ? "Preview Post" : "Edit Post"
    }
    if (page.url.match(/\/marketing\/email\/\d+\/edit/)) {
      const isPreview = page.url.includes("preview=1")
      return isPreview ? "Preview Email" : "Edit Email"
    }
    // Derive title from URL path for other pages
    const path = page.url.split('?')[0].split('/').filter(Boolean).pop()
    if (path) {
      return path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
    return "Dashboard"
  }
  return (
    <>
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getHeaderTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          {shouldShowBackButton() ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.visit(getBackUrl())}
              className="gap-1"
            >
              <IconArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <>
              <Button
                size="icon"
                className="size-8 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleQuickAddClick}
              >
                <IconCirclePlusFilled />
                <span className="sr-only">Quick Add</span>
              </Button>
              <Button
                size="icon"
                className="size-8"
                variant="outline"
              >
                <IconBell />
                <span className="sr-only">Notifications</span>
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
    <QuickAddModal
      isOpen={isQuickAddModalOpen}
      onClose={handleCloseQuickAddModal}
      onAddProperty={handleAddProperty}
      onUpdateAvailability={handleUpdateAvailability}
      onUploadImage={handleUploadImage}
    />
    <AddPropertyModal
      isOpen={isAddPropertyModalOpen}
      onClose={handleCloseAddPropertyModal}
    />
  </>
  )
}
