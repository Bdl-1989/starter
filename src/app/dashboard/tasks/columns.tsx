"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { DialogNewTask } from "./dialog"

export type Task = {
    id: string
    name: string
    type: "User demand research" | "Product proof-of-concept research" 
    user_portraits: string
    product_portraits: string
    status: "pending" | "processing" | "success" | "failed"
    create_at: string
  }

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "Task Id",
    cell: ({ row }) => {
      const value = row.getValue("id") as string
      return <div className="min-w-[100px] w-full truncate">{value}</div>
    }
  },
  {
    accessorKey: "name",
    header: "Task Name",
    cell: ({ row }) => {
      const value = row.getValue("name") as string
      return <div className="min-w-[150px] w-full truncate">{value}</div>
    }
  },
  {
    accessorKey: "type",
    header: "Task Type",
    cell: ({ row }) => {
      const value = row.getValue("type") as string
      return <div className="min-w-[200px] w-full truncate">{value}</div>
    }
  },
  {
    accessorKey: "user_portraits",
    header: "User Portraits",
    cell: ({ row }) => {
      const value = row.getValue("user_portraits") as string
      return <div className="min-w-[150px] w-full truncate">{value}</div>
    }
  },
  {
    accessorKey: "product_portraits",
    header: "Product Portraits",
    cell: ({ row }) => {
      const value = row.getValue("product_portraits") as string
      return <div className="min-w-[150px] w-full truncate">{value}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "create_at", 
    header: ({ column }) => {
        return (
          <Label 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <p>Create At</p>
            <ArrowUpDown className="  h-4 w-4" />
          </Label>
        )
      },
  }, 
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)
 
//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original
      const router = useRouter()
      
      const handleDelete = async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', task.id)

          if (error) throw error
          
          // 刷新页面以更新数据
          router.refresh()
        } catch (error) {
          console.error('Error deleting task:', error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Label className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Label>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task.id)}
            >
              Task Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogNewTask task={task} mode="edit" />
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
