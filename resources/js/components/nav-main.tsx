import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import { usePage, Link, router } from "@inertiajs/react"
import { useState } from "react"

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
          {items.map((item) => {
            const isActive = page.url === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={isActive ? "bg-secondary text-white" : ""}
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
