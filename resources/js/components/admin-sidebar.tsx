import * as React from "react"
import {
  IconInnerShadowTop,
  IconHome,
  IconUsers,
  IconBuilding,
  IconReceipt,
} from "@tabler/icons-react"

import { AdminNavMain } from "@/components/admin-nav-main"
import { NavGroup } from "@/components/nav-group"
import { AdminNavUser } from "@/components/admin-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Costa Rica Rental Hub",
    email: "admin@costaricarentalhub.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: IconHome,
    },
  ],
  navManagement: [
    {
      title: "Hosts",
      url: "/admin/hosts",
      icon: IconUsers,
    },
    {
      title: "Properties",
      url: "/admin/properties",
      icon: IconBuilding,
    },
    {
      title: "Billing",
      url: "/admin/billing",
      icon: IconReceipt,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Costa Rica Rental Hub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={data.navMain} />
        <NavGroup items={data.navManagement} label="Management" />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
