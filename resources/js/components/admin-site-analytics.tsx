import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { IconTrendingUp, IconUsers, IconEye, IconMail, IconClock } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AdminSiteAnalyticsProps {
  site_analytics: Array<{
    date: string
    page_views: number
    unique_visitors: number
    property_views: number
    inquiry_submissions: number
    bounce_rate: number
    avg_session_duration: number
  }>
}

export function AdminSiteAnalytics({ site_analytics }: AdminSiteAnalyticsProps) {
  // Calculate totals for the period
  const totalPageViews = site_analytics.reduce((sum, day) => sum + day.page_views, 0)
  const totalUniqueVisitors = site_analytics.reduce((sum, day) => sum + day.unique_visitors, 0)
  const totalPropertyViews = site_analytics.reduce((sum, day) => sum + day.property_views, 0)
  const totalInquiries = site_analytics.reduce((sum, day) => sum + day.inquiry_submissions, 0)
  const avgBounceRate = site_analytics.reduce((sum, day) => sum + day.bounce_rate, 0) / site_analytics.length
  const avgSessionDuration = site_analytics.reduce((sum, day) => sum + day.avg_session_duration, 0) / site_analytics.length

  // Format data for charts
  const chartData = site_analytics.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    page_views: day.page_views,
    unique_visitors: day.unique_visitors,
    property_views: day.property_views,
    inquiry_submissions: day.inquiry_submissions,
    bounce_rate: day.bounce_rate,
    avg_session_duration: day.avg_session_duration,
  }))

  return (
    <div className="space-y-6">

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Traffic Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>
              Page views and unique visitors over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="page_views"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Page Views"
                />
                <Area
                  type="monotone"
                  dataKey="unique_visitors"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Unique Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Views vs Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle>Property Engagement</CardTitle>
            <CardDescription>
              Property views and inquiry submissions correlation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="property_views"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Property Views"
                />
                <Line
                  type="monotone"
                  dataKey="inquiry_submissions"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Inquiries"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
