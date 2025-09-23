import { IconCirclePlusFilled, IconBell, type Icon } from "@tabler/icons-react"
import { usePage } from "@inertiajs/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const handleAddPropertyClick = () => {
    setIsAddPropertyModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddPropertyModalOpen(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Add New Property"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={handleAddPropertyClick}
            >
              <IconCirclePlusFilled />
              <span>Add New Property</span>
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
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={handleCloseModal}
      />
    </SidebarGroup>
  )
}
