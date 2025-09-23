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
import { AdminQuickActionsModal } from "@/components/admin-quick-actions-modal"

export function AdminNavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const { page } = usePage()
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false)

  const handleQuickActionsClick = () => {
    setIsQuickActionsModalOpen(true)
  }

  const handleCloseQuickActionsModal = () => {
    setIsQuickActionsModalOpen(false)
  }

  const handleApproveListing = () => {
    console.log("Approve listing clicked")
    // TODO: Implement approve listing functionality
  }

  const handleExtendSubscription = () => {
    console.log("Extend subscription clicked")
    // TODO: Implement extend subscription functionality
  }

  const handleSendMessage = () => {
    console.log("Send message clicked")
    // TODO: Implement send message functionality
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Actions"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={handleQuickActionsClick}
            >
              <IconCirclePlusFilled />
              <span>Quick Actions</span>
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
            const isActive = page?.url === item.url
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
      <AdminQuickActionsModal
        isOpen={isQuickActionsModalOpen}
        onClose={handleCloseQuickActionsModal}
        onApproveListing={handleApproveListing}
        onExtendSubscription={handleExtendSubscription}
        onSendMessage={handleSendMessage}
      />
    </SidebarGroup>
  )
}
