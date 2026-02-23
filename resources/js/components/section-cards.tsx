import { IconCalendar, IconCurrencyDollar, IconMail, IconWallet } from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  directBookings: number
  revenueProcessed: number
  guestEmailsCaptured: number
  moneySaved: number
}

export function SectionCards({
  directBookings,
  revenueProcessed,
  guestEmailsCaptured,
  moneySaved,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Direct Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {directBookings.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <IconCalendar className="mr-2 inline size-4" />
          Total direct bookings
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Revenue Processed</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${revenueProcessed.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <IconCurrencyDollar className="mr-2 inline size-4" />
          Via Stripe Connect
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Guest Emails Captured</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {guestEmailsCaptured.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <IconMail className="mr-2 inline size-4" />
          CRM size
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Money Saved vs OTA</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-green-600 @[250px]/card:text-3xl">
            ${moneySaved.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          <IconWallet className="mr-2 inline size-4" />
          Estimated 15% OTA fee saved
        </CardFooter>
      </Card>
    </div>
  )
}
