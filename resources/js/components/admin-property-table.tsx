import * as React from "react"
import {
  IconCircleCheckFilled,
  IconLoader,
  IconMessage,
  IconCalendar,
  IconClock,
  IconUser,
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

const propertySchema = z.object({
  id: z.number(),
  property: z.string(),
  type: z.string(),
  status: z.string(),
  approval_status: z.string(),
  host_name: z.string(),
  inquiries: z.string(),
  bookings: z.string(),
  created_at: z.string(),
})

type Property = z.infer<typeof propertySchema>

const columns: ColumnDef<Property>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "property",
    header: "Property",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("property")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "host_name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2">
          <IconUser className="h-4 w-4" />
          Host
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("host_name")}</div>
    ),
  },
  {
    accessorKey: "approval_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("approval_status") as string
      const variant = status === "approved" ? "default" : status === "pending" ? "secondary" : "destructive"
      const icon = status === "approved" ? IconCircleCheckFilled : status === "pending" ? IconClock : IconLoader
      const Icon = icon

      return (
        <Badge variant={variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "inquiries",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2">
          <IconMessage className="h-4 w-4" />
          Inquiries
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("inquiries")}</div>
    },
  },
  {
    accessorKey: "bookings",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2">
          <IconCalendar className="h-4 w-4" />
          Bookings
        </div>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("bookings")}</div>
    },
  },
]

interface AdminPropertyTableProps {
  data: Property[]
}

export function AdminPropertyTable({ data }: AdminPropertyTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Property Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage property listings and track their performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={(table.getColumn("approval_status")?.getFilterValue() as string) ?? ""}
            onValueChange={(event) =>
              table.getColumn("approval_status")?.setFilterValue(event === "all" ? "" : event)
            }
          >
            <SelectTrigger className="h-8 w-[150px] lg:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
