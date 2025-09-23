import * as React from "react"
import {
  IconCircleCheckFilled,
  IconLoader,
  IconEye,
  IconMessage,
  IconCalendar,
  IconArrowsUpDown,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react"
import { Link } from "@inertiajs/react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const propertySchema = z.object({
  id: z.number(),
  property: z.string(),
  type: z.string(),
  status: z.string(),
  views_7d: z.string(),
  views_30d: z.string(),
  inquiries: z.string(),
  bookings: z.string(),
})

const columns: ColumnDef<z.infer<typeof propertySchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => {
      return (
        <Link
          href={`/property/${row.original.id}`}
          className="flex flex-col gap-1 hover:bg-accent/50 rounded-md p-1 -m-1 transition-colors"
        >
          <div className="font-medium">{row.original.property}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.type}
          </div>
        </Link>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-1.5 ${
          row.original.status === "Active"
            ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
            : row.original.status === "Maintenance"
            ? "text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20"
            : "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
        }`}
      >
        {row.original.status === "Active" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
        ) : (
          <IconLoader className="mr-1" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "views_7d",
    header: "Views",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-sm">
          <IconEye className="size-3" />
          <span className="font-medium">{row.original.views_7d}</span>
          <span className="text-muted-foreground">(7d)</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.views_30d} total (30d)
        </div>
      </div>
    ),
  },
  {
    accessorKey: "inquiries",
    header: "Inquiries",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <IconMessage className="size-3" />
        <span className="font-medium">{row.original.inquiries}</span>
      </div>
    ),
  },
  {
    accessorKey: "bookings",
    header: "Bookings",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <IconCalendar className="size-3" />
        <span className="font-medium">{row.original.bookings}</span>
      </div>
    ),
  },
]

interface PropertyTableProps {
  data: z.infer<typeof propertySchema>[]
}

export function PropertyTable({ data }: PropertyTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Filter states
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [showFilters, setShowFilters] = React.useState<boolean>(false)

  // Sort states
  const [sortBy, setSortBy] = React.useState<string>("none")
  const [sortOrder, setSortOrder] = React.useState<string>("asc")

  // Filter and sort the data based on selected filters and sort options
  const filteredData = React.useMemo(() => {
    let filtered = data.filter((property) => {
      const typeMatch = typeFilter === "all" || property.type === typeFilter
      const statusMatch = statusFilter === "all" || property.status === statusFilter
      return typeMatch && statusMatch
    })

    // Apply sorting if a sort option is selected
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        let aValue: number
        let bValue: number

        switch (sortBy) {
          case "views":
            aValue = parseInt(a.views_7d)
            bValue = parseInt(b.views_7d)
            break
          case "inquiries":
            aValue = parseInt(a.inquiries)
            bValue = parseInt(b.inquiries)
            break
          case "bookings":
            aValue = parseInt(a.bookings)
            bValue = parseInt(b.bookings)
            break
          default:
            return 0
        }

        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    return filtered
  }, [data, typeFilter, statusFilter, sortBy, sortOrder])

  // Get unique values for filter options
  const uniqueTypes = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.type)))
  }, [data])

  const uniqueStatuses = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.status)))
  }, [data])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Performance</h3>
          <p className="text-sm text-muted-foreground">
            Track views, inquiries, and bookings across all properties
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent text-accent-foreground" : ""}
          >
            Filters
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters and Sorting */}
      {showFilters && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by:</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No sorting</SelectItem>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="inquiries">Inquiries</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
              </SelectContent>
            </Select>

            {sortBy !== "none" && (
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {(typeFilter !== "all" || statusFilter !== "all" || sortBy !== "none") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter("all")
                setStatusFilter("all")
                setSortBy("none")
                setSortOrder("asc")
              }}
              className="text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {filteredData.length} properties
            {filteredData.length !== data.length && (
              <span> (filtered from {data.length} total)</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
