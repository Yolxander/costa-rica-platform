import * as React from "react"
import { IconHome, IconCalendar, IconPhoto, IconLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProperty: () => void
  onUpdateAvailability: () => void
  onUploadImage: () => void
}

export function QuickAddModal({
  isOpen,
  onClose,
  onAddProperty,
  onUpdateAvailability,
  onUploadImage
}: QuickAddModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What would you like to do?</DialogTitle>
          <DialogDescription>
            Choose an action to quickly manage your properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
            onClick={() => {
              onAddProperty()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconHome className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Add Property</span>
              <span className="text-sm text-muted-foreground">Create a new property listing</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
            onClick={() => {
              onUpdateAvailability()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconCalendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Update Availability</span>
              <span className="text-sm text-muted-foreground">Manage property availability calendar</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
            onClick={() => {
              onUploadImage()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconPhoto className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start flex-1">
              <span className="font-medium">Upload Image</span>
              <span className="text-sm text-muted-foreground">Add photos to your properties</span>
            </div>
            <IconLock className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
