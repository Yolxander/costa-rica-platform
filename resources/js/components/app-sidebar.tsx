import * as React from "react"
import { usePage } from "@inertiajs/react"
import { type SharedData } from "@/types"
import {
  IconSettings,
  IconHome,
  IconList,
  IconCalendar,
  IconMessage,
  IconUsers,
  IconBrandInstagram,
  IconLayoutGrid,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavGroup } from "@/components/nav-group"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
  ],
  navPropertyManagement: [
    {
      title: "Listings",
      url: "/listings",
      icon: IconList,
    },
    {
      title: "Discovery Pages",
      url: "/discovery-pages",
      icon: IconLayoutGrid,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: IconCalendar,
    },
  ],
  navCommunication: [
    {
      title: "Inquiries",
      url: "/inquiries",
      icon: IconMessage,
    },
    {
      title: "Guest CRM",
      url: "/crm",
      icon: IconUsers,
    },
    {
      title: "Marketing",
      url: "/marketing",
      icon: IconBrandInstagram,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<SharedData>().props
  const user = auth.user

  return (
      <Sidebar collapsible="offcanvas" {...props}>
          <SidebarHeader>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton
                          asChild
                          className="data-[slot=sidebar-menu-button]:!p-1.5"
                      >
                          <a href="/dashboard">
                              <img
                                  src="/brisa-logo.png"
                                  alt="Sora Logo"
                                  className="h-5 w-auto"
                              />
                              <span className="text-base font-semibold">
                                  Sora
                              </span>
                          </a>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
              <NavMain items={data.navMain} />
              <NavGroup
                  items={data.navPropertyManagement}
                  label="Property Management"
              />
              <NavGroup items={data.navCommunication} label="Communication" />
              <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>
          <SidebarFooter>
              <NavUser user={user} />
          </SidebarFooter>
      </Sidebar>
  );
}
