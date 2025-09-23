import * as React from "react"
import { IconCheck, IconCreditCard, IconMessage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AdminQuickActionsModalProps {
  isOpen: boolean
  onClose: () => void
  onApproveListing: () => void
  onExtendSubscription: () => void
  onSendMessage: () => void
}

export function AdminQuickActionsModal({
  isOpen,
  onClose,
  onApproveListing,
  onExtendSubscription,
  onSendMessage
}: AdminQuickActionsModalProps) {
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
              onApproveListing()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Approve Listing</span>
              <span className="text-sm text-muted-foreground">Review and approve property listings</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
            onClick={() => {
              onExtendSubscription()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconCreditCard className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">Extend Subscription</span>
              <span className="text-sm text-muted-foreground">Extend host subscription period</span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 flex items-center justify-start gap-4 text-left hover:bg-primary/5 hover:border-primary/20 transition-colors"
            onClick={() => {
              onSendMessage()
              onClose()
            }}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <IconMessage className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start flex-1">
              <span className="font-medium">Send Message</span>
              <span className="text-sm text-muted-foreground">Send message to hosts or travelers</span>
            </div>
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
