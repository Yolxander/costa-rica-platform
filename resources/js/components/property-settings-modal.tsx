import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface PropertySettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PropertySettingsModal({ isOpen, onClose }: PropertySettingsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Property Settings</DialogTitle>
                    <DialogDescription>
                        Configure your property listing preferences and availability settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="instant-booking">Instant Booking</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow guests to book without approval
                            </p>
                        </div>
                        <Checkbox id="instant-booking" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cancellation">Cancellation Policy</Label>
                        <Select defaultValue="flexible">
                            <SelectTrigger id="cancellation">
                                <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="flexible">Flexible</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="strict">Strict</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="advance-booking">Advance Booking Window</Label>
                        <Select defaultValue="12">
                            <SelectTrigger id="advance-booking">
                                <SelectValue placeholder="Select months" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">3 months</SelectItem>
                                <SelectItem value="6">6 months</SelectItem>
                                <SelectItem value="12">12 months</SelectItem>
                                <SelectItem value="24">24 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="calendar-sync">Sync with Calendar</Label>
                            <p className="text-sm text-muted-foreground">
                                Block dates from external calendars
                            </p>
                        </div>
                        <Checkbox id="calendar-sync" defaultChecked />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Save Settings</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
