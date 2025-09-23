import * as React from "react"
import {
  IconCircleCheckFilled,
  IconLoader,
  IconEye,
  IconMessage,
  IconCalendar,
  IconDotsVertical,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconCopy,
  IconArchive,
  IconMapPin,
  IconCurrencyDollar,
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
  DropdownMenuItem,
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

export const listingSchema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  status: z.string(),
  price: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  lastUpdated: z.string(),
  thumbnail: z.string(),
})

const columns: ColumnDef<z.infer<typeof listingSchema>>[] = [
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
    accessorKey: "title",
    header: "Property",
    cell: ({ row }) => {
      return (
        <Link
          href={`/property/${row.original.id}`}
          className="flex items-center gap-3 hover:bg-accent/50 rounded-md p-1 -m-1 transition-colors"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-medium">{row.original.title}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <IconMapPin className="size-3" />
              {row.original.location}
            </div>
          </div>
        </Link>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <IconCurrencyDollar className="size-3" />
        <span className="font-medium">{row.original.price}</span>
      </div>
    ),
  },
  {
    accessorKey: "bedrooms",
    header: "Details",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <IconCalendar className="size-3" />
        <span>{row.original.bedrooms} bed, {row.original.bathrooms} bath</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-1.5 ${
          row.original.status === "active"
            ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
            : "text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
        }`}
      >
        {row.original.status === "active" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
        ) : (
          <IconLoader className="mr-1" />
        )}
        {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.lastUpdated}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit?.(row.original)}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDuplicate?.(row.original)}>
              <IconCopy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => meta?.onArchive?.(row.original.id)}
            >
              <IconArchive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

interface ListingsTableProps {
  data: z.infer<typeof listingSchema>[]
  onEdit?: (property: z.infer<typeof listingSchema>) => void
  onDuplicate?: (property: z.infer<typeof listingSchema>) => void
  onArchive?: (propertyId: number) => void
}

export function ListingsTable({ data, onEdit, onDuplicate, onArchive }: ListingsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [showFilters, setShowFilters] = React.useState<boolean>(false)

  // Sort states
  const [sortBy, setSortBy] = React.useState<string>("none")
  const [sortOrder, setSortOrder] = React.useState<string>("asc")

  // Filter and sort the data based on selected filters and sort options
  const filteredData = React.useMemo(() => {
    let filtered = data.filter((property) => {
      const statusMatch = statusFilter === "all" || property.status === statusFilter
      return statusMatch
    })

    // Apply sorting if a sort option is selected
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (sortBy) {
          case "title":
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case "price":
            aValue = parseFloat(a.price.replace(/[^0-9.]/g, ''))
            bValue = parseFloat(b.price.replace(/[^0-9.]/g, ''))
            break
          case "bedrooms":
            aValue = a.bedrooms
            bValue = b.bedrooms
            break
          case "lastUpdated":
            aValue = new Date(a.lastUpdated).getTime()
            bValue = new Date(b.lastUpdated).getTime()
            break
          default:
            return 0
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    return filtered
  }, [data, statusFilter, sortBy, sortOrder])

  // Get unique values for filter options
  const uniqueStatuses = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.status)))
  }, [data])

  const table = useReactTable({
    data: filteredData,
    columns,
    meta: {
      onEdit,
      onDuplicate,
      onArchive,
    },
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Listings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your property listings and track their performance
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="bedrooms">Bedrooms</SelectItem>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
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

          {(statusFilter !== "all" || sortBy !== "none") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
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

      <div className="flex items-center justify-between">
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
