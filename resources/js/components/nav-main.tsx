import { IconCirclePlusFilled, IconBell, type Icon } from "@tabler/icons-react"
import { usePage, Link, router } from "@inertiajs/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { QuickAddModal } from "@/components/quick-add-modal"
import { AddPropertyModal } from "@/components/add-property-modal"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
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
    // TODO: Implement upload image functionality
    console.log("Upload image clicked")
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Add"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={handleQuickAddClick}
            >
              <IconCirclePlusFilled />
              <span>+ Quick Add</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconBell />
              <span className="sr-only">Notifications</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = page.url === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
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
    </SidebarGroup>
  )
}
