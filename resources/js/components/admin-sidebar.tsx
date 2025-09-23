import * as React from "react"
import {
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconHome,
  IconList,
  IconCalendar,
  IconMessage,
  IconChartLine,
  IconCreditCard,
  IconBell,
  IconLock,
  IconUsers,
  IconBuilding,
  IconReceipt,
  IconFileText,
  IconMail,
  IconChartBar,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavGroup } from "@/components/nav-group"
import { NavSecondary } from "@/components/nav-secondary"
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
      title: "Host Management",
      url: "/admin/hosts",
      icon: IconUsers,
    },
    {
      title: "Property Listings",
      url: "/admin/properties",
      icon: IconBuilding,
    },
    {
      title: "Renewals & Billing",
      url: "/admin/billing",
      icon: IconReceipt,
    },
  ],
  navContent: [
    {
      title: "Content Management",
      url: "/admin/content",
      icon: IconFileText,
    },
    {
      title: "Traveler Inquiries",
      url: "/admin/inquiries",
      icon: IconMail,
    },
    {
      title: "Analytics & Reports",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      lockIcon: IconLock,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      lockIcon: IconLock,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
      lockIcon: IconLock,
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
        <NavMain items={data.navMain} />
        <NavGroup items={data.navManagement} label="Management" />
        <NavGroup items={data.navContent} label="Content & Support" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
