import { type Icon } from "@tabler/icons-react"
import { Link, usePage } from "@inertiajs/react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavGroup({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    lockIcon?: Icon
  }[]
  label: string
}) {
  const { page } = usePage()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const currentUrl = page?.url || ''
            const isActive = currentUrl.startsWith(item.url) || currentUrl === item.url

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
                    {item.lockIcon && (
                      <item.lockIcon className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
