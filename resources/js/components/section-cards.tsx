import { IconTrendingDown, IconTrendingUp, IconEye, IconMessage, IconCalendar, IconBell } from "@tabler/icons-react"
import data from "@/pages/data.json"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  // Calculate metrics from property data
  const totalViews7d = data.reduce((sum, property) => sum + parseInt(property.views_7d), 0)
  const totalViews30d = data.reduce((sum, property) => sum + parseInt(property.views_30d), 0)
  const totalInquiries = data.reduce((sum, property) => sum + parseInt(property.inquiries), 0)
  const totalBookings = data.reduce((sum, property) => sum + parseInt(property.bookings), 0)

  // Calculate notifications (inquiries + incomplete items)
  const incompleteItems = data.filter(property => property.status === "Maintenance").length
  const notifications = totalInquiries + incompleteItems
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Property Views (Last 7 Days)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalViews7d.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peak viewing period <IconEye className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {totalViews30d.toLocaleString()} total views (30d)
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inquiries Received</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInquiries}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong lead generation <IconMessage className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Response time under 2 hours
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Upcoming Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalBookings}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Next 30 days confirmed <IconCalendar className="size-4" />
          </div>
          <div className="text-muted-foreground">Occupancy rate 78%</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Messages</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {notifications}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              <IconBell className="size-3" />
              Action Required
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Inquiries & maintenance alerts <IconBell className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {totalInquiries} inquiries, {incompleteItems} maintenance items
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
